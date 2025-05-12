import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import axios from 'axios';
import { getServerEndpoint } from '../../../utils/serverEndpoint';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import "../../../layouts/style.css"
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { Grid } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import moment from "moment-timezone";

function Configurations() {
  const [refreshTime, setRefreshTime] = useState(0);
  const [engineCoolDownTime, setEngineCoolDownTime] = useState(0);

  const [backupMainTime, setBackupMainTime] = useState(0);
  const [mainOFF, setMainOFF] = useState(0);
  const [backupOn, setBackupOn] = useState(0);

  const [lookUpList, setLookUpList] = useState([]);
  const [lookUpId, setLookUpId] = useState();
  const [coolDownlookUpId, setCoolDownlookUpId] = useState();
  const [timezonelookUpId, setTimezoneLookUpId] = useState();
  const [backupMainTimelookUpId, setBackupMainTimelookUpId] = useState();
  const [mainOFFlookUpId, setMainOFFlookUpId] = useState();
  const [backupONlookUpId, setBackupOnlookUpId] = useState();

  const [put, setPut] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertEngineTime, setAlertEngineTime] = useState(false);
  const [opens, setOpens] = React.useState(false);
  const [openEngineTime, setopenEngineTime] = useState();

  const [openBackupMain, setopenBackUpMain] = useState();
  const [openMainLost, setopenMainLost] = useState();
  const [openGenOn, setOpenGenOn] = useState();

  const [numsErr, setNumErr] = React.useState(false);
  const [numsErrEngineTime, setNumsErrEngineTime] = useState(false);
  const [errTiming, setErrTiming] = useState(false);
  const [errTimingEngineTime, setErrTimingEngineTime] = useState(false);
  const [timezoneList, settimezoneList] = useState([]);
  const [timeZone, setTimeZone] = useState("");


  const api = axios.create({
    baseURL: getServerEndpoint()
  });

  const handleChange = (e) => {
    const refreshTime = e.target.value;

    //0 let inMillis = refreshTime * 60 * 1000;
    setRefreshTime(refreshTime);
  };

  const handleChangeCoolDown = (e) => {
    const engineCoolDownTime = e.target.value;
    setEngineCoolDownTime(engineCoolDownTime);
  }
  const handleBackupMain = (e) => {
    const backupMain = e.target.value;
    setBackupMainTime(backupMain);
  }
  const handleMainOFF = (e) => {
    const mainOff = e.target.value;
    setMainOFF(mainOff);
  }
  const handleBackupOn = (e) => {
    const backupOFF = e.target.value;
    setBackupOn(backupOFF);
  }

  async function getAsset() {
    const response = await api.get('/api/ApplicationLookups', {
      headers: { Authorization: localStorage.getItem('access_token') },
      user: localStorage.getItem('loggedInUser')
    });
    if (response.status === 200) {
      setLookUpList(response.data);
    }
  }
  useEffect(() => {
    var timezones = moment.tz.names();
    settimezoneList(timezones);
    getAsset();
  }, []);

  useEffect(() => {
    if (lookUpList !== undefined) {
      if (lookUpList.length !== 0) {
        lookUpList.map((list) => {
          if (list.listName === 'RefreshRate') {
            setPut(true);
            setLookUpId(list._id);
            const inSeconds = Math.round(list.opt1 / 1000);
            setRefreshTime(inSeconds);
          }
          else if (list.listName === 'CoolDownTime') {
            setPut(true);
            setCoolDownlookUpId(list._id);
            const inSeconds = Math.round(list.opt1 / 1000);
            setEngineCoolDownTime(inSeconds);
          }
          else if (list.listName === 'Backup&MainTime') {
            setPut(true);
            setBackupMainTimelookUpId(list._id);
            const inSeconds = Math.round(list.opt1 / 1000);
            setBackupMainTime(inSeconds);
          }
          else if (list.listName === 'MainOff') {
            setPut(true);
            setMainOFFlookUpId(list._id);
            const inSeconds = Math.round(list.opt1 / 1000);
            setMainOFF(inSeconds);
          }
          else if (list.listName === 'BackUpOff') {
            setPut(true);
            setBackupOnlookUpId(list._id);
            const inSeconds = Math.round(list.opt1 / 1000);
            setBackupOn(inSeconds);
          }
          else if(list.listName == "emailTimezone") {
            setPut(true);
            setTimezoneLookUpId(list._id);
            setTimeZone(list.opt1);
          }
        });
      }
    }
  }, [lookUpList]);

  const notifySuccess = () => toast.success('Refresh Rate added Successfully');
  const notifySuccessEngineTime = () => toast.success('Engine cool down time  added Successfully');
  const notifySuccessTimeZone = () => toast.success('Timezone updated Successfully');
  const notifySuccessMainBackupLostTime = () => toast.success('Primary & Backup Power Lost Time added successfully');
  const notifySuccessMainLostTime = () => toast.success('Primary power lost time added Successfully');
  const notifySuccessBackupOnTime = () => toast.success('Backup Power on time added Successfully');

  const handleSubmit = async () => {
    if (errTiming) {
      setErrTiming(false)
    }

    const re = /^[0-9\b]+$/;
    if (refreshTime < 7) {
      setAlert(true);
    } else {
      setAlert(false);
    }

    if (!re.test(refreshTime)) {
      setNumErr(true);
    }

    let response = '';
    let data = {
      applicationlookups: {
        tenantId: 'ps19',
        listName: 'RefreshRate',
        code: 'default',
        description: 'Refresh rate for fetching data',
        opt1: refreshTime * 1000
      }
    };
    response = await api.put('/api/ApplicationLookUps/' + lookUpId, data, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });

    if (response.status === 200) {
      setOpens(false);
      notifySuccess();
      getAsset();
    }

  };

  const handleFocus = () => {
    setAlert(false);
    setNumErr(false);
  };

  const handleClickOpen = () => {

    const re = /^[0-9\b]+$/;
    if (refreshTime < 7) {
      setOpens(false);
      setAlert(true);
      setErrTiming(false)
    }
    if (!re.test(refreshTime)) {
      setOpens(false);
      setNumErr(true);
      setErrTiming(false)
    } else if (refreshTime >= 7) {
      setOpens(true);
      setErrTiming(true)
    }
  };
  const handleCloses = () => {
    setOpens(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setErrTiming(true)
    }, 8000);


  }, [])


  const handleSubmitCoolDownTime = async () => {
    if (errTimingEngineTime) {
      setErrTimingEngineTime(false)
    }

    const re = /^[0-9\b]+$/;
    if (engineCoolDownTime < 7) {
      setAlertEngineTime(true);
    } else {
      setAlertEngineTime(false);
    }

    if (!re.test(engineCoolDownTime)) {
      setNumsErrEngineTime(true);
    }

    let response = '';
    let data = {
      applicationlookups: {
        tenantId: 'ps19',
        listName: 'CoolDownTime',
        code: 'default',
        description: 'Engine cool down time',
        opt1: engineCoolDownTime * 1000
      }
    };
    response = await api.put('/api/ApplicationLookUps/' + coolDownlookUpId, data, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });

    if (response.status === 200) {
      setopenEngineTime(false);
      notifySuccessEngineTime();
      getAsset();
    }
  }

  const handleMainBackupTime = async () => {
    if (errTimingEngineTime) {
      setErrTimingEngineTime(false)
    }

    const re = /^[0-9\b]+$/;
    if (backupMainTime < 7) {
      setAlertEngineTime(true);
    } else {
      setAlertEngineTime(false);
    }

    if (!re.test(backupMainTime)) {
      setNumsErrEngineTime(true);
    }

    let response = '';
    let data = {
      applicationlookups: {
        tenantId: 'ps19',
        listName: 'Backup&MainTime',
        code: 'default',
        description: 'Primary & Backup Power Lost Time',
        opt1: backupMainTime * 1000
      }
    };
    response = await api.put('/api/ApplicationLookUps/' + backupMainTimelookUpId, data, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });

    if (response.status === 200) {
      setopenBackUpMain(false);
      notifySuccessMainBackupLostTime();
      getAsset();
    }
  }

  const handleMainOffTime = async () => {
    if (errTimingEngineTime) {
      setErrTimingEngineTime(false)
    }

    const re = /^[0-9\b]+$/;
    if (mainOFF < 7) {
      setAlertEngineTime(true);
    } else {
      setAlertEngineTime(false);
    }

    if (!re.test(mainOFF)) {
      setNumsErrEngineTime(true);
    }

    let response = '';
    let data = {
      applicationlookups: {
        tenantId: 'ps19',
        listName: 'MainOff',
        code: 'default',
        description: 'Main Power Off Time',
        opt1: mainOFF * 1000
      }
    };
    response = await api.put('/api/ApplicationLookUps/' + mainOFFlookUpId, data, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });
    if (response.status === 200) {
      setopenMainLost(false);
      notifySuccessMainLostTime();
      getAsset();
    }
  }

  const handleBackupOnTime = async () => {
    if (errTimingEngineTime) {
      setErrTimingEngineTime(false)
    }

    const re = /^[0-9\b]+$/;
    if (backupOn < 7) {
      setAlertEngineTime(true);
    } else {
      setAlertEngineTime(false);
    }

    if (!re.test(backupOn)) {
      setNumsErrEngineTime(true);
    }

    let response = '';
    let data = {
      applicationlookups: {
        tenantId: 'ps19',
        listName: 'BackUpOff',
        code: 'default',
        description: 'Backup Power On Time',
        opt1: backupOn * 1000
      }
    };
    response = await api.put('/api/ApplicationLookUps/' + backupONlookUpId, data, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });
    if (response.status === 200) {
      setOpenGenOn(false);
      notifySuccessBackupOnTime();
      getAsset();
    }
  }
  const handleClickOpenCoolDown = () => {

    const re = /^[0-9\b]+$/;
    if (engineCoolDownTime < 7) {
      setopenEngineTime(false);
      setAlertEngineTime(true);
      setErrTimingEngineTime(false)
    }
    if (!re.test(engineCoolDownTime)) {
      setopenEngineTime(false);
      setNumsErrEngineTime(true);
      setErrTimingEngineTime(false)
    } else if (engineCoolDownTime >= 7) {
      setopenEngineTime(true);
      setErrTimingEngineTime(true)
    }
  }
  const handleClickOpenBackUpMain = () => {
    const re = /^[0-9\b]+$/;
    if (backupMainTime < 7) {
      setopenBackUpMain(false);
      setAlertEngineTime(true);
      setErrTimingEngineTime(false)
    }
    if (!re.test(backupMainTime)) {
      setopenBackUpMain(false);
      setNumsErrEngineTime(true);
      setErrTimingEngineTime(false)
    } else if (backupMainTime >= 7) {
      setopenBackUpMain(true);
      setErrTimingEngineTime(true)
    }
  }
  const handleTimeZoneSubmit = () => {
   
    setopenMainLost(true);
  }
  const handleClickBackUpOn = () => {
    const re = /^[0-9\b]+$/;
    if (backupOn < 7) {
      setOpenGenOn(false);
      setAlertEngineTime(true);
      setErrTimingEngineTime(false)
    }
    if (!re.test(backupOn)) {
      setOpenGenOn(false);
      setNumsErrEngineTime(true);
      setErrTimingEngineTime(false)
    } else if (backupOn >= 7) {
      setOpenGenOn(true);
      setErrTimingEngineTime(true)
    }
  };
  const handleClosesCooldown = () => {
    setopenEngineTime(false);
  };

  const handleFocusEngineTime = () => {
    setAlertEngineTime(false);
    setNumsErrEngineTime(false);
  }

  const handleTimeZone = async (e) =>{
    setTimeZone(e.target.value);
  }
  const submitTimeZone = async() =>{
 let response = '';
    let data = {
      applicationlookups: {
        tenantId: 'ps19',
        listName: 'emailTimezone',
        code: 'emailTimezone-00',
        description: 'emailTimezone',
        opt1:  timeZone ? timeZone : "US/Central"
      }
    };
    response = await api.put('/api/ApplicationLookUps/' + timezonelookUpId, data, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });

    if (response.status === 200) {
      setopenMainLost(false);
      notifySuccessTimeZone();
      getAsset();
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setErrTimingEngineTime(true)
    }, 8000);


  }, [])

  return (
    <div>
      <ToastContainer />
      <Container maxWidth="xl">
        <Grid spacing={2} sx={{ marginTop: "20px" }} container>

          <Grid item xs={12} md={6}>
            <Box
              as={Paper}
              sx={{
                maxWidth: '100%',
                marginTop: '1px',
                padding: '16px',
                boxShadow: '1px 2px 10px #e9e9e9'
              }}
            >
              <label> Refresh Rate (Seconds) </label>

              <TextField
                onChange={handleChange}
                name="refreshRate"
                value={refreshTime}
                onFocus={handleFocus}
                sx={{ outline: 'none', border: '1px solid black' }}
                fullWidth
                placeholder="Refresh Rate (Seconds)"
                id="refreshRate"
                style={{ border: alert || numsErr ? '1px solid red' : '1px solid black' }}

              />
              {errTiming === false ? <span className="err-span-validation" style={{ display: alert ? 'block' : 'none', background: "#FF3333", padding: "10px 30px", color: "white", borderRadius: "8px", position: "relative", marginTop: "10px" }}>
                <AiOutlineExclamationCircle style={{ position: "absolute", right: "0", color: "white", fontSize: "20px", marginRight: "10px" }} />
                <div style={{ width: "0", height: "0", borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid #FF3333", position: "absolute", top: "-9.6px" }}></div>
                Refresh rate cannot be less than 7 seconds
              </span> : ""}


              {errTiming === false ? <span className="err-span-validation" style={{ display: numsErr ? 'block' : 'none', background: "#FF3333", padding: "10px 30px", color: "white", borderRadius: "8px", position: "relative", marginTop: "10px" }}>
                <AiOutlineExclamationCircle style={{ position: "absolute", right: "0", color: "white", fontSize: "20px", marginRight: "10px" }} />
                <div style={{ width: "0", height: "0", borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid #FF3333", position: "absolute", top: "-9.6px" }}></div>
                Only numbers Allowed
              </span> : ""}




              <Button
                onClick={handleClickOpen}
                type="submit"
                sx={{
                  background: '#1B1464',
                  borderRadius: '0',
                  marginTop: '20px',
                  minWidth: '120px',
                  boxShadow: '0'
                }}
                variant="contained"
              >
                Submit
              </Button>
              <Dialog
                open={opens}
                onClose={handleCloses}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description"></DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    className="modalButtons"
                    sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                    onClick={handleCloses}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="modalButtons"
                    sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                    onClick={handleSubmit}
                  >
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              as={Paper}
              sx={{
                maxWidth: '100%',
                marginTop: '1px',
                padding: '16px',
                boxShadow: '1px 2px 10px #e9e9e9'
              }}
            >
              <label> Engine cool down time (Seconds) </label>

              <TextField
                onChange={handleChangeCoolDown}
                name="primary"
                value={engineCoolDownTime}
                onFocus={handleFocusEngineTime}
                sx={{ outline: 'none', border: '1px solid black' }}
                fullWidth
                placeholder="Engine cool down time(Seconds)"
                id="primary"
                style={{ border: alertEngineTime || numsErrEngineTime ? '1px solid red' : '1px solid black' }}

              />
              {errTimingEngineTime === false ? <span className="err-span-validation" style={{ display: alertEngineTime ? 'block' : 'none', background: "#FF3333", padding: "10px 30px", color: "white", borderRadius: "8px", position: "relative", marginTop: "10px" }}>
                <AiOutlineExclamationCircle style={{ position: "absolute", right: "0", color: "white", fontSize: "20px", marginRight: "10px" }} />
                <div style={{ width: "0", height: "0", borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid #FF3333", position: "absolute", top: "-9.6px" }}></div>
                Engine cool down time cannot be less than 7 seconds
              </span> : ""}


              {errTimingEngineTime === false ? <span className="err-span-validation" style={{ display: numsErrEngineTime ? 'block' : 'none', background: "#FF3333", padding: "10px 30px", color: "white", borderRadius: "8px", position: "relative", marginTop: "10px" }}>
                <AiOutlineExclamationCircle style={{ position: "absolute", right: "0", color: "white", fontSize: "20px", marginRight: "10px" }} />
                <div style={{ width: "0", height: "0", borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid #FF3333", position: "absolute", top: "-9.6px" }}></div>
                Only numbers Allowed
              </span> : ""}

              <Button
                onClick={handleClickOpenCoolDown}
                type="submit"
                sx={{
                  background: '#1B1464',
                  borderRadius: '0',
                  marginTop: '20px',
                  minWidth: '120px',
                  boxShadow: '0'
                }}
                variant="contained"
              >
                Submit
              </Button>
              <Dialog
                open={openEngineTime}
                onClose={handleClosesCooldown}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description"></DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    className="modalButtons"
                    sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                    onClick={handleClosesCooldown}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="modalButtons"
                    sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                    onClick={handleSubmitCoolDownTime}
                  >
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>

          {<Grid item xs={12} md={6}>
            <Box
              as={Paper}
              sx={{
                maxWidth: '100%',
                marginTop: '1px',
                padding: '16px',
                boxShadow: '1px 2px 10px #e9e9e9'
              }}
            >
              <label> Backup & main power lost alert time (Seconds) </label>

              <TextField
                onChange={handleBackupMain}
                name="primary"
                value={backupMainTime}
                onFocus={handleFocusEngineTime}
                sx={{ outline: 'none', border: '1px solid black' }}
                fullWidth
                placeholder="Backup & MainTime power lost time(Seconds)"
                id="primary"
                style={{ border: alertEngineTime || numsErrEngineTime ? '1px solid red' : '1px solid black' }}

              />
              {errTimingEngineTime === false ? <span className="err-span-validation" style={{ display: alertEngineTime ? 'block' : 'none', background: "#FF3333", padding: "10px 30px", color: "white", borderRadius: "8px", position: "relative", marginTop: "10px" }}>
                <AiOutlineExclamationCircle style={{ position: "absolute", right: "0", color: "white", fontSize: "20px", marginRight: "10px" }} />
                <div style={{ width: "0", height: "0", borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid #FF3333", position: "absolute", top: "-9.6px" }}></div>
                Backup & main power lost time cannot be less than 7 seconds
              </span> : ""}


              {errTimingEngineTime === false ? <span className="err-span-validation" style={{ display: numsErrEngineTime ? 'block' : 'none', background: "#FF3333", padding: "10px 30px", color: "white", borderRadius: "8px", position: "relative", marginTop: "10px" }}>
                <AiOutlineExclamationCircle style={{ position: "absolute", right: "0", color: "white", fontSize: "20px", marginRight: "10px" }} />
                <div style={{ width: "0", height: "0", borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid #FF3333", position: "absolute", top: "-9.6px" }}></div>
                Only numbers Allowed
              </span> : ""}

              <Button
                onClick={handleClickOpenBackUpMain}
                type="submit"
                sx={{
                  background: '#1B1464',
                  borderRadius: '0',
                  marginTop: '20px',
                  minWidth: '120px',
                  boxShadow: '0'
                }}
                variant="contained"
              >
                Submit
              </Button>
              <Dialog
                open={openBackupMain}
                onClose={handleClosesCooldown}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description"></DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    className="modalButtons"
                    sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                    onClick={handleClosesCooldown}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="modalButtons"
                    sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                    onClick={handleMainBackupTime}
                  >
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>}

          {<Grid item xs={12} md={6} >
            <Box  as={Paper}
              sx={{
                maxWidth: '100%',
                marginTop: '1px',
                padding: '16px',
                boxShadow: '1px 2px 10px #e9e9e9'}}>
            <FormControl fullWidth>
            
              <label>Alert Email TimeZone </label>

              <Select
                labelId="emailtimezone"
                id="emailtimezone"
                value={timeZone}
                label="Age"
                style={{border:'1px solid black'}}
                onChange={handleTimeZone}
              >
                {
                  timezoneList.map((timezone, index)=>{
                    return(
                      <MenuItem key={index} value={timezone}>{timezone}</MenuItem>
                    )
                  })
                }
              
              </Select>
              <Button
                onClick={handleTimeZoneSubmit}
                type="submit"
                sx={{
                  background: '#1B1464',
                  borderRadius: '0',
                  marginTop: '20px',
                  minWidth: '120px',
                  boxShadow: '0'
                }}
                variant="contained"
                style={{width:'100px'}}
              >
                Submit
              </Button>
            </FormControl>
            
            <Dialog
                open={openMainLost}
                onClose={handleClosesCooldown}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
            <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description"></DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    className="modalButtons"
                    sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                    onClick={handleClosesCooldown}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="modalButtons"
                    sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                    onClick={submitTimeZone}
                  >
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>}

          {/* { <Grid item xs={12} md={6}>
            <Box
              as={Paper}
              sx={{
                maxWidth: '100%',
                marginTop: '1px',
                padding: '16px',
                boxShadow: '1px 2px 10px #e9e9e9'
              }}
            >
              <label>Backup power on alert time (Seconds) </label>

              <TextField
                onChange={handleBackupOn}
                name="primary"
                value={backupOn}
                onFocus={handleFocusEngineTime}
                sx={{ outline: 'none', border: '1px solid black' }}
                fullWidth
                placeholder="Main power on time(Seconds)"
                id="primary"
                style={{ border: alertEngineTime || numsErrEngineTime ? '1px solid red' : '1px solid black' }}

              />
              {errTimingEngineTime === false ? <span className="err-span-validation" style={{ display: alertEngineTime ? 'block' : 'none', background: "#FF3333", padding: "10px 30px", color: "white", borderRadius: "8px", position: "relative", marginTop: "10px" }}>
                <AiOutlineExclamationCircle style={{ position: "absolute", right: "0", color: "white", fontSize: "20px", marginRight: "10px" }} />
                <div style={{ width: "0", height: "0", borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid #FF3333", position: "absolute", top: "-9.6px" }}></div>
                Backup Power lost time cannot be less than 7 seconds
              </span> : ""}


              {errTimingEngineTime === false ? <span className="err-span-validation" style={{ display: numsErrEngineTime ? 'block' : 'none', background: "#FF3333", padding: "10px 30px", color: "white", borderRadius: "8px", position: "relative", marginTop: "10px" }}>
                <AiOutlineExclamationCircle style={{ position: "absolute", right: "0", color: "white", fontSize: "20px", marginRight: "10px" }} />
                <div style={{ width: "0", height: "0", borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid #FF3333", position: "absolute", top: "-9.6px" }}></div>
                Only numbers Allowed
              </span> : ""}

              <Button
                onClick={handleClickBackUpOn}
                type="submit"
                sx={{
                  background: '#1B1464',
                  borderRadius: '0',
                  marginTop: '20px',
                  minWidth: '120px',
                  boxShadow: '0'
                }}
                variant="contained"
              >
                Submit
              </Button>
              <Dialog
                open={openGenOn}
                onClose={handleBackupOn}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description"></DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    className="modalButtons"
                    sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                    onClick={handleClosesCooldown}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="modalButtons"
                    sx={{ background: '#1B1464', borderRadius: '0', color: 'white' }}
                    onClick={handleBackupOnTime}
                  >
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid> } */}

        </Grid>
      </Container>

    </div>
  );
}

export default Configurations;
