import * as React from 'react';
import {useEffect,useState} from "react";
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DeleteSharp, Edit } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import {getServerEndpoint} from '../../../utils/serverEndpoint';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import BasicTabs from './TabsLayout.js';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import "../../../layouts/style.css"
import { PopUpModal } from '../../../components/Root';

export default function MinorLocationAssets({minorLocationAssets,loadFunction,load,getMinorLocationAsset}) {
 
  const [open, setOpen] = React.useState(false);
  const [assetVal, setAssetVal] = React.useState({});
  const [parentId, setParentId] = React.useState('');
  const [showModal,setShowModal] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [parentAssetId, setParentAssetId] = React.useState();
  const [locationId, setLocationId] = React.useState({});
  const [opens, setOpens] = React.useState(false);
  const [err,setErr]=React.useState(false);
  const [errTiming,setErrTiming]=useState(false);

  const handleCloses = () => {
   setOpens(false);
  }

  
  const api = axios.create({
    baseURL: getServerEndpoint(),
   });

  const textFieldStyle = {
    width:'60vw',
    maxWidth:'50%',
    margin:'10px'
  };
  const styled={
    background: "rgba(0, 0, 0, 0.7)"
  }

  const updateAsset = async () => {
    if (errTiming){
      setErrTiming(false)
  }
      if (!assetVal.name){ 
        setErr(true)
        return false
      }
      let val = assetVal._id;
      const response =  await api.put('/api/asset/'+val, assetVal,{ headers: {"Authorization" : localStorage.getItem('access_token')}}); 
      if(response.status === 200)
      {
        setOpen(false);
        getMinorLocationAsset(response.data.parentAsset);
      }
    }
    const handleClick = (val) => {
      loadFunction(val);
    }

    const handleEdit = async (val) => {
      const response =  await api.get('/api/asset/'+val,{ 
        headers: {"Authorization" : localStorage.getItem('access_token')},
        params:{id:val} 
      }); 
     
      if(response.status === 200)
      {
        setAssetVal(response.data);
        setOpen(true);
      }
    }
    const handleDelete = async () => {
      setOpens(false);
      const response =  await api.delete('/api/asset/'+locationId,{ 
        headers: {"Authorization" : localStorage.getItem('access_token')},
        params:{id:locationId} 
      });
      if(response.status === 200)
      {
       getMinorLocationAsset(parentAssetId);
      }
    }

    const handleClickOpen = async (id,parentLocId) => {
      await setLocationId(id)
      await setParentAssetId(parentLocId)
      setOpens(true);
    };

    const handleAssetEdit = (e) => {
      setAssetVal({...assetVal,
        name: e.target.value,
        unitId: e.target.value
      });
    }

    const handleAddLocation = (id) => {
      setParentId(id);
      setShowModal(true);
    }
    const modalStatus = (val)=>{
      setShowModal(val);
    }

    const handleFocus =()=>{
      setErr(false)
  }   
    useEffect(()=>{

      setTimeout(() => {
        setErrTiming(true)
    
      }, 8000);
    
      },[errTiming])
  return (
    <div>
    <TableContainer component={Paper} style={{marginTop:'20px', boxShadow: "0px 2px 5px grey"}}>
      <Table  aria-label="simple table">
        <TableHead style={{background:"#1B1464"}}>
          <TableRow>
            <TableCell sx={{color:"white"}} align="center">Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        
        {
            minorLocationAssets.map((row,index) =>  (
           
            row !== undefined &&
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
             
            >
              <div style={{width:"100%",display:"flex",justifyContent:"space-between"}}>
              <TableCell component="th" scope="row" style={{flex: 9}}
               onClick={() => handleClick(row._id)}
              >
                {row.name}
              </TableCell>
              <TableCell component="th" scope="row" 
                style={{display:"flex",justifyContent:"space-between",alignItems:"center", marginLeft:"1px" }}
                onClick={() => handleAddLocation(row._id)}  
              >
              <AddLocationIcon  sx={{color:"#5856d6"}}/>
            </TableCell>
              <TableCell component="th" scope="row" 
              style={{display:"flex",justifyContent:"space-between",alignItems:"center", marginLeft:"1px",marginRight:"1px" }}
              onClick={() => handleEdit(row._id)}  
            >
              <Edit  sx={{color:"green"}}/>
            </TableCell>
            <TableCell component="th" scope="row" 
              style={{display:"flex",justifyContent:"space-between",alignItems:"center", marginLeft:"1px" }}
              
            >
              <DeleteSharp onClick={() =>handleClickOpen(row._id, row.parentAsset)}  sx={{color:"#d11a2a"}}/>
            </TableCell>
              </div>
            </TableRow>
            ))
            
        }
        </TableBody>
      </Table>
    </TableContainer>
   
    <Dialog
      open={opens}
      onClose={handleCloses}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure . You want to delete?"}
        </DialogTitle>
      <DialogActions>
        <Button className='modalButtons' sx={{background:"#1B1464",borderRadius:"0",color:"white"}} onClick={handleCloses}>Disagree</Button>
        <Button className='modalButtons'   sx={{background:"#1B1464",borderRadius:"0",color:"white"}} onClick={handleDelete} >
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
    <PopUpModal>
      <Box 
        component="form"
        noValidate
      >  
       
        <BasicTabs name="Asset" parentID= {parentId} load={getMinorLocationAsset} modalStatus={modalStatus}/>
      </Box>
      </PopUpModal>
    </Fade>
    </Modal> 
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <PopUpModal>
        <Box >
        <TextField onFocus={handleFocus} label="Area" name="Area"  sx={textFieldStyle} value={assetVal.name} fullWidth onChange={handleAssetEdit} />
        <Button  style={{borderRadius: "0px", marginTop:'10px', boxShadow:'none',background:"#1B1464"}} variant="contained" onClick={updateAsset} >Update</Button>
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
    </div>
  );
}
