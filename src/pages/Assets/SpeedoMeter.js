import { Button, Container, Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import notification from '../../Images/notification.png';
import time from '../../Images/time.png';
import noSource from '../../Images/noSource.png';
import './speedometer.css';
import { getServerEndpoint } from '../../utils/serverEndpoint';
import "../../components/CompoStyles.css";
import mainOn from '../../Images/mainOn.PNG';
import genOn from '../../Images/genOn.PNG';
import bothSource from '../../Images/bothSource.PNG';
import genRunning from '../../Images/genRunning.png';
import genDefault from '../../Images/genDefault.png';
import GensetDials from './GensetDials';
import AtsDials from './AtsDials';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useSelector, useDispatch } from 'react-redux';
import { list, updateAsset, listAlerts, updateAlerts, clearAlerts, ackAlerts } from '../../Slice/assetsListSlice';
import enginOil1 from '../../Images/enginOil1.png';
import enginOil2 from '../../Images/enginOil2.png';
import feul1 from '../../Images/feul1.png';
import feul2 from '../../Images/feul2.png';
import feul3 from '../../Images/feul3.png';
import coolantTemp1 from '../../Images/coolantTemp1.png';
import coolantTemp2 from '../../Images/coolantTemp2.png';
import coolantTemp3 from '../../Images/coolantTemp3.png';
import Loading from '../../components/Loading/Loading';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function SpeedoMeter({ id }) {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const [supportedParams, setSupportedParams] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [tabsActiveOne, setTabsActiveOne] = useState(false);
  const [tabsActiveTwo, setTabsActiveTwo] = useState(false);
  const [value, setValue] = React.useState('1');
  const [assetInfo, setAssetInfo] = React.useState({});
  const [loading, setLoadingScr] = useState(false);
  const [supportedDeviceForCase, setSupportedDeviceForCase] = useState({});
  const [opens, setOpens] = React.useState(false);


  const api = axios.create({
    baseURL: getServerEndpoint()
  });

  const [devices, setDevices] = useState([]);
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    async function getAssetInfo() {
      setLoadingScr(true);
      const response = await api.get('/api/asset/' + id, {
        headers: { Authorization: localStorage.getItem('access_token') },
        params: { id: id }
      });

      if (response.status === 200) {
        setAssetInfo(response.data);
      }
      setLoadingScr(false);
      setLoading(false);
    }

    async function getDevice() {
      setLoadingScr(true);
      const response = await api.get('/api/asset/devicesAtLocation/' + id, {
        headers: { Authorization: localStorage.getItem('access_token') },
        params: { id: id }
      });
      if (response.status === 200) {
        dispatch(list(response.data.devicesAtLocation));
        setDevices(response.data.devicesAtLocation);
      }
      setLoadingScr(false);
      setLoading(false);
    }

    async function getAlerts() {
      const response = await api.get('/api/notification/' + id, {
        headers: { Authorization: localStorage.getItem('access_token') },
        params: { id: id }
      });
      //console.log(response.data.alerts);
      if (response.status === 200) {
        dispatch(listAlerts(response.data.alerts));
      }
    }

    async function getsupportedParams() {
      const response = await api.get('/api/SupportedParams/', {
        headers: { Authorization: localStorage.getItem('access_token') }
      });
      if (response.status === 200) {
        setSupportedParams(response.data.params);
      }
    }
    getsupportedParams();
    getDevice();
    getAlerts();
    getAssetInfo();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      setTabsActiveOne(true);
      setTabsActiveTwo(false);
    }

    if (newValue === 1) {
      setTabsActiveOne(true);
      setTabsActiveTwo(false);
    } else if (newValue === 2) {
      setTabsActiveOne(false);
      setTabsActiveTwo(true);
    }
  };

  const acknowledgeAlert = async (alert) => {
    let data = { ...alert, ackFlag: true, ackAt: new Date() };
    const response = await api.put('/api/notification/' + alert._id, data, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });
 
    if (response.status === 200 && response.data) {
      dispatch(ackAlerts(response.data))
    }
  };

  const listDevices = useSelector((state) => state.updateAsset.asset);
  let alertsLst = useSelector((state) => state.listAlerts.alertsList);
  const alertsListAck = useSelector((state) => state.ackAlerts.alertsList);
  const acknowledgeAllAlert = async () => {
    let toBeAck = [];
    alertsLst.forEach((alert) =>
      alert.forEach((alrt) => {
        toBeAck.push(alrt);
      })
    );
    const response = await api.post('/api/notification/ackAll', toBeAck, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });

    if (response.status == 200) {
      dispatch(clearAlerts());
      setOpens(false)
    }
  };
  useEffect(() => {
    setDevices(listDevices);
    setAlerts(alertsLst);
    setAlerts(alertsListAck);
  }, [listDevices, alertsLst,alertsListAck]);

 
  if (isLoading || devices.length <= 0) {
    return (
      <div className="App">
        <Loading />
      </div>
    );
  }

  const handleClickOpen = () => {
    setOpens(true);
  };
  const handleCloses = () => {
    setOpens(false);
  }


  let device = devices.filter(({ assetType }) => assetType === 'device');
  let genDevices = device.find(({ suppDevice }) => suppDevice.type === 'GENSET');

  let atsDevices = device.find(({ suppDevice }) => suppDevice.type === 'ATS');

  let gensetState, atsState, prefSrcAvail, standbySrcAvail, genStatus;
  {
    gensetState = genDevices !== undefined && genDevices.hasOwnProperty('state') ? genDevices.state : '';
    atsState = atsDevices !== undefined && atsDevices.hasOwnProperty('state') ? atsDevices.state : '';

    if (genDevices && genDevices.hasOwnProperty('state')) {
      if (genDevices.state.hasOwnProperty('genStatus')) {
        if (genDevices.state.genStatus.hasOwnProperty('value')) {
          genStatus = genDevices.state.genStatus.value;
        }
      }
      else if (genDevices.state.hasOwnProperty('engineSpeed')) {
        if (genDevices.state.engineSpeed.hasOwnProperty('value')) {
          if (genDevices.state.engineSpeed?.value >= 300) {
            genStatus = "Running";
          }
          else {
            genStatus = "Off";
          }
        }
      }
    }
    prefSrcAvail =
      atsState !== undefined && atsState.hasOwnProperty('systemOverview')
        ? atsState.systemOverview.value.prefSrcAvail
        : '';
    standbySrcAvail =
      atsState !== undefined && atsState.hasOwnProperty('systemOverview')
        ? atsState.systemOverview.value.standbySrcAvail
        : '';
  }

  let arrangeAtsDialsA = ['srcA_V1', 'srcA_V2', 'srcA_V3', 'srcA_Freq'];
  let arrangeAtsDialsB = ['srcB_V1', 'srcB_V2', 'srcB_V3', 'srcB_Freq'];

  let arrangeGenDialsA = ['Va', 'Vb', 'Vc'];
  let arrangeGenDialsB = ['Ia', 'Ib', 'Ic'];
  let arrangeGenDialsC = ['engineSpeed', 'freq', 'batteryVoltage'];

  return (
    <div>
      <div>
        <div sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid
            container
            as={Card}
            spacing={1}
            padding={1}
            style={{ marginBottom: '10px', border: '1px solid grey', marginTop:"10px" }}
          >
            <Grid item xs={12} md={4} spacing={1}>
              {genDevices !== undefined || atsDevices !== undefined ? (
                <label>
                  <b>Asset Name:</b> {assetInfo ? assetInfo.name : ''}
                </label>
              ) : null}
            </Grid>
            <Grid item xs={12} md={4} spacing={1}>
              {genDevices !== undefined ? (
                <label>
                  <b>Genset Name:</b> {genDevices.suppDevice ? genDevices.suppDevice.name : ''}
                </label>
              ) : null}
            </Grid>
            <Grid item xs={12} md={4} spacing={1} style={{ textAlign: 'right' }}>
              {atsDevices !== undefined ? (
                <label>
                  <b>ATS Name:</b> {atsDevices.suppDevice ? atsDevices.suppDevice.name : ''}
                </label>
              ) : null}
            </Grid>
          </Grid>

          <Grid sx={{ justifyContent: 'space-between' }} container spacing={1}>
            <Grid item xs={12} md={5}>
              {atsDevices !== undefined &&
                prefSrcAvail !== undefined &&
                standbySrcAvail !== undefined ? (
                <Paper elevation={5} sx={{ padding: '10px' }}>
                  <div>
                    {
                      <img
                        src={
                          prefSrcAvail === 'Yes' && standbySrcAvail === 'Yes'
                            ? bothSource
                            : prefSrcAvail === 'Yes' && standbySrcAvail === 'No'
                              ? mainOn
                              : standbySrcAvail === 'Yes' && prefSrcAvail === 'No'
                                ? genOn
                                : noSource
                        }
                        alt="power source"
                        height="300px"
                        style={{ margin: 'auto', padding: '10px' }}
                      />
                    }
                  </div>
                </Paper>
              ) : null}
              {atsDevices == undefined && genDevices !== undefined &&
                genStatus ? (
                <Paper elevation={5} sx={{ padding: '10px' }}>
                  <div>
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
                  </div>
                </Paper>
              ) : null}
            </Grid>
            <Grid item xs={12} md={3} spacing={1} paddingRight={1}>
              {genDevices !== undefined && genDevices.hasOwnProperty('state') ? (
                <div>
                  <Paper elevation={5}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ marginLeft: '10px' }}>
                        <div style={{ fontSize: '22px', fontWeight: 'bold' }}>
                          {gensetState.genStatus && gensetState.genStatus.hasOwnProperty('value')
                            ? gensetState.genStatus.value
                            : ''}
                        </div>
                        <div style={{ fontSize: '18px' }}>Generator</div>
                      </div>
                    </div>
                  </Paper>
                  <Paper elevation={5} style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ background: '#1B1464', padding: '5px' }}>
                        <img src={time} width={50} height={50} />
                      </div>
                      <div style={{ marginLeft: '10px' }}>
                        <div style={{ fontSize: '22px', fontWeight: 'bold' }}>
                          {gensetState.engineTotalTime &&
                            gensetState.engineTotalTime.hasOwnProperty('value')
                            ? gensetState.engineTotalTime.value + ' hours'
                            : 0}
                        </div>
                        <div style={{ fontSize: '18px' }}>Total Run Hours</div>
                      </div>
                    </div>
                  </Paper>
                </div>
              ) : null}
            </Grid>
            <Grid item xs={12} md={3} spacing={1}>
              <Card sx={{ minWidth: 275, height: 'auto', maxHeight: '320px', overflowY: 'auto' }}>
                <div
                  className="Card-header"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: '0'
                  }}
                >
                  <img src={notification} width={30} height={30} style={{ color: 'white' }} />
                  {alerts.length !== 0 ?
                    <Tooltip title="Acknowledge all" arrow placement="top">
                      <span style={{ marginTop: '5px' }}>
                        <BsFillCheckCircleFill
                          onClick={handleClickOpen}
                          fontSize="22px"
                          color=" #009E60"
                        />
                      </span>
                    </Tooltip>
                    : null
                  }
                  <Dialog
                    open={opens}
                    onClose={handleCloses}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {'Do you want to acknowledge all?'}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description"></DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        className="modalButtons"
                        sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                        onClick={handleCloses}
                      >
                        Disagree
                      </Button>
                      <Button
                        className="modalButtons"
                        sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                        onClick={acknowledgeAllAlert}
                      >
                        Agree
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>

                <CardContent
                  sx={{ minWidth: 275, minHeight: '280px', overflowY: 'auto', padding: '5px' }}
                >
                  {alerts.length !== 0
                    ? alerts.map((alert) =>
                      alert.map((alrt,i) => {
                        if(i < 50){
                        let timeStamp = alrt.createdAt;
                        let format = new Date(timeStamp);
                        timeStamp =
                          format.getDate() +
                          '-' +
                          (format.getMonth() + 1) +
                          '-' +
                          format.getFullYear() +
                          ' ' +
                          format.getHours() +
                          ':' +
                          format.getMinutes() +
                          ':' +
                          format.getSeconds();
                        if (genDevices !== undefined && atsDevices !== undefined) {
                          return (alrt.messageInfo !== undefined &&
                            alrt.ackFlag === false &&
                            alrt.targetAsset === genDevices._id) ||
                            alrt.targetAsset === atsDevices._id ? (
                             
                            <Paper>
                              
                              <div style={{ padding: '0px 5px' }}>
                                <p style={{ fontWeight: 'bold' }}>
                                  {alrt.messageInfo['message']}
                                </p>
                                <p
                                  style={{ fontSize: '12px', color: '405F69', marginTop: '5px' }}
                                >
                                  {' '}
                                  {timeStamp}
                                </p>
                                {alrt.messageInfo.hasOwnProperty('description') ? (
                                  <p
                                    style={{
                                      fontSize: '13px',
                                      color: '405F69',
                                      marginTop: '5px'
                                    }}
                                  >
                                    <b>Description:</b> {alrt.messageInfo.description}
                                  </p>
                                ) : (
                                  ''
                                )}
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                  <Button
                                    variant="contained"
                                    onClick={() => acknowledgeAlert(alrt)}
                                    style={{
                                      padding: '5px 8px',
                                      textAlign: 'right',
                                      fontWeight: 'bold',
                                      display: 'block',
                                      marginBottom: '5px',
                                      background: '#1B1464',
                                      marginRight: '5px',
                                      boxShadow: 'none',
                                      borderRadius: '0'
                                    }}
                                  >
                                    Acknowledge
                                  </Button>
                                </div>
                              </div>

                              <hr />
                            </Paper>
                          ) : null;
                        } else if (genDevices !== undefined) {
                          return alrt.messageInfo !== undefined &&
                            alrt.ackFlag === false &&
                            alrt.targetAsset === genDevices._id ? (
                            <Paper>
                              <div style={{ padding: '0px 5px' }}>
                                <p style={{ fontWeight: 'bold' }}>
                                  {alrt.messageInfo['message']}
                                </p>
                                <p
                                  style={{ fontSize: '12px', color: '405F69', marginTop: '5px' }}
                                >
                                  {' '}
                                  {timeStamp}
                                </p>
                                {alrt.messageInfo.hasOwnProperty('description') ? (
                                  <p
                                    style={{
                                      fontSize: '13px',
                                      color: '405F69',
                                      marginTop: '5px'
                                    }}
                                  >
                                    <b>Description:</b> {alrt.messageInfo.description}
                                  </p>
                                ) : (
                                  ''
                                )}
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                  <Button
                                    sx={{
                                      boxShadow: 'none',
                                      borderRadius: '0',
                                      marginTop: '10px'
                                    }}
                                    variant="contained"
                                    onClick={() => acknowledgeAlert(alrt)}
                                    style={{
                                      padding: '5px 8px',
                                      textAlign: 'right',
                                      fontWeight: 'bold',
                                      display: 'block',
                                      marginBottom: '5px',
                                      background: '#1B1464',
                                      marginRight: '5px'
                                    }}
                                  >
                                    Acknowledge
                                  </Button>
                                </div>
                              </div>

                              <hr />
                            </Paper>
                          ) : null;
                        } else if (atsDevices !== undefined) {
                          return alrt.messageInfo !== undefined &&
                            alrt.ackFlag === false &&
                            alrt.targetAsset === atsDevices._id ? (
                            <Paper>
                              <div style={{ padding: '0px 5px' }}>
                                <p style={{ fontWeight: 'bold' }}>
                                  {alrt.messageInfo['message']}
                                </p>
                                <p
                                  style={{ fontSize: '12px', color: '405F69', marginTop: '5px' }}
                                >
                                  {' '}
                                  {timeStamp}
                                </p>
                                {alrt.messageInfo.hasOwnProperty('description') ? (
                                  <p
                                    style={{
                                      fontSize: '13px',
                                      color: '405F69',
                                      marginTop: '5px'
                                    }}
                                  >
                                    <b>Description:</b> {alrt.messageInfo.description}
                                  </p>
                                ) : (
                                  ''
                                )}
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                  <Button
                                    variant="contained"
                                    onClick={() => acknowledgeAlert(alrt)}
                                    sx={{
                                      padding: '5px 8px',
                                      textAlign: 'right',
                                      fontWeight: 'bold',
                                      display: 'block',
                                      marginBottom: '5px',
                                      background: '#1B1464',
                                      marginRight: '5px',
                                      borderRadius: '0',
                                      boxShadow: 'none',
                                      marginTop: '10px'
                                    }}
                                  >
                                    Acknowledge
                                  </Button>
                                </div>
                              </div>

                              <hr />
                            </Paper>
                          ) : null;
                        }
                      }
                      })
                    )
                    : null}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            marginTop={1}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Grid item xs={12} md={4} style={{ width: '100%' }}>
              <Card
                sx={{ minWidth: 275, minHeight: '160px', maxWidth: '100%' }}
                className="speedomteter-cards"
              >
                <div className="Card-header"> Temperature</div>
                {gensetState !== undefined ? (
                  <div className="Card-data">
                  {gensetState.hasOwnProperty('coolantTemp')
                          ? 
                    <div className="card-img-text">
                      <img src={coolantTemp1} />
                      <p style={{ textAlign: 'center' }}>Coolant Temperature</p>
                      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                        {gensetState.coolantTemp.value+" "}<span><b>&deg;F</b></span>
                          
                      </p>
                    </div>
                    : null}
                    {/* {gensetState.hasOwnProperty('engineOilTemp') ? 
                      <div className="card-img-text">
                        <img src={coolantTemp3} />
                        <p style={{ textAlign: 'center' }}>Oil Temperature</p>
                        <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                          {gensetState.engineOilTemp.value + ' C'}  
                        </p>
                      </div>
                    : null} */}
                    {/* {gensetState.hasOwnProperty('fuelTemp')
                    ? 
                    <div className="card-img-text">
                      <img src={feul2} />
                      <p style={{ textAlign: 'center' }}>Fuel Temperature</p>
                      <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                       {gensetState.fuelTemp.value + ' C'}
                          
                      </p>
                    </div>
                    : null} */}
                  </div>
                ) : null}
              </Card>
            </Grid>

            <Grid item xs={12} md={5}>
              <Card
                sx={{ minWidth: 270, minHeight: '160px', maxWidth: '100%' }}
                className="speedomteter-cards"
              >
                <div className="Card-header">Pressure </div>
                <div className="Card-data">
                {gensetState.hasOwnProperty('engineOilPressure')
                ?
                  <div className="card-img-text">
                    <img src={enginOil2} />
                    <p>Oil Pressure</p>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                      {gensetState.engineOilPressure.value + ' PSI'}
                       
                    </p>
                  </div>
                  : null}
                  {/* {gensetState.hasOwnProperty('coolantPressure')
                        ? 
                  <div className="card-img-text">
                    <img src={coolantTemp2} />
                    <p>Coolant Pressure</p>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                      {gensetState.coolantPressure.value + ' kPa'}
                        
                    </p>
                  </div>
                  : null} */}
                  {/* {gensetState.hasOwnProperty('fuelPressure')
                  ? 
                  <div className="card-img-text">
                    <img src={feul1} />
                    <p>Fuel Pressure</p>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                     {gensetState.fuelPressure.value + ' kPa'}     
                    </p>
                  </div>
                  : null} */}
                </div>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card
                sx={{ minWidth: 270, maxWidth: '100%', minHeight: '160px' }}
                className="speedomteter-cards"
              >
                <div className="Card-header"> Level</div>
                <div className="Card-data">
                {/* {gensetState.hasOwnProperty('engineOilLevel')
                        ?
                  <div className="card-img-text">
                    <img src={enginOil1} />
                    <p>Oil Level</p>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                       {gensetState.engineOilLevel.value + ' %'}    
                    </p>
                  </div>
                  : null} */}
                  {gensetState.hasOwnProperty('fuelLevel')
                  ? 
                  <div className="card-img-text">
                    <img src={feul3} />
                    <p>Fuel Level</p>
                    <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                     {gensetState.fuelLevel.value + ' %'}
                        
                    </p>
                  </div>
                  : null}
                </div>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
      <div
        style={{
          backgroundColor: 'white',
          boxShadow: '0 0 6px #c5c5c5',
          marginTop: '20px',
          padding: '20px'
        }}
      >
        <div className="speedometer-tiles">
          {gensetState !== undefined
            ? Object.keys(gensetState).map((key) => {
              if (
                key === 'lastOutageTime' ||
                key === 'lastOutageDuration' ||
                key === 'switchTrasferTotal' ||
                key === 'engineTimeLoaded' ||
                key === 'generatedEnergy' ||
                key === 'controllerOpTime' ||
                key == 'engineTotalStarts'
              ) {
                let suppUnit = supportedParams.find(({ name }) => name === key);

                if (suppUnit !== undefined) {
                  return (
                    <div
                      style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}
                    >
                      <h3
                        className="tile-headings"
                        style={{
                          background: '#1B1464',
                          width: '100%',
                          padding: '10px 5px',
                          color: 'white',
                          wordBreak: 'break-all'
                        }}
                      >
                        {suppUnit.label}{' '}
                      </h3>
                      <p
                        style={{ fontSize: '22px', padding: '10px 3px', wordWrap: 'break-word' }}
                      >
                        {suppUnit.unit != null
                          ? suppUnit.unit.hasOwnProperty('long')
                            ? gensetState[key].value + ' ' + suppUnit.unit.long
                            : gensetState[key].value + ' ' + suppUnit.unit
                          : gensetState[key].value}
                      </p>
                    </div>
                  );
                }
              }
            })
            : null}
        </div>
        <Container maxWidth="xl">
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box
                sx={{
                  width: '100%',
                  borderBottom: 1,
                  borderColor: 'divider',
                  background: '#1B1464'
                }}
              >
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab
                    sx={{ color: 'white' }}
                    className={tabsActiveOne || value === 1 ? 'tabStyle' : ''}
                    label="Genset "
                    value="1"
                  />
                  <Tab
                    sx={{ color: 'white' }}
                    className={tabsActiveTwo ? 'tabStyle' : ''}
                    label="ATS"
                    value="2"
                  />

                </TabList>
              </Box>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabPanel value="1" style={{ background: '#ffffff' }}>
                  {genDevices !== undefined && gensetState !== '' ? (
                    <div className="speedometer">
                      <h2 style={{ marginTop: '10px', color: '#1B1464' }}></h2>
                      <GensetDials
                        gensetState={gensetState}
                        supportedParams={supportedParams}
                        arrangeGenDials={arrangeGenDialsC}
                      />
                      <h2 style={{ marginTop: '10px', color: '#1B1464' }}>Voltages</h2>
                      <GensetDials
                        gensetState={gensetState}
                        supportedParams={supportedParams}
                        arrangeGenDials={arrangeGenDialsA}
                      />
                      <h2 style={{ marginTop: '10px', color: '#1B1464' }}>Currents</h2>
                      <GensetDials
                        gensetState={gensetState}
                        supportedParams={supportedParams}
                        arrangeGenDials={arrangeGenDialsB}
                      />
                    </div>
                  ) : null}
                </TabPanel>
                {
                  <TabPanel value="2">
                    {atsDevices !== undefined && atsState !== '' ? (
                      <div class="speedometer">
                        <h2 style={{ marginTop: '10px', color: '#1B1464' }}>Source A</h2>
                        <AtsDials
                          atsValues={atsState}
                          supportedParams={supportedParams}
                          arrangeAtsDials={arrangeAtsDialsA}
                        />
                        <h2 style={{ marginTop: '10px' }}>Source B</h2>
                        <AtsDials
                          atsValues={atsState}
                          supportedParams={supportedParams}
                          arrangeAtsDials={arrangeAtsDialsB}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </TabPanel>
                }
              </Box>
            </TabContext>
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default SpeedoMeter;
