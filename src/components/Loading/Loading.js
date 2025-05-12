import React from 'react';
import "./loading.css"
import logo from '../../Images/logo.png';
function Loading() {
  return (
    <div>
      <div id="loading-wrapper" style={{background:"#1B1464"}}>
        <div id="loading-text">
          <img src={logo} alt="logo" />
        
          <div className="loading-dots" style={{marginTop:'15px',color:'white',textAlign:'center'}}>Loading</div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
