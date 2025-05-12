import React, { useEffect,useState } from 'react';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import {getServerEndpoint} from '../../../utils/serverEndpoint';

function ModBusAtsForm({handleModBusMap,existingAsset,handleRequiredCheck}) {
      const textFieldStyle = {
        width:'60vw',
        maxWidth:'100%',
        margin:'10px'
      };
      const api = axios.create({
        baseURL: getServerEndpoint(),
       });
    
       const [params,setParams]=useState([])
    
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
      <div>
      {
      existingAsset.length === 0 &&
          <div >
            {params.map((val)=>{

           if (val.type==="ATS") {
             return(
              <div style={{display:'flex', justifyContent:'flex-start'}}>
               <TextField  label={val.name} name={val.name}  fullWidth  sx={textFieldStyle} onChange={handleModBusMap}/>
                <TextField  label="Quantity" name={val.name}  fullWidth  sx={textFieldStyle} onChange={handleModBusMap}/>
                 <FormGroup>
                 <FormControlLabel control={<Checkbox defaultChecked />} name={val.name} label="Required" onChange={handleRequiredCheck}  />
                  </FormGroup>
             </div>
             )
           }
            })}
          </div>
      }
      {
        existingAsset !== undefined &&
            <div >
              {Object.keys(existingAsset).map((val,ind)=>{
                return (
                <div style={{display:'flex', justifyContent:'flex-start'}} key={ind}>
                 <TextField  label={val} name={val}  fullWidth  sx={textFieldStyle} value={existingAsset[val]} onChange={handleModBusMap}/>
               </div>
                )
              })}
            </div>
        }
        </div>
    )
}

export default ModBusAtsForm;
