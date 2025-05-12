import { Box, Button } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useState } from 'react';
import LoadingScreen from 'react-loading-screen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../../Images/logo.png';
import { getServerEndpoint } from '../../../utils/serverEndpoint';
import "../Asset/assetsData.css"
import ModBusAtsForm from '../Devices/ModBusAtsForm';
import ModBusGenForm from '../Devices/ModBusGenForm';


function NewDevice({OpenModal,loading,setOpenModal}) {
    const [type,setType]=useState('');
    const [existingAsset,setExistingAsset] = React.useState([]);
    const [nameErr,setNameErr] = React.useState(false);
    const [typeErr,setTypeErr] = React.useState(false);
    const [isSubmit,setIsSubmit]=useState(false)
    
    const notifydanger = (key) => toast.warning(key+" Value is required");
    const notifySuccess = (key) => toast.success("Device Added Successfully");

  const [genModBusMap, setGenModBusMap] = React.useState({
    type:"",
    name:"",
    modelInfo:{
      Make:"",
      Model:"",
      Variant:"",
    },
    deviceLocaton:"",
    registers:{
      genStatus:{addr:Number(),qty:Number(),decoder:Object},
      controllerOpTime:{addr:Number(),qty:Number(),decoder:Object},
      engineTotalTime:{addr:Number(),qty:Number(),decoder:Object},
      engineTimeLoaded:{addr:Number(),qty:Number(),decoder:Object},
      engineTotalStarts:{addr:Number(),qty:Number(),decoder:Object},
      Va:{addr:Number(),qty:Number(),decoder:Object},
      Vb:{addr:Number(),qty:Number(),decoder:Object},
      Vc:{addr:Number(),qty:Number(),decoder:Object},
      Ia:{addr:Number(),qty:Number(),decoder:Object},
      Ib:{addr:Number(),qty:Number(),decoder:Object},
      Ic:{addr:Number(),qty:Number(),decoder:Object},
      powerFactor:{addr:Number(),qty:Number(),decoder:Object},
      freq:{addr:Number(),qty:Number(),decoder:Object},
      generatedEnergy:{addr:Number(),qty:Number(),decoder:Object},
      coolantTemp:{addr:Number(),qty:Number(),decoder:Object},
      coolantPressure:{addr:Number(),qty:Number(),decoder:Object},
      engineOilLevel:{addr:Number(),qty:Number(),decoder:Object},
      engineOilPressure:{addr:Number(),qty:Number(),decoder:Object},
      engineOilTemp:{addr:Number(),qty:Number(),decoder:Object},
      engineSpeed:{addr:Number(),qty:Number(),decoder:Object},
      engineTemp:{addr:Number(),qty:Number(),decoder:Object},
      batteryVoltage:{addr:Number(),qty:Number(),decoder:Object},
      fuelLevel:{addr:Number(),qty:Number(),decoder:Object},
      fuelTemp:{addr:Number(),qty:Number(),decoder:Object},
      fuelPressure:{addr:Number(),qty:Number(),decoder:Object},
      modBusProductId:{addr:Number(),qty:Number(),decoder:Object}
    }
  });

  const [atsModBusMap, setAtsModBusMap] = React.useState({
    type:"",
    name:"",
    modelInfo: {
      Make:"",
      Model:"",
      Variant:"",
    },
    deviceLocaton:"",
    registers: {
      systemOverview:{addr:Number(),qty:Number(),decoder:Object},
      srcA_V1:{addr:Number(),qty:Number(),decoder:Object},
      srcA_V2:{addr:Number(),qty:Number(),decoder:Object},
      srcA_V3:{addr:Number(),qty:Number(),decoder:Object},
      srcB_V1:{addr:Number(),qty:Number(),decoder:Object},
      srcB_V2:{addr:Number(),qty:Number(),decoder:Object},
      srcB_V3:{addr:Number(),qty:Number(),decoder:Object},
      srcA_Freq:{addr:Number(),qty:Number(),decoder:Object},
      srcB_Freq:{addr:Number(),qty:Number(),decoder:Object},
      lastOutageTime:{addr:Number(),qty:Number(),decoder:Object},
      lastOutageDate:{addr:Number(),qty:Number(),decoder:Object},

      lastOutageDuration:{addr:Number(),qty:Number(),decoder:Object},
      switchTrasferTotal:{addr:Number(),qty:Number(),decoder:Object},
      modBusProductId:{addr:Number(),qty:Number(),decoder:Object},
    }
  });

  const [genFieldsCheck, setGenFieldsCheck] = React.useState({
      genStatus:true,
      controllerOpTime:true,
      engineTotalTime:true,
      engineTimeLoaded:true,
      engineTotalStarts:true,
      Va:true,
      Vb:true,
      Vc:true,
      Ia:true,
      Ib:true,
      Ic:true,
      powerFactor:true,
      freq:true,
      generatedEnergy:true,
      coolantTemp:true,
      coolantPressure:true,
      engineOilLevel:true,
      engineOilPressure:true,
      engineOilTemp:true,
      engineSpeed:true,
      engineTemp:true,
      batteryVoltage:true,
      fuelLevel:true,
      fuelTemp:true,
      fuelPressure:true,
      modBusProductId:true
    
  });
  const [atsFieldsCheck, setAtsFieldsCheck] = React.useState({
      systemOverview:true,
      srcA_V1:true,
      srcA_V2:true,
      srcA_V3:true,
      srcB_V1:true,
      srcB_V2:true,
      srcB_V3:true,
      srcA_Freq:true,
      srcB_Freq:true,
      lastOutageTime:true,
      lastOutageDate:true,
      lastOutageDuration:true,
      switchTrasferTotal:true,
      modBusProductId:true,
  });
  const api = axios.create({
    baseURL: getServerEndpoint(),
   });

    const handleModBusMap = (e)=> {
      const decimalValue = parseInt(e.target.value, 16);
      const name = e.target.name;
      if(type === "GENSET")
      {
        setGenModBusMap({
          ...genModBusMap,    
          registers: {
            ...genModBusMap.registers,
            [name]:{
              ...genModBusMap.registers[name],
              addr:decimalValue
            }
          }
        })
       
      }
      else if(type === "ATS")
      {
        setAtsModBusMap({
          ...atsModBusMap,
          registers: {
            ...atsModBusMap.registers,
            [e.target.name]: decimalValue
          }
        })
       
      } 
    }
    const handleModBusMapQuantity = (e)=> {
      const decimalValue = parseInt(e.target.value, 16);
      const name = e.target.name;
      if(type === "GENSET")
      {
        setGenModBusMap({
          ...genModBusMap,
          registers: {
            ...genModBusMap.registers,
            [name]:{
              ...genModBusMap.registers[name],
              qty:decimalValue
            }
          }
        })
       
      }
      else if(type === "ATS")
      {
        setAtsModBusMap({
          ...atsModBusMap,
          registers: {
            ...atsModBusMap.registers,
            [e.target.name]: decimalValue
          }
        })
       
      } 
    }
    const handleRequiredCheck = (e)=>{
      if(type === "GENSET")
      {
        setGenFieldsCheck({
          ...genFieldsCheck,
          [e.target.name]:e.target.checked
        });
      }
      else if(type === "ATS")
      {
        setAtsFieldsCheck({
          ...atsFieldsCheck,
          [e.target.name]:e.target.checked
        });
      } 
    }
   
    const styled={
        background: "rgba(0, 0, 0, 0.7)"
       
    }
    const handleClose = () => setOpenModal(false);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height:'600px',
        overflowY:'auto',
        background: 'white',
        padding:"30px 20px",
    };
    const textFieldStyle = {

        maxWidth:'100%',
        margin:'10px',
        background:"#d9d9d9",
        boxShadow:"0 0 2px 0px #a5a5a5",

      };
      const handleDevicePersonalInfo = (e)=> {
        let value = e.target.value;
      
        
        if(type === "GENSET")
        {
          setGenModBusMap({
            ...genModBusMap,
            modelInfo:{
              ...genModBusMap.modelInfo,
              [e.target.name]:value``
            }
          })
         
        }
        else if(type === "ATS")
        {
          setAtsModBusMap({
            ...atsModBusMap,
            [e.target.name]: value
          })       
        } 
      }
    const addDevice = async () => {
   if(!genModBusMap){
     return ;
   
   }
      if (!genModBusMap.name  ){
      
        setNameErr(true)
        return
       
      
      }
      else {
        setNameErr(false)
      }
    
      if (!genModBusMap.type){
      
        setTypeErr(true)
    
   
      }
    
      
      if(type === "GENSET")
      {      
            let flag = false;
            Object.keys(genFieldsCheck).map((key)=>{
              if(genFieldsCheck[key] === true && genModBusMap.registers[key]['addr'] ==="" && genModBusMap.registers[key]['addr'] !==0 || genFieldsCheck[key] === true && genModBusMap.registers[key]['qty'] ==="" && genModBusMap.registers[key]['qty'] !==0)
              {
                notifydanger(key);
                flag = true;
              }
              else if(genFieldsCheck[key] === false)
              {
                delete genModBusMap.registers[key];
              }
            })
            if(!flag)
            {
              let data = genModBusMap;
              const response = await api.post("/api/devices", data, { headers: {"Authorization" : localStorage.getItem('access_token')} });
              setOpenModal(false);  
              if(response.status === 200)
              {
                notifySuccess()
              }
          }
    }
    else if(type === "ATS")
    {
      let flag = false;
          Object.keys(atsFieldsCheck).map((key)=>{
            if(atsFieldsCheck[key] === true && atsModBusMap.registers[key] === "" && atsModBusMap.registers[key] !== 0 )
            {
              notifydanger(key);
              flag = true;
            }else if(atsFieldsCheck[key] === false)
            {
              let key2 = key+"Quantity"
              delete atsModBusMap.registers[key];
              delete atsModBusMap.registers[key2];
            }
          })
          if(!flag)
          {
            let data = atsModBusMap;
          
            const response = await api.post("/api/devices", data, { headers: {"Authorization" : localStorage.getItem('access_token')} });
            setOpenModal(false);
            if(response.status === 200)
            {
              notifySuccess()
            }
        
          }    
      }
    }

    const handleDeviceType = (e) => {
      if (e.target.name==="type"){
        setTypeErr(false)
  
      }
        setGenModBusMap({
          ...genModBusMap,
          [e.target.name]: e.target.value
      });
      setType(e.target.value);
    }
    const handleDeviceName = (e) => {
      setGenModBusMap({
        ...genModBusMap,
        [e.target.name]: e.target.value
    })
  }
const handleFocus=(e)=>{

if (e.target.name==="name"){
  setNameErr(false)
}
if (e.target.name==="type"){

  setTypeErr(false)
}
}
    return (
        <div style={{background:"red"}} >
        <ToastContainer />
            <Modal
            sx={styled}
            
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={OpenModal}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            >
            <Fade  in={OpenModal}>
            <Box 
    
                component="form"
                noValidate
                style={style}
                >
                 
                <LoadingScreen
                loading={loading}
                bgColor='#f1f1f1'
                spinnerColor='#f1f1f1'
                textColor='#f1f1f1'
                logoSrc={logo}
                text='Loading'
                > 

                <p style={{textAlign:"center",marginTop:"-25px",fontWeight:"600",fontSize:"22px"}}>New Device</p>               
                <div>
                <FormControl style={{marginLeft:"9px"}} fullWidth>
                    <InputLabel id="demo-simple-select-label">Device Type</InputLabel>
                    <Select
                 
                    style={{borderRadius:0,background:"#d9d9d9",color:"black"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="type"
                    value={type}
                    label="Device Type"
                    onChange={handleDeviceType}
                    onFocus={handleFocus}
                    >
                    <MenuItem value="GENSET">Generator</MenuItem>
                    <MenuItem value="ATS">ATS</MenuItem>
                    </Select>
                    <span className='err-span-validation' style={{display:typeErr?"block":"none"}}>Select type</span>

                </FormControl>
                </div>
                  <TextField  label="Device Name" name="name"  sx={textFieldStyle}  fullWidth onChange={handleDeviceName} onFocus={handleFocus}/>
                  <span className='err-span-validation' style={{display:nameErr?"block":"none",marginTop:"-4px",marginLeft:"9px"}}>Name is required</span>
                <div >
                    <TextField   label="Make" name="Make"  sx={textFieldStyle}  fullWidth onChange={handleDevicePersonalInfo}/>
                    <TextField  label="Model" name="Model"  sx={textFieldStyle}  fullWidth onChange={handleDevicePersonalInfo}/>
                    <TextField  label="Variant" name="Variant"  sx={textFieldStyle}  fullWidth onChange={handleDevicePersonalInfo}/>
                </div>
              
                <div >
                {
                    type === 'GENSET' &&
                    <ModBusGenForm handleModBusMap={handleModBusMap} handleModBusMapQuantity={handleModBusMapQuantity} existingAsset={existingAsset}  handleRequiredCheck={handleRequiredCheck} />
                }
                {
                    type === 'ATS' &&
                    <ModBusAtsForm handleModBusMap={handleModBusMap} existingAsset={existingAsset} handleRequiredCheck={handleRequiredCheck} />
                }
                </div>
                <div >
                    <Button sx={{background:"#1B1464",borderRadius:0,boxShadow:"0"}}  variant="contained" onClick={addDevice} >Add Device </Button>
                </div>
                </LoadingScreen>
            
            </Box>
         
            </Fade>
        </Modal>
        </div>
    )
}
export default NewDevice
