import * as React from 'react';
import { useState,useEffect } from 'react';
import { DeleteSharp, Edit } from '@mui/icons-material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import BasicTabs from './TabsLayout.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AiOutlineExclamationCircle } from 'react-icons/ai';

import "./assetsData.css"
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getServerEndpoint } from '../../../utils/serverEndpoint';
import { PopUpModal } from '../../../components/Root.js';
import { PopUpModalAssignDevice } from '../../../components/Root';
import { PopUpModalAssignNewDevice } from '../../../components/Root';

export default function LocationIdentifier({locationIdentifierAssets,getLocationIdentifier,load}) {
  const [open, setOpen] = React.useState(false);
  const [parentId, setParentId] = React.useState('');
  const [showRadioGroup, setShowRadioGroup] = React.useState('flex');
  const [existingAsset, setExistingAsset] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [parentName, setParentName] = React.useState('');
  const [errIp, setErrIp] = React.useState(false);
  const [errslave, setErrSlave] = React.useState(false);
  const [errFuncCode, setErrFunCode] = React.useState(false);
  const [errport, setErrPort] = React.useState(false);
  const [showErr,setShowErr]=React.useState("")
  const [opens, setOpens] = React.useState(false);
  const [openIdentifier, setOpenIdentifier] = React.useState(false);
  const [openAssigndevices, setOpenAssigndevices] = React.useState(false);
  const [assignId, setAssignId] = React.useState();
  const [assetVal, setAssetVal] = React.useState({});
  const [showModal,setShowModal] = React.useState(false);
  const [assignedNewDeviceSettings, setAssignedNewDeviceSettings] = React.useState({
      ip: String,
      port: Number,
      slaveAddr: Number,
      funcCode: Number,
      serial: {
        baudRate: Number,
        dataBit: Number,
        parity: String,
        stopBit: Number
      }
  });

  const handleCloses = () => setOpens(false);
  const handleCloseIdentifer = () => setOpenIdentifier(false);
  const handleCloseAssignedDevice = () => setOpenAssigndevices(false);
  const [supportedDevice, setSupportedDevice] = React.useState([]);
  const [selectedDevice, setSelectedDevice] = React.useState('');
  const [alreadyAssigned, setAlreadyAssigned] = React.useState([]);
  const [countGenset, setCountGenset] = React.useState(0);
  const [countAts, setCountAts] = React.useState(0);
  const [parentAssetId, setParentAssetId] = React.useState();
  const [locationId, setLocationId] = React.useState({});
  const [err,setErr]=React.useState(false);
  const [errTiming,setErrTiming]=useState(false);
  const [assignDevices, setAssignDevices] = React.useState({
    parentAsset: String,
    assetType: String,
    settings: {
      port: "",
      ip: "",
      slaveAddr: "",
      funcCode: "",
      serial: {
        baudRate: Number,
        dataBit: Number,
        parity: String,
        stopBit: Number
      }
    },
    suppDevice: {
      _id: Number,
      name: String
    },
    state: Object
  });

  const api = axios.create({
    baseURL: getServerEndpoint()
  });

  const getSupportedDevices = async () => {
    const response = await api.get('/api/devices', {
      headers: { Authorization: localStorage.getItem('access_token') }
    });

    if (response.status === 200) {
      setSupportedDevice(response.data.assetsList);
    }
  };
  
  React.useEffect(() => {
    getSupportedDevices();
  }, []);

  const handleClick = async (id, name) => {
    setExistingAsset('');
    setOpen(true);
    setParentId(id);
    setShowForm(false);
    setSelectedDevice('');
    setParentName(name);

    let allAssets;
    const response = await api.get('/api/asset', {
      headers: { Authorization: localStorage.getItem('access_token') },
      user: localStorage.getItem('loggedInUser')
    });

    if (response.status === 200) {
      allAssets = response.data.assetsList;
      let alreadyAssigned = allAssets.filter(({ parentAsset }) => parentAsset === id);
      let gensetCount = alreadyAssigned.filter(({suppDevice}) => suppDevice.type === "GENSET").length;
      let atsCount = alreadyAssigned.filter(({suppDevice}) => suppDevice.type === "ATS").length;
      setCountGenset(gensetCount);
      setCountAts(atsCount);
      setAlreadyAssigned(alreadyAssigned);
    }
  };

  const notifySuccess = (key) => toast.success('Device Added Successfully');

  const handleChooseDevice = (e) => {
    let id = e.target.value;
    let suppDeviceInfo = supportedDevice.find(({ _id }) => _id === id);
    
    setSelectedDevice(e.target.value);
    setShowForm(true);
    
    setAssignDevices({
      ...assignDevices,
      parentAsset: parentId,
      assetType: 'device',
      suppDevice: {
        ...assignDevices.suppDevice,
        _id: e.target.value,
        name: suppDeviceInfo.name,
        type: suppDeviceInfo.type
      }
    });
  };
  const handleClose = () => setOpen(false);

  const textFieldStyle = {
    width: '70vw',
    maxWidth: '100%',
    margin: '10px'
  };
  const flexStyle = {
    margin: '5px'
  };
  const styled = {
    background: 'rgba(0, 0, 0, 0.7)',

  };

  const handleDelete = async () => {

    const response =  await api.delete('/api/asset/'+locationId,{ 
      headers: {"Authorization" : localStorage.getItem('access_token')},
      params:{id:locationId} 
    });

    if (response.status === 200) {
      getLocationIdentifier(parentAssetId);
      load();
      setOpens(false)
    }
  };

  const updateAsset = async () => {
    if (errTiming){
      setErrTiming(false)
  }
      if (!assetVal.name){ 
        setErr(true)
        return false
      }
    let val = assetVal._id;
    const response = await api.put('/api/asset/' + val, assetVal, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });

    if (response.status === 200) {
      setOpenIdentifier(false);
      getLocationIdentifier(response.data.parentAsset);
    }
  };

  const handleEdit = async (val) => {
    const response = await api.get('/api/asset/' + val, {
      headers: { Authorization: localStorage.getItem('access_token') },
      params: { id: val }
    });
    if (response.status === 200) {
      setAssetVal(response.data);
      setOpenIdentifier(true);
    }
  };

  const handleAssetEdit = (e) => {
    setAssetVal({ ...assetVal, name: e.target.value, unitId: e.target.value });
  };

  const handleAssignedSettings = (e) => {
    let paramValue = e.target.value;
    const name = e.target.name;
    if ([name] == 'port' || [name] == 'slaveAddr' || [name] == 'funcCode'){
      paramValue = parseInt(e.target.value, 10);
    }
   
    setAssignedNewDeviceSettings({
      ...assignedNewDeviceSettings,
      [e.target.name]: paramValue
    });
  };


  const handleAssignedSerial = (e) => {
    setAssignedNewDeviceSettings({
      ...assignedNewDeviceSettings,
      serial: {
        ...assignedNewDeviceSettings.serial,
        [e.target.name]: e.target.value
      }
    });
  };

  const addDeviceSettings = (e) => {
    const name = e.target.name;
    let paramValue = e.target.value;
    
    if (name === "port" || name === "slaveAddr" || name === "funcCode") {
    //paramValue = parseInt(e.target.value, 10);
      paramValue = e.target.valueAsNumber;
    }
    
    setAssignDevices({
      ...assignDevices,
      settings: {
        ...assignDevices.settings,
        [e.target.name]: paramValue
      }
    });
  };

    const assignDevice = async () => {
  if (assignDevices.settings.ip==""){
    setErrIp(true)
  }
  else {
    setErrIp(false)
  }

  if (!assignDevices.settings.port){

    setErrPort(true)
  }
  else {
    setErrPort(false)
  }

  if (!assignDevices.settings.slaveAddr){

    setErrSlave(true)
  }
  else {
    setErrSlave(false)
  }

  if (!assignDevices.settings.funcCode){

    setErrFunCode(true)
  }
  else {
    setErrFunCode(false)
  }
    
      if (assignDevices.settings.ip=="" || !assignDevices.settings.port || !assignDevices.settings.slaveAddr || !assignDevices.settings.funcCode  ){
    
        return;
      }

    let data = assignDevices;
  
    const response = await api.post('/api/asset/assignDevice', data, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });
    if (response.status === 200) {
     
      notifySuccess();
    }
    setOpen(false);

  };


  const addDeviceSerial = (e) => {
    const name = e.target.name;
    let paramValue = e.target.value;
    if ([name] == 'baudRate' || [name] == 'dataBit' || [name] == 'stopBit') {
      paramValue = parseInt(e.target.value, 10);
    }
    setAssignDevices({
      ...assignDevices,
      settings: {
        ...assignDevices.settings,
        serial: {
          ...assignDevices.settings.serial,
          [e.target.name]: paramValue
        }
      }
    });
  };

  async function handleClickEdit(val) {
    const response = await api.get('/api/asset/' + val, {
      headers: { Authorization: localStorage.getItem('access_token') },
      params: { id: val }
    });

    if (response.status === 200) {
      setAssignedNewDeviceSettings(response.data.settings);
      setAssignId(val);
      setOpenAssigndevices(true);
    }
  }

  const updateAssignDevice = async () => {
    let settingsUpdate = {
      _id: assignId,
      settings: assignedNewDeviceSettings,
      serial: assignedNewDeviceSettings.serial
    };
  
    const response = await api.put('/api/asset/' + assignId, settingsUpdate, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });

    if (response.status === 200) {
      setOpenAssigndevices(false);
      setOpen(false);
      notifyUpdate()
    }
  };

  const handleDeleteAssign = async (val,parentId) => {

    const response = await api.delete('/api/asset/' + val, {
      headers: { Authorization: localStorage.getItem('access_token') },
      params: { id: val }
    });

    if (response.status === 200) {
      let allAssets;
      const resp = await api.get('/api/asset', {
        headers: { Authorization: localStorage.getItem('access_token') },
        user: localStorage.getItem('loggedInUser')
      });
      if (resp.status === 200) {
        allAssets = resp.data.assetsList;
        let alreadyAssigned = allAssets.filter(({ parentAsset }) => parentAsset === parentId);
        setAlreadyAssigned(alreadyAssigned);
      }
    }
    setOpens(false);
    setOpen(false);
  };
  const notifyUpdate = () => toast.success("Device Updated Successfully");

  const handleAddLocation = (id) => {
    setParentId(id);
    setShowModal(true);
  }
  const handleFocus=()=>{
    setShowErr("")
    setErr(false)
  }

  const handleClickOpen = async (id,parentLocId) => {
    setLocationId(id)
    setParentAssetId(parentLocId)
    setOpens(true);
  };
 
  useEffect(()=>{

    setTimeout(() => {
      setErrTiming(true)
  
    }, 8000);
  
    },[errTiming])
  return (
    <div>
      <Modal
        open={openIdentifier}
        onClose={handleCloseIdentifer}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <PopUpModal>
        <Box >
          <TextField
            label="Building"
            name="Building"
            sx={textFieldStyle}
            value={assetVal.name}
            fullWidth
            onChange={handleAssetEdit}
          />
          <Button style={{borderRadius: "0px", marginTop:'10px', boxShadow:'none',background:"#1B1464"}}  variant="contained" onClick={updateAsset}>
            Update
          </Button>
          { errTiming===false?
                 <span  className="err-span-validation" style={{ display: err ? 'block' : 'none'  ,background:"#FF3333",padding:"10px 30px",color:"white",borderRadius:"8px",position:"relative",marginTop:"10px"}}>
            <AiOutlineExclamationCircle style={{position:"absolute",right:"0",color:"white",fontSize:"20px",marginRight:"10px"}}/>
            <div style={{width: "0",height: "0",borderLeft: "10px solid transparent",borderRight: "10px solid transparent",borderBottom: "10px solid #FF3333",position:"absolute",top:"-9.6px"}}></div>
           Field is required
            </span>
                         :""} 
        </Box>
        </PopUpModal>
      </Modal>

      <Modal
  
        open={openAssigndevices}
        onClose={handleCloseAssignedDevice}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      
      >
        <PopUpModalAssignDevice>
        <Box>
          <TextField
            label="IP Address"
            name="ip"
            sx={textFieldStyle}
            value={assignedNewDeviceSettings.hasOwnProperty('ip') ? assignedNewDeviceSettings.ip : ''}
            fullWidth
            onChange={handleAssignedSettings}
          />
          <TextField
            label="Port Number"
            name="port"
            type='number'
            sx={textFieldStyle}
            value={assignedNewDeviceSettings.hasOwnProperty('port') ? assignedNewDeviceSettings.port : ''}
            fullWidth
            onChange={handleAssignedSettings}
          />
          <TextField
            label="Slave Address"
            name="slaveAddr"
            type='number'
            sx={textFieldStyle}
            value={assignedNewDeviceSettings.hasOwnProperty('slaveAddr') ? assignedNewDeviceSettings.slaveAddr : ''}
            fullWidth
            onChange={handleAssignedSettings}
          />
          <TextField
            label="Function Code"
            name="funcCode"
            type='number'
            sx={textFieldStyle}
            value={assignedNewDeviceSettings.hasOwnProperty('funcCode') ? assignedNewDeviceSettings.funcCode : ''}
            fullWidth
            onChange={handleAssignedSettings}
          />

          <TextField
            label="Baud Rate"
            name="baudRate"
            sx={textFieldStyle}
            value={assignedNewDeviceSettings.hasOwnProperty('serial') ?assignedNewDeviceSettings.serial.baudRate : ''}
            fullWidth
            onChange={handleAssignedSerial}
          />
          <TextField
            label="Data Bit"
            name="dataBit"
            sx={textFieldStyle}
            value={assignedNewDeviceSettings.hasOwnProperty('serial') ?assignedNewDeviceSettings.serial.dataBit : ''}
            fullWidth
            onChange={handleAssignedSerial}
          />

          <TextField
            label="Parity"
            name="parity"
            sx={textFieldStyle}
            value={assignedNewDeviceSettings.hasOwnProperty('serial') ?assignedNewDeviceSettings.serial.parity : ''}
            fullWidth
            onChange={handleAssignedSerial}
          />

          <TextField
            label="Stop Bit"
            name="stopBit"
            sx={textFieldStyle}
            value={assignedNewDeviceSettings.hasOwnProperty('serial') ?assignedNewDeviceSettings.serial.stopBit : ''}
            fullWidth
            onChange={handleAssignedSerial}
          />
          <Button variant="contained" style={{borderRadius: "0px", marginTop:'10px', boxShadow:'none',background:"#1B1464"}} onClick={updateAssignDevice}>
            update
          </Button>
        </Box>
        </PopUpModalAssignDevice>
      </Modal>

      <ToastContainer />
      <TableContainer
        component={Paper}
        style={{ marginTop: '20px', boxShadow: '0px 2px 5px grey' }}
      >
        <Table  aria-label="simple table">
          <TableHead style={{ background: '#1B1464' }}>
            <TableRow>
              <TableCell sx={{color:"white"}} align="center">Asset</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locationIdentifierAssets.map(
              (row, index) =>
                row !== undefined && (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <div
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ flex: 9 }}
                      
                      >
                        {row.name}
                      </TableCell>

                      <TableCell
                        component="th"
                        scope="row"
                        style={{
                       
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginLeft: '1px'
                        }}
                      >
                        <AddLocationIcon
                          onClick={() => handleClick(row._id, row.name)}
                          sx={{color:"#5856d6"}}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{
                       
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginLeft: '1px'
                        }}
                        onClick={() => handleEdit(row._id)}
                      >
                        <Edit sx={{ color: 'green' }} />
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{
                         
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginLeft: '1px'
                        }}
                      >
                      <DeleteSharp onClick={() =>handleClickOpen(row._id, row.parentAsset)}  sx={{color:"#d11a2a"}}/>
                      </TableCell>

                    </div>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={opens}
        onClose={handleCloses}
        
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure . You want to delete?"}</DialogTitle>
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
            onClick={handleDelete}
          >
            Agree
          </Button>
        </DialogActions>
    </Dialog>
      <Modal
    sx={styled}
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    open={showModal}
    onClose={()=>setShowModal(false)}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
    >
    <Fade in={showModal}>
    <PopUpModalAssignDevice>
      <Box 
        component="form"
        noValidate
      >   
        <BasicTabs name="Asset" parentID= {parentId}  />
      </Box>
      </PopUpModalAssignDevice>
    </Fade>
    </Modal> 
      
      <Modal
        sx={styled}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
        style={{ overflowY: 'auto' }}
      >
        <Fade style={{height:"600px"}} in={open}>
        <PopUpModalAssignNewDevice>
          <Box component="form" noValidate>
            <p
              style={{
                textAlign: 'center',
                marginTop: '-25px',
                fontWeight: '600',
                fontSize: '22px'
              }}
            >
              Assign New Device To Asset
            </p>
            <div style={{ display: showRadioGroup, justifyContent: 'space-evenly', margin: '0px' }}>
            {
              countGenset !== 1 && countAts !== 1 || countGenset === 0 && countAts === 1 || countGenset === 1 && countAts === 0  ? 
                <FormControl style={{ marginLeft: '8px' }} fullWidth>
                  <InputLabel id="demo-simple-select-label">Choose Device</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedDevice}
                      label="Choose Device"
                      onChange={handleChooseDevice}
                      >
                      {supportedDevice.map((val, ind) => {
                        if(val.type === "GENSET" && countGenset !==1)
                        {
                          return (
                            <MenuItem key={ind} value={val._id} name={val.name}>
                              {val.name}
                            </MenuItem>
                          );
                        }
                        if(val.type === "ATS" && countAts !==1)
                        {
                          return (
                            <MenuItem key={ind} value={val._id} name={val.name}>
                              {val.name}
                            </MenuItem>
                          );
                        }
                      })}
                    </Select>
              </FormControl>
            : null
            }
             
            </div>
            {showForm === true && (
              <div>
                <TextField
                  label="IP Address"
                  name="ip"
                  value={assignDevices.settings.ip?assignDevices.settings.ip:""}
                  sx={textFieldStyle}
                  fullWidth
                  onChange={addDeviceSettings}
  
                />
                <span className='err-span-validation'>{errIp&& <p style={{marginLeft:"9px",marginTop:"-5px"}}>Field required</p>}</span>
              
                <TextField
                  label="Port No"
                  name="port"
                  value={assignDevices.settings.port?assignDevices.settings.port:""}
                  sx={textFieldStyle}
                  type='number'
                  fullWidth
                  defaultValue=''
                  onChange={addDeviceSettings}
               
                />
                <span className='err-span-validation'>{errport&& <p style={{marginLeft:"9px",marginTop:"-5px"}}>Field required</p>}</span>
              
                <TextField
                  label="Slave Address"
                  name="slaveAddr"
                  value={assignDevices.settings.slaveAddr?assignDevices.settings.slaveAddr:""}
                  sx={textFieldStyle}
                  type='number'
                  fullWidth
                  onChange={addDeviceSettings}
                
                />
               <span className='err-span-validation'>{errslave&& <p style={{marginLeft:"9px",marginTop:"-5px"}}>Field required</p>}</span>
                   

                <TextField
                  label="Function Code"
                  name="funcCode"
                  value={assignDevices.settings.funcCode?assignDevices.settings.funcCode:""}
                  sx={textFieldStyle}
                  type='number'
                  fullWidth
                  onChange={addDeviceSettings}
                
                />
                    <span className='err-span-validation'>{errFuncCode&& <p style={{marginLeft:"9px",marginTop:"-5px"}}>Field required</p>}</span>
              
                <TextField
                  label="Baud Rate"
                  name="baudRate"
                  sx={textFieldStyle}
                  fullWidth
                  onChange={addDeviceSerial}
                />
                <TextField
                  label="Data Bit"
                  name="dataBit"
                  sx={textFieldStyle}
                  fullWidth
                  onChange={addDeviceSerial}
                />
                <TextField
                  label="Parity"
                  name="parity"
                  sx={textFieldStyle}
                  fullWidth
                  onChange={addDeviceSerial}
                />
                <TextField
                  label="Stop Bit"
                  name="stopBit"
                  sx={textFieldStyle}
                  fullWidth
                  onChange={addDeviceSerial}
                />

                <Button  style={{borderRadius: "0px", marginTop:'10px', boxShadow:'none',background:"#1B1464"}} variant="contained" onClick={assignDevice}>
                  Assign Device
                </Button>
              </div>
            )}
            {
              <div style={{ margin: '10px' }}>
                <h3> Assigned Devices</h3>
                <div>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 550 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ color:'white', backgroundColor: '#1B1464' }}>
                            Device Name
                          </TableCell>
                          <TableCell style={{ color:'white',backgroundColor: '#1B1464' }}>
                            Device Make
                          </TableCell>
                          <TableCell style={{ color:'white',backgroundColor: '#1B1464' }}>
                            Device Type
                          </TableCell>
                          <TableCell style={{color:'white', backgroundColor: '#1B1464' }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {alreadyAssigned.map((row) =>
                          supportedDevice.map(
                            (device) =>
                              device._id === row.suppDevice._id && (
                                <TableRow key={device._id}>
                                  <TableCell  scope="row">{device.name}</TableCell>
                                  <TableCell scope="row">{device.modelInfo.Model}</TableCell>
                                  <TableCell scope="row">{device.type}</TableCell>
                                  <TableCell scope="row">
                                    {
                                      <div style={{ display: 'flex' }}>
                                        <Button
                                          variant="contained"
                                          color="secondary"
                                          style={{ borderRadius: '0px', marginRight: '15px' }}
                                          onClick={() => handleClickEdit(row._id)}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          variant="contained"
                                          color="error"
                                          style={{ borderRadius: '0px', marginRight: '5px' }}
                                          onClick={() =>handleClickOpen(row._id, row.parentAsset)}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    }
                                  </TableCell>
                                </TableRow>
                              )
                          )
                        )}
                        <Dialog
                                  open={opens}
                                  onClose={handleCloses}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {"Are you sure . You want to delete?"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                    
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button className='modalButtons' sx={{background:"#1B1464",borderRadius:"0",color:"white"}} onClick={handleCloses}>Disagree</Button>
                                    <Button className='modalButtons'   sx={{background:"#1B1464",borderRadius:"0",color:"white"}} onClick={() => handleDeleteAssign(locationId,parentAssetId)} >
                                      Agree
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            }
          </Box>
          </PopUpModalAssignNewDevice>
        </Fade>
      </Modal>
    </div>
  );
}
