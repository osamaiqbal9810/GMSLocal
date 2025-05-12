import { Container } from '@mui/material';
import { LocationCityOutlined, LocationOnOutlined, MapsHomeWorkOutlined } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
// import {userData} from "../data"

import "./home.css";
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../../components/Lazy loading/ErrorBoundary';
import Loading from '../../components/Loading/Loading';
import axios from 'axios';
import { getServerEndpoint } from '../../utils/serverEndpoint';
import Tiles from './Tiles';
import { PieChart } from 'react-minimal-pie-chart';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import "../../layouts/style.css"

function Home() {
  const [locations, setLocations] = useState([]);
  const [city, setCity] = useState("")
  const [location, setLocation] = useState("")
  const [storeLocation, setStore] = useState();
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStore, setSelectedStore] = useState();
  const [selectedCityMap, setSelectedCityMap] = useState("");
  const [selectedStoreMap, setSelectedStoreMap] = useState();
  const [sourcesTime, setSourcesTime] = useState({});
  const icons = [LocationCityOutlined, MapsHomeWorkOutlined, LocationOnOutlined];

  const api = axios.create({
    baseURL: getServerEndpoint()
  });
  const data = [
    { title: 'One', value: 10, color: 'orange' },
    { title: 'Two', value: 15, color: 'green' },
    { title: 'Three', value: 30, color: '#00008B' }
  ]

  var labels = ['2018-12-20 00:00', '2018-12-20 01:00', '2018-12-21 02:00', '2018-12-20 03:00', '2018-12-20 04:00', '2018-12-20 05:00', '2018-12-20 06:00', '2018-12-21 07:00', '2018-12-21 08:00', '2018-12-21 09:00', '2018-12-21 10:00', '2018-12-21 11:00'];

  const [userDatas, setUserData] = useState({

    labels,
    datasets: [{
      label: "Common time chart",

      //  data:userData.map((data)=>data.userGain),
      data: [0, 1, , 1, 1, 0, 0, 1, 1],
      backgroundColor: [
        "#50bb50",
        "#e5815c"
      ],
      borderColor: [
        "black"
      ],
      borderWidth: 1
    }],

  })
  const [genDatas, gensetUserData] = useState({
    labels,
    datasets: [{
      label: "Backup Source time",

      data: [0, 1, , 1, 1, 0, 0, 1, 1],
      backgroundColor: [
        "#50bb50",
        "#e5815c"
      ],
      borderColor: [
        "black"
      ],
      borderWidth: 1
    }],

  })

  const [runDatas, runsetUserData] = useState({
    labels,
    datasets: [{
      label: "Preferred Source time",

      data: [0, 1, 1, 1, 1, 1, 1],
      backgroundColor: [
        "#50bb50",
        "#e5815c",

      ],
      borderColor: [
        "black"
      ],
      borderWidth: 1
    }],

  })

  const [pieDatas, setPieData] = useState({

    labels: [
      'Main Time',
      'Generator Time',
      'Common Time'
    ],

    datasets: [{
      data: [50, 15, 30],
      backgroundColor: [
        "#50bb50",
        "#e5815c",
        "#00008B"
      ],
      borderColor: [
        "white"
      ],
      borderWidth: 3
    }],

  })

  const defaultLabelStyle = {
    fontSize: '9px',
    fontFamily: 'sans-serif',
    fill: 'white'
  };
  const shiftSize = 8;
  useEffect(() => {
    async function getLocations() {
      const res = await api.get('/api/asset', {
        headers: { Authorization: localStorage.getItem('access_token') }
      });
      if (res.status == 200) {
        setLocations(res.data.assetsList)
      }
    }


    getLocations();
  }, []);

  useEffect(() => {
    const findFirstCity = locations?.find(({ assetType, isRemoved }) => assetType == "Location" && isRemoved == false);
    const findStore = locations?.find(({ parentAsset, isRemoved }) => parentAsset == findFirstCity?._id && isRemoved == false);
    setSelectedCityMap(findFirstCity?._id);
    setSelectedStoreMap(findStore?._id);
    async function getPieData() {
      const res = await api.get('/api/dashboard/specificChart/' + findStore?._id, {
        headers: { Authorization: localStorage.getItem('access_token') }
      });
      if (res.status == 200) {
        setSourcesTime(res.data)
      }
    }
    getPieData();
  }, [locations])

  const timeConvert = (n) => {
      var num = n;
      var hours = (num / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      if (rminutes == 60) {
        rhours = rhours + 1;
        rminutes = "00";
      }
     
    
    return rhours + " hour(s) and " + rminutes + " minute(s).";
  }
  const findStoresAtLocation = (e) => {
    let value = e.target.value;
    setSelectedCity(value);
    setSelectedCityMap(value);
    let store = locations.filter(({ assetType, parentAsset }) => assetType == "Store" && parentAsset == value);
    setStore(store);
  }
  const handleLoadPieData = async (e) => {
    setSelectedStore(e.target.value);
    setSelectedStoreMap(e.target.value);
    let value = e.target.value;
    const res = await api.get('/api/dashboard/specificChart/' + value, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });
    if (res.status == 200) {
      setSourcesTime(res.data)
    }
  }

  return (
    <>
      <Container maxWidth="xl">
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => { }}>
          <Suspense fallback={Loading}>
            <Tiles />
          </Suspense>
        </ErrorBoundary>
        <div className="searchBar">
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">City</InputLabel>
              <Select
                onChange={findStoresAtLocation}
                name="city"

                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCity || ''}
                label="City"
                className="selectBox"
              >
                {
                  locations ? locations.filter(({ assetType }) => assetType == "Location").map((value) => {
                    return (
                      <MenuItem value={value._id}>{value.name}</MenuItem>
                    )
                  })
                    : null
                }



              </Select>

            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Location</InputLabel>
              <Select
                onChange={handleLoadPieData}
                name="location"

                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Area"
                value={selectedStore || ''}
                className="selectBox"
              >
                {
                  storeLocation ? storeLocation.map((value) => {
                    return (
                      <MenuItem value={value._id}>{value.name}</MenuItem>
                    )

                  })
                    : null
                }

              </Select>
            </FormControl>
          </div>
          <div style={{ backgroundColor: '' }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {
                selectedCityMap !== '' && selectedStoreMap !== undefined ?
                  <Box sx={{ width: '100%' }}>
                    <Stepper alternativeLabel>
                      {locations.filter(({ _id }) => _id == selectedCityMap || _id == selectedStoreMap).map((label, index) => {
                        const stepProps = {};
                        return (
                          <Step key={index} {...stepProps}>
                            <StepLabel StepIconComponent={icons[index]} style={{ color: "black" }}> <p style={{ color: "black" }}>{label.name}</p></StepLabel>
                          </Step>
                        );
                      })}
                    </Stepper>
                  </Box>
                  : <div style={{ textAlign: "center" }}> All Locations Power Utilization Summary</div>
              }
            </div>
          </div>


        </div>

        <div style={{ marginTop: "20px", padding: '30px 0' }}>

          <div style={{ background: "white", boxShadow: "0 0 6px #c5c5c5", marginBottom: "30px", padding: "0 20px", display: "flex", flexDirection: "column" }} className="piechart">
            <h3 style={{ textAlign: "center", marginTop: "12px" }}>Last 24 hours Power Sources Utilization Summary</h3>
            <div className='pieChartsDev'>

              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => { }}>
                <Suspense fallback={Loading}>
                  {
                    sourcesTime?.prefSrcAvailTime !== 0 || sourcesTime?.standbySrcAvailTime !== 0 || sourcesTime?.bothSrcAvailTime !== 0 ?
                      <div>
                        <PieChart
                          radius={PieChart.defaultProps.radius - shiftSize}
                          //segmentsShift={(index) => (index === 0 ? shiftSize : 2.1)}
                          label={({ dataEntry }) => dataEntry.percentage > 15 ? Math.round(dataEntry.percentage) + '%' : null}
                          startAngle={360}
                          lengthAngle={360}
                          
                          labelStyle={{
                            ...defaultLabelStyle
                          }}
                          style={{ width: '360px', color: 'white' }}
                          data={[

                            { title: 'Preferred Source time', value: sourcesTime?.prefSrcAvailTime, color: 'green' },
                            { title: 'Backup Source time', value: sourcesTime?.standbySrcAvailTime, color: '#1A1AFF' },
                            { title: 'Sources Overlap time', value: sourcesTime?.bothSrcAvailTime, color: '#FF3333' },
                          ]}
                        />

                      </div>
                      :
                      <div style={{ width: "300px", height: "300px", borderRadius: '50%', border: '1px solid black', marginBottom: '10px' }}>
                        <div style={{ textAlign: "center", marginTop: "50%", marginBottom: "50%", fontWeight: 'bold' }}>No Data Available</div>
                      </div>
                  }
                </Suspense>
              </ErrorBoundary>
              <div >
                {
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ background: "green", padding: "8px 8px", margin: "10px 8px", color: "#fff", minWidth: "100px" }} > </p>
                      <p>Preferred Source time</p>
                      <p style={{ marginLeft: "10px" }}>{sourcesTime?.prefSrcAvailTime ? timeConvert(sourcesTime?.prefSrcAvailTime) : 0 + " hour(s) and " + 0 + " minute(s)."}</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ background: "#1A1AFF", padding: "8px 8px", margin: "10px 8px", color: "#fff", minWidth: "100px" }} >  </p>
                      <p>Backup Source time</p>
                      <p style={{ marginLeft: "10px" }}>{sourcesTime?.standbySrcAvailTime ? timeConvert(sourcesTime?.standbySrcAvailTime) : 0 + " hour(s) and " + 0 + " minute(s)."}</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ background: "#FF3333", padding: "8px 8px", margin: "10px 8px", color: "#fff", minWidth: "100px" }} >  </p>
                      <p>Sources Overlap time</p>
                      <p style={{ marginLeft: "10px" }}>{sourcesTime?.bothSrcAvailTime ? timeConvert(sourcesTime?.bothSrcAvailTime) : 0 + " hour(s) and " + 0 + " minute(s)."}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Home;
