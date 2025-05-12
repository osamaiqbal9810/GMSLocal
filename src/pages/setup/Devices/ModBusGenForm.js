import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import React, { useEffect,useState } from 'react';
import axios from 'axios';
import {getServerEndpoint} from '../../../utils/serverEndpoint';

function ModBusGenForm({handleModBusMap,existingAsset,handleRequiredCheck, assetSettings,handleModBusMapQuantity }) {
  const api = axios.create({
    baseURL: getServerEndpoint(),
   });

   const [params,setParams]=useState([])

      const textFieldStyle = {
        width:'60vw',
        maxWidth:'50%',
        margin:'10px',

     
   
      };
      useEffect( async()=>{
        const response =  await api.get("/api/supportedParams",{ 
          headers: {"Authorization" : localStorage.getItem('access_token')},
       
        }); 
        if(response.status === 200)
        {
          setParams(response.data.params)
        }
      },[]);
    return (
      <div >
        <div >
        {
        existingAsset.length === 0 &&
            <div >
              {params.map((val,ind)=>{
                
             if (val.type==="GENSET") {
               return(
                <div style={{display:'flex', justifyContent:'flex-start'}} key={ind}>
                 <TextField  label={val.name} name={val.name}  fullWidth  sx={textFieldStyle}  onChange={handleModBusMap}/>
                  <TextField  label="Quantity" name={val.name}  fullWidth  sx={textFieldStyle} onChange={handleModBusMapQuantity}/>
                   <FormGroup>
                   <FormControlLabel control={<Checkbox defaultChecked />} name={val} label="Required" onChange={handleRequiredCheck}  />
                    </FormGroup>
               </div>
               )
             }
              })}
            </div>
        }
        </div>
        <div>
          {
          existingAsset !== undefined &&
              <div >
                {Object.keys(existingAsset).map((val,ind)=>{
                  if(val !=="serial")
                  {
                    return (
                    <div style={{display:'flex', justifyContent:'flex-start'}} key={ind}>
                      <TextField  label={val} name={val}  fullWidth  sx={textFieldStyle} value={existingAsset[val]} onChange={handleModBusMap}/>
                    </div>
                    )
                  }
                })
              }
              { existingAsset.serial !== undefined &&
                Object.keys(existingAsset.serial).map((val,ind)=>{
                    return (
                    <div style={{display:'flex', justifyContent:'flex-start'}} key={ind}>
                      <TextField  label={val} name={val}  fullWidth  sx={textFieldStyle} value={existingAsset.serial[val]} onChange={assetSettings}/>
                    </div>
                    )
                })}
              </div>
          }
        </div>  
        </div>
    )
}

export default ModBusGenForm;
