import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import BasicTabs from './TabsLayout.js';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import {getServerEndpoint} from '../../../utils/serverEndpoint';
import Box from '@mui/material/Box';
import {PopUpModal} from "../../../components/Root"


function AddLocationButton(props) {

  const [show, setShow] = useState(false);
  const change = () => {
    setShow(!show);
  }

   const styled={
    background: "rgba(0, 0, 0, 0.7)"
  } 
   const display = (value)=>{
        setShow(value);
    }
  const [companyAsset, setCompanyAsset] = React.useState({});
  useEffect(() => {
    props.display(show);
  }, [change]);


  const api = axios.create({
    baseURL: getServerEndpoint(),
   });

  async function getAsset (){
    const response =  await api.get('/api/asset/location/railRoad',{ headers: {"Authorization" : localStorage.getItem('access_token')} });
    if(response.status === 200)
    {
     loadData(response.data);
    }
   }
   const loadData = (locationSetup)=> {
     console.log()
      let company = locationSetup.assetTypes.find(({parentAssetType}) => parentAssetType  === null);
      let companyAsset; 
      if (company) 
      {
        companyAsset = locationSetup.assets.find(({assetType}) => assetType === company.assetType);
      }
        
      setCompanyAsset(companyAsset);
    
    }
    useEffect(()=>{
      getAsset();
    },[]);
    const modalStatus = (val)=>{
      setShow(val);
    }
  return (
    <div style={{width:'100%', height:'50px'}}>
      <Button sx={{borderRadius: "0",marginTop: "10px", boxShadow:"none",width:"100%",height:"48px",marginTop:"0px",background:"#1B1464"}} onClick={change} variant="contained" >Add City</Button> 
      <Modal
        sx={styled}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={show}
        onClose={()=>display(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        >
        <Fade in={show}>
        <PopUpModal>
          <Box
            component="form"
            noValidate
          >   
            <BasicTabs name="City" parentID= {companyAsset._id} loadFunc={props.loadFunc} modalStatus={modalStatus}/>
          </Box>
          </PopUpModal>
        </Fade>
        </Modal>  
    </div>
  )
}

export default AddLocationButton