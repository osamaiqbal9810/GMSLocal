import React,{ useState,useEffect,Suspense  } from 'react';
import SetupForm from './SetupForm';
import {Button } from '@mui/material';
import Table from './Table';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Configurations from '../Configurations/Configurations';
import { Container } from '@mui/material';
import axios from 'axios';
import { getServerEndpoint } from '../../../utils/serverEndpoint';
import NewDevice from '../Devices/NewDevice';
import AssetsTable from '../Devices/AssetsTable';
import {useSelector } from 'react-redux';
import {ErrorBoundary} from 'react-error-boundary'
import LoadingScreen from 'react-loading-screen';
import logo from "../../../Images/logo.png";
import "./setup.css";
import ErrorFallback from '../../../components/Lazy loading/ErrorBoundary';
import Loading from '../../../components/Loading/Loading';

import Asset from './../Asset/Asset';
const api = axios.create({
  baseURL: getServerEndpoint()
});

// ----------------------------------------------------------------------

export default function Setup() {
  const [userCom,setUserComp]=useState(true);
  const [editUser,setEditUser]=useState({});
  const [value, setValue] = React.useState('1');
  const [openNew, setOpenNew] = React.useState(false);
  const [tabsActiveOne,setTabsActiveOne]=useState(false)
  const [tabsActiveTwo,setTabsActiveTwo]=useState(false)
  const [tabsActiveThree,setTabsActiveThree]=useState(false)
  const [tabsActiveFour,settabsActiveFour]=useState(false)
  const [tabsActiveFive,setTabsActiveFive]=useState(false)
  const [usersList, setUsersList] = useState([]);
  const [loading,setLoading]=useState(false)
  
   const api = axios.create({
    baseURL: getServerEndpoint(),
   });

    let userRole =useSelector((state)=> state.userGroup.userGroup[0]);
  
    const handleChange = (event, newValue) => {
    setValue(newValue);
    
    if (newValue===1){
      setTabsActiveOne(true)
      setTabsActiveTwo(false)
      setTabsActiveThree(false)
      settabsActiveFour(false)
      setTabsActiveFive(false)

    }

     else if (newValue===2){
      setTabsActiveOne(false)
      setTabsActiveThree(false)
      setTabsActiveTwo(true)
      settabsActiveFour(false)
      setTabsActiveFive(false)


    
    }
    else if (newValue===3){
      setTabsActiveOne(false)
      setTabsActiveTwo(false)
      setTabsActiveThree(true)
      settabsActiveFour(false)
      setTabsActiveFive(false)

    }

    else if (newValue===4){
      setTabsActiveOne(false)
      setTabsActiveTwo(false)
      setTabsActiveThree(false)
      settabsActiveFour(true)
      setTabsActiveFive(false)

    }
    else if (newValue===5){
      setTabsActiveOne(false)
      setTabsActiveTwo(false)
      setTabsActiveThree(false)
      settabsActiveFour(false)
      setTabsActiveFive(true)

    }
  };

  const handleNewDevice = () => {
    setOpenNew(true);
  }

const loadUser = async () => {
  setLoading(true)
    const userResponse = await api.get('/api/users', {
      
      headers: { Authorization: localStorage.getItem('access_token') },
      user: localStorage.getItem('loggedInUser')
    });
    if (userResponse.status ===200)
    {
      setLoading(false)
      setUsersList(userResponse.data);
    }
  }
    useEffect(()=>{
      loadUser();
    },[])
  return (
    <LoadingScreen
    loading={loading}
    bgColor='#1B1464'
    spinnerColor='#9ee5f8'
    textColor='#ffff'
    logoSrc={logo}
    text='Loading ...'
    > 
      <Container maxWidth="xl">
 
      <Box sx={{ width: '100%', typography: 'body1'}} style={{ paddingTop:'15px' }}>
        <TabContext value={value} >
          <Box sx={{  width: '100%', borderBottom: 1, borderColor: 'divider',background:"#1B1464",overflow:"auto"}}>
          
            <TabList onChange={handleChange}  aria-label="lab API tabs example" >
              <Tab sx={{color:"white"}} style={{display:userRole?.group_id==="manager"? "none":"block"}} className={`setupTabs ${tabsActiveOne || value ===1 ? "tabStyle" :""}`} label="Manage Users" value="1" />
              <Tab  sx={{color:"white"}}   className={`setupTabs ${tabsActiveTwo   ? "tabStyle" :""}`} label="Manage Configurations" value ={userRole?.group_id==="manager"? "1" : "2"} />
              <Tab  sx={{color:"white"}}  className={`setupTabs ${tabsActiveThree? "tabStyle" :""}`}  label="Manage Assets" value="3" />
              <Tab  sx={{color:"white"}}  style={{display:userRole?.group_id==="manager"? "none":"block"}} className={`setupTabs ${tabsActiveFour?  "tabStyle" :""}`}  label="Supported Devices" value="4" />
            </TabList>
   
          </Box>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabPanel value="1">
              <Paper elevation={24} sx={{padding:'15px'}}>
              <Grid container spacing={2} width="100%">

                {userRole?.group_id !=="manager"?
                  <>
                  <Grid item xs={12} md={6}>
                  {/*<ErrorBoundary FallbackComponent={ErrorFallback} onReset={()=>{}}>
                <Suspense fallback={Loading}>
                      
                      </Suspense>
  </ErrorBoundary>*/}
                <SetupForm userCom={userCom} loadUser={loadUser} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                {/*<ErrorBoundary FallbackComponent={ErrorFallback} onReset={()=>{}}>
                <Suspense fallback={Loading}>
                      </Suspense>
                </ErrorBoundary>*/}
                <Table setUserComp={setUserComp} setEditUser={setEditUser} usersList={usersList} loadUser={loadUser} />
                  </Grid>
                </>
                :null
              }
              </Grid>
            </Paper>
          </TabPanel>
          <TabPanel value={userRole?.group_id==="manager" ? "1": "2"}>
            <Configurations />
          </TabPanel>
            <TabPanel value="3">
              <div>
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={()=>{}}>
                <Suspense fallback={Loading}>
                <Asset />
                </Suspense>
                </ErrorBoundary>
              </div>
            </TabPanel>

            <TabPanel value='4'>
            <div style={{display:"flex",justifyContent:"right",marginTop:"12px"}}>
                <Button variant="contained" sx={{backgroundColor:'#1B1464', borderRadius:'0px',boxShadow:"none"}} onClick={handleNewDevice}  >New Device</Button>
              </div>
               <AssetsTable/>
            <NewDevice OpenModal={openNew} loading={false} setOpenModal={setOpenNew} />
            </TabPanel>
          </Box>
        </TabContext>
      </Box>
      </Container>
    </LoadingScreen>
  );
}
