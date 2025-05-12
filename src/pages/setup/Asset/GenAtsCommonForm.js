import React from 'react'
import TextField from '@mui/material/TextField';
function GenAtsCommonForm({existingAsset, handleDevicePersonalInfo}) {
     const textFieldStyle = {
        width:'70vw',
        maxWidth:'100%',
        margin:'10px'
    };
  const flexStyle = {
    margin:'5px'
  }
    return (
         existingAsset !== '' &&
        <div>
            <div style={{display:'flex', justifyContent:'flex-start'}}>
                <TextField label="Device Name" name="deviceName"  fullWidth sx={textFieldStyle} defaultValue={existingAsset.attributes.deviceName || "" }  onChange={handleDevicePersonalInfo}/>
            </div> 
            <div style={{display:'flex', justifyContent:'flex-start'}}>
                <TextField  label="IP Address" name="deviceIP"  fullWidth sx={textFieldStyle} defaultValue={existingAsset.attributes ? existingAsset.attributes.deviceIP : ""} onChange={handleDevicePersonalInfo}/> 
                <TextField  label="Port" name="devicePort" fullWidth  sx={textFieldStyle} defaultValue={existingAsset.attributes ? existingAsset.attributes.devicePort : ""} onChange={handleDevicePersonalInfo}/>
            </div> 
            <div style={{display:'flex', justifyContent:'flex-start'}}>
                <TextField  label="Slave Address" name="deviceSlaveAddress" sx={textFieldStyle} defaultValue={existingAsset.attributes ? existingAsset.attributes.deviceSlaveAddress : ""}  fullWidth onChange={handleDevicePersonalInfo}/>
                <TextField  label="Function Code" name="functionCode" sx={textFieldStyle} defaultValue={existingAsset.attributes ? existingAsset.attributes.functionCode : ""}  fullWidth onChange={handleDevicePersonalInfo}/>
            </div>  
            <div style={{display:'block', justifyContent:'flex-start'}}>
                <TextField  label="Company" name="deviceCompany" sx={flexStyle}  fullWidth defaultValue={existingAsset.attributes ? existingAsset.attributes.deviceCompany : ""} onChange={handleDevicePersonalInfo}/>
                <TextField  label="Make" name="deviceMake" sx={flexStyle}  fullWidth defaultValue={existingAsset.attributes ? existingAsset.attributes.deviceMake : ""} onChange={handleDevicePersonalInfo}/>
                <TextField  label="Model" name="deviceModel" sx={flexStyle}  fullWidth defaultValue={existingAsset.attributes ? existingAsset.attributes.deviceModel : ""} onChange={handleDevicePersonalInfo}/>
            </div>
        </div>
    )
}

export default GenAtsCommonForm
