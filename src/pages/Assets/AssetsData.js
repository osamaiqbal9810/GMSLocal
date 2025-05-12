import { LocationCityOutlined, LocationOnOutlined, MapsHomeWorkOutlined } from '@mui/icons-material';

import { Box, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import genRunning from "../../Images/genRunning.png";
import genDefault from "../../Images/genDefault.png";
import LoadingScreen from 'react-loading-screen';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import genOn from "../../Images/genOn.PNG"
import noSource from "../../Images/noSource.png"
import mainOn from "../../Images/mainOn.PNG";
import { getServerEndpoint } from '../../utils/serverEndpoint';
import "../Assets/assetsData.css";
import bothSource from "../../Images/bothSource.PNG"
import { useSelector, useDispatch } from 'react-redux';
import {list,updateAsset,updateAts} from "../../Slice/assetsListSlice"
import coolantTemp from "../../Images/coolantTemp.png"
import rpm from "../../Images/rpm.png";
import feulLevel from "../../Images/feulLevel.png"
import batteryVoltage from "../../Images/batteryVoltage.png"
import Current from "../../Images/Current.png"
import Voltage from "../../Images/Voltage.png"
import logo from '../../Images/logo.png'

function AssetsData() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: getServerEndpoint()
  });
  const [atsList, setAtsList] = useState([]);
  const [allAssetsList, setAllAssetList] = useState([]);
  const [onlyDevices, setOnlyDevices] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [supportedDevices, setSupportedDevices] = React.useState([]);

  useEffect(() => {
    async function getAsset() {
      setLoading(true);
      const response = await api.get('/api/asset', {
        headers: { Authorization: localStorage.getItem('access_token') },

        user: localStorage.getItem('loggedInUser')
      });
      if (response.status === 200) {
        setAllAssetList(response.data.assetsList);
        dispatch(list(response.data.assetsList));
        const devices = response.data.assetsList.filter(({ assetType }) => assetType == "device");
        setOnlyDevices(devices);
      }
      setLoading(false);
    }
    getAsset();

  }, []);


  useEffect(() => {
    async function getSupportedDevices() {
      const response = await api.get('/api/devices', {
        headers: { Authorization: localStorage.getItem('access_token') },
        user: localStorage.getItem('loggedInUser')
      });
      if (response.status === 200) {
        setSupportedDevices(response.data.assetsList);
      }
    }
    getSupportedDevices();
  }, []);


  const openDevice = (id) => {
    navigate('/dashboard/' + id);
  };

  const icons = [LocationCityOutlined, MapsHomeWorkOutlined, LocationOnOutlined];
  const locations = ["City", "Location", "Asset"];
  const resp = useSelector((state) => state.updateAsset.asset);
  const listAts = useSelector((state) => state.updateAts.atsList);

  useEffect(() => {
    setAllAssetList(resp);
    setAtsList(listAts);
  }, [resp, listAts]);

  return (
    <LoadingScreen
      loading={loading}
      bgColor='#1B1464'
      spinnerColor='#9ee5f8'
      textColor='#ffff'
      logoSrc={logo}
      text='Loading ...'
    >
      {onlyDevices.length > 0 ?
        <div>
          {allAssetsList.map((value, index) => {
            if (allAssetsList.length > 0 && value.assetType === "Floor") {

              let generatorAtLocation;
              let atsAtLocation;
              let asset;

              let devices = allAssetsList.filter(({ assetType }) => assetType === "device");
              let generators = devices.filter(({ suppDevice }) => suppDevice.type === "GENSET");
              generatorAtLocation = generators.find(({ parentAsset }) => parentAsset === value._id);
              atsAtLocation = atsList.find(({ parentAsset }) => parentAsset === value._id);

              if (generatorAtLocation !== undefined || atsAtLocation !== undefined) {
                let state, genState, atsState, genStatus;
                if (atsAtLocation !== undefined) {
                  state = atsAtLocation.hasOwnProperty('state') ? atsAtLocation.state : '';
                  atsState = atsAtLocation.hasOwnProperty('state') ? atsAtLocation.state : '';
                }
                if (generatorAtLocation !== undefined) {
                  genState = generatorAtLocation.hasOwnProperty('state') ? generatorAtLocation.state : '';
                  if (generatorAtLocation && generatorAtLocation.hasOwnProperty('state')) {
                    if (generatorAtLocation.state.hasOwnProperty('genStatus')) {
                      if (generatorAtLocation.state.genStatus.hasOwnProperty('value')) {
                        genStatus = generatorAtLocation.state.genStatus.value;
                      }
                    }
                    else if (generatorAtLocation.state.hasOwnProperty('engineSpeed')) {
                      if (generatorAtLocation.state.engineSpeed.hasOwnProperty('value')) {
                        if (generatorAtLocation.state.engineSpeed?.value >= 300) {
                          genStatus = "Running";
                        }
                        else {
                          genStatus = "Off";
                        }
                      }
                    }
                  }
                }

                let prefSrcAvail, standbySrcAvail;
                if (state !== undefined && state.hasOwnProperty('systemOverview')) {
                  prefSrcAvail = state.systemOverview.value.prefSrcAvail;
                  standbySrcAvail = state.systemOverview.value.standbySrcAvail;
                }
                //for finding location maps for stepper
                const steps = [];
                Object.keys(value.levels).map((val) => {
                  if (val !== 'currentLevel') {
                    asset = allAssetsList.find(({ _id }) => _id === value.levels[val]);
                    if (asset !== undefined) {
                      steps.push(asset.unitId);
                    }
                  }
                })
                //end


                return (
                  <div key={index} style={{ marginTop: '10px' }}>

                    <ToastContainer />
                    <Container maxWidth="true" sx={{
                      alignItems: 'center',
                      background: 'white',
                      border: '2px solid grey',
                      margin: '0',
                      padding: "0!important"
                    }}>
                      <Grid
                        container
                        spacing={1}
                        onClick={() => openDevice(value._id)}
                        sx={{ marginLeft: "4px" }}

                      >
                        <Grid
                          as={Card}
                          container
                          spacing={1}
                          margin={1}
                          padding={1}
                          style={{ display: "", background: '#1B1464', borderRadius: 0, marginLeft: "-4px" }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', flex: 8 }}>
                            <label style={{ color: 'white', fontSize: '18px' }}>
                              <b>Genset Name:</b>
                              {generatorAtLocation ? generatorAtLocation.suppDevice.name : ''}
                            </label>
                            {
                              atsAtLocation !== undefined ?
                                <label style={{ color: 'white', fontSize: '18px' }}>
                                  <b>ATS Name:</b>
                                  {atsAtLocation ? atsAtLocation.suppDevice.name : ''}
                                </label> : null
                            }
                          </div>
                          <div style={{ flex: 8, display: "flex", alignItems: "center" }}>
                            <Box sx={{ width: '100%' }}>
                              <Stepper alternativeLabel>
                                {steps.map((label, index) => {
                                  return (
                                    <Step key={index}>
                                      <Tooltip title={locations[index]} placement="top">
                                        <StepLabel StepIconComponent={icons[index]} style={{ color: "white" }}>{label}</StepLabel>
                                      </Tooltip>
                                    </Step>
                                  );
                                })}
                              </Stepper>
                            </Box>
                          </div>
                        </Grid>
                        <Grid item xs={12} md={12} style={{ padding: '20px' }}>
                          <Grid container spacing={2}>
                            {
                              atsAtLocation !== undefined ?
                                <Grid sx={{ margin: 'auto', boxShadow: "0 0px 3px 0 rgb(118 134 154 / 90%)", padding: "16px" }} item xs={12} md={5}>
                                  {
                                    prefSrcAvail !== '' && standbySrcAvail !== '' ? <img src={
                                      prefSrcAvail === "Yes" && standbySrcAvail === "Yes" ? bothSource :
                                        prefSrcAvail === "Yes" && standbySrcAvail === "No" ? mainOn :
                                          standbySrcAvail === "Yes" && prefSrcAvail === "No" ? genOn : noSource
                                    } alt="power source" style={{ margin: "auto", padding: "10px", height: "308px" }} />
                                      :
                                      null
                                  }
                                </Grid>
                                : null
                            }
                            {
                              atsAtLocation == undefined && generatorAtLocation !== undefined ?
                                <Grid sx={{ margin: 'auto', boxShadow: "0 0px 3px 0 rgb(118 134 154 / 90%)", padding: "16px" }} item xs={12} md={5}>
                                  {
                                    <img
                                      src={
                                        genStatus === 'Running'
                                          ? genRunning : genDefault
                                      }
                                      alt="power source"
                                      height="300px"
                                      style={{ margin: 'auto', padding: '10px' }}
                                    />
                                  }
                                </Grid>
                                : null
                            }
                            {generatorAtLocation !== undefined ?
                              <Grid item xs={12} md={4}>
                                <Card sx={{ background: '#fff', borderRadius: '0' }}>
                                  <Typography className="generator-title" variant="h5">
                                    Key Information
                                  </Typography>
                                  <CardContent>
                                    {
                                      genState !== undefined ?
                                        <div style={{ height: '230px', overflowY: "scroll" }}>
                                          <div>
                                            {
                                              // styling for making background red and blinking
                                             // style={{ background: genState.coolantTemp.hasOwnProperty('value') ? genState.coolantTemp.value > 244.4 ? "rgb(245 157 151 / 74%)" : "" : "" }}
                                             // className={genState.coolantTemp.hasOwnProperty('value') ? genState.coolantTemp.value > 244.4 ? "data-flex blink" : "data-flex" : ''}
                                              genState.hasOwnProperty('coolantTemp') ?
                                                <div className='data-flex'>
                                                  <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img src={coolantTemp} style={{ width: "30px" }} />
                                                    <h4>Coolant Temperature</h4>
                                                  </div>
                                                  <h4>{genState.coolantTemp.hasOwnProperty('value') ? genState.coolantTemp.value+" " : ''}<span><b>&deg;F</b></span></h4>
                                                </div>
                                                : null
                                            }
                                          </div>
                                          <div>
                                            {
                                              // styling for making background red and blinking
                                              // style={{ background: genState.engineSpeed.hasOwnProperty('value') ? genState.engineSpeed.value >= 10 && genState.engineSpeed.value <= 900 ? "rgb(245 157 151 / 74%)" : "" : "" }}
                                              //  className={genState.engineSpeed.hasOwnProperty('value') ? genState.engineSpeed.value >= 10 && genState.engineSpeed.value <= 900 ? "data-flex blink" : "data-flex" : ""} 
                                              genState.hasOwnProperty('engineSpeed') ?
                                                <div className='data-flex'>
                                                  <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img style={{ width: "30px" }} src={rpm} />
                                                    <h4>Engine RPM</h4>
                                                  </div>
                                                  <h4 >{genState.engineSpeed.hasOwnProperty('value') ? genState.engineSpeed.value : ''}</h4>
                                                </div>
                                                : null
                                            }
                                          </div>
                                          <div>
                                            {
                                              // styling for making background red and blinking
                                              // style={{ background: genState.fuelLevel.hasOwnProperty('value') ? genState.fuelLevel.value < 15 ? "rgb(245 157 151 / 74%)" : generatorAtLocation.state.fuelLevel.value < 30 ? "#e5815c" : "" : "" }}
                                              //  className={genState.fuelLevel.hasOwnProperty('value') ? genState.fuelLevel.value < 15 ? "data-flex blink" : "data-flex" : ""}
                                              genState.hasOwnProperty('fuelLevel') ?
                                                <div className='data-flex'>
                                                  <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img src={feulLevel} style={{ width: "30px" }} />
                                                    <h4>FueL Level</h4>
                                                  </div>
                                                  <h4>{genState.fuelLevel.hasOwnProperty('value') ? genState.fuelLevel.value + " %" : ''}</h4>
                                                </div>
                                                : null
                                            }
                                          </div>
                                          <div>
                                            {
                                              // styling for making background red and blinking
                                              // style={{ background: genState.batteryVoltage.hasOwnProperty('value') ? generatorAtLocation?.suppDevice?.name =="Decision-Maker 3000 Generator Set Controller" && genState.batteryVoltage.value <= 18 ? "rgb(245 157 151 / 74%)" : genState.batteryVoltage.hasOwnProperty('value') ? generatorAtLocation?.suppDevice?.name =="APM 303 Generator Controller" && genState.batteryVoltage.value <= 10.5 ? "rgb(245 157 151 / 74%)" :"" : "":"" }}
                                              // className={genState.batteryVoltage.hasOwnProperty('value') ? generatorAtLocation?.suppDevice?.name =="Decision-Maker 3000 Generator Set Controller" && genState.batteryVoltage.value <= 18 ? "data-flex blink" :generatorAtLocation?.suppDevice?.name !=="Decision-Maker 3000 Generator Set Controller" && genState.batteryVoltage.value <= 10.5 ? 'data-flex blink' :"data-flex" : ''}
                                              generatorAtLocation && genState.hasOwnProperty('batteryVoltage') ?
                                                <div className='data-flex'>
                                                  <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img src={batteryVoltage} style={{ width: "20px" }} />
                                                    <h4>Battery Voltage</h4>
                                                  </div>
                                                  <h4>{genState.batteryVoltage.hasOwnProperty('value') ? genState.batteryVoltage.value + " Volts" : ''}</h4>
                                                </div>
                                                : null
                                            }
                                          </div>


                                          <div>
                                            {
                                              genState.hasOwnProperty('Va') ?
                                                <div className="data-flex">
                                                  <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img src={Voltage} style={{ width: "30px" }} />
                                                    <h4>Voltage A</h4>
                                                  </div>
                                                  <h4>{genState.Va.hasOwnProperty('value') ? genState.Va.value + " Volt" : ''}</h4>
                                                </div>
                                                : null
                                            }
                                          </div>

                                          <div>
                                            {
                                              genState.hasOwnProperty('Vb') ?
                                                <div className="data-flex">
                                                  <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img src={Voltage} style={{ width: "30px" }} />
                                                    <h4>Voltage B</h4>
                                                  </div>
                                                  <h4>{genState.Vb.hasOwnProperty('value') ? genState.Vb.value + " Volt" : ''}</h4>
                                                </div>
                                                : null
                                            }
                                          </div>

                                          <div>
                                            {
                                              genState.hasOwnProperty('Vc') ?
                                                <div className="data-flex">
                                                  <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img src={Voltage} style={{ width: "30px" }} />
                                                    <h4>Voltage C</h4>
                                                  </div>
                                                  <h4>{genState.Vc.hasOwnProperty('value') ? genState.Vc.value + " Volt" : ''}</h4>
                                                </div>
                                                : null
                                            }
                                          </div>
                                          <div>
                                            {
                                              genState.hasOwnProperty('Ia') ?
                                                <div className="data-flex">
                                                  <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img src={Current} style={{ width: "30px" }} />
                                                    <h4>Current A</h4>
                                                  </div>
                                                  <h4>{genState.Ia.hasOwnProperty('value') ? genState.Ia.value + " A" : ''}</h4>
                                                </div>
                                                : null
                                            }
                                          </div>
                                          <div>
                                            {
                                              genState.hasOwnProperty('Ib') ?
                                                <div className="data-flex">
                                                  <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img src={Current} style={{ width: "30px" }} />
                                                    <h4>Current B</h4>
                                                  </div>
                                                  <h4>{genState.Ib.hasOwnProperty('value') ? genState.Ib.value + " A" : ''}</h4>
                                                </div>

                                                : null
                                            }
                                          </div>

                                          <div>
                                            {
                                              genState.hasOwnProperty('Ic') ?
                                                <div className="data-flex">
                                                  <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img src={Current} style={{ width: "30px" }} />
                                                    <h4>Current C</h4>
                                                  </div>
                                                  <h4>{genState.Ic.hasOwnProperty('value') ? genState.Ic.value + " A" : ''}</h4>
                                                </div>
                                                : null
                                            }
                                          </div>


                                        </div>
                                        :
                                        null
                                    }
                                  </CardContent>
                                </Card>
                              </Grid>
                              : null
                            }
                            <Grid item xs={12} md={3}>

                              <Card sx={{ background: '#fff', borderRadius: '0' }}>
                                <Typography className="generator-title" variant="h5">
                                  Key Statistics
                                </Typography>
                                <CardContent>
                                  <div style={{ minHeight: '220px' }}>
                                    {genState !== undefined ?
                                      <div>
                                        {
                                          genState.hasOwnProperty('engineTotalTime') ?
                                            <div >
                                              <div className="data-flex">
                                                <div>
                                                  <h4>Run Hours</h4>
                                                </div>
                                                <h4 >{genState.engineTotalTime.hasOwnProperty('value') ? genState.engineTotalTime.value + " hours" : ''}</h4>
                                              </div>

                                            </div>
                                            : null
                                        }
                                        <div>
                                          {
                                            genState.hasOwnProperty('generatedEnergy') ?
                                              <div >
                                                <div className="data-flex">
                                                  <div>
                                                    <h4>Energy Generated</h4>
                                                  </div>
                                                  <h4>{genState.generatedEnergy.hasOwnProperty('value') ? genState.generatedEnergy.value + " kW-h" : ''}</h4>
                                                </div>

                                              </div>
                                              : null
                                          }
                                        </div>
                                      </div>
                                      : null}

                                    {atsState !== undefined ?
                                      <div>
                                        {
                                          atsState.hasOwnProperty('lastOutageTime') ?
                                            <div>
                                              <div className="data-flex">
                                                <div>
                                                  <h4>Last Outage Time</h4>
                                                </div>
                                                <h4>{atsState.lastOutageTime.hasOwnProperty('value') ? atsState.lastOutageTime.value + " minutes" : ''}</h4>
                                              </div>
                                            </div>
                                            : null
                                        }
                                        {
                                          atsState.hasOwnProperty('lastOutageDuration') ?
                                            <div>
                                              <div className="data-flex">
                                                <div>
                                                  <h4>Last Outage Duration</h4>
                                                </div>
                                                <h4>{atsState.lastOutageDuration.hasOwnProperty('value') ? atsState.lastOutageDuration.value + " minutes" : ''}</h4>
                                              </div>
                                            </div>
                                            : null
                                        }
                                      </div>
                                      : null}
                                  </div>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                        </Grid>

                      </Grid>
                    </Container>
                  </div>
                );
              }
            }

          }
          )
          }
        </div>
        : <div style={{ textAlign: 'center' }}>No devices Exist</div>

      }
    </LoadingScreen>
  )
}

export default AssetsData;
