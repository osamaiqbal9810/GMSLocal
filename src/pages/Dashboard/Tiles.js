import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowDropdown } from 'react-icons/io';
import { getServerEndpoint } from '../../utils/serverEndpoint';

import { useSelector, useDispatch, } from 'react-redux';
import { tilesList } from '../../Slice/tilesSlice';
import ClickAwayListener from '@mui/base/ClickAwayListener';

function Tiles() {
   const [socket, setSocket] =  useState(null);
  const api = axios.create({
    baseURL: getServerEndpoint()
  });
  const dispatch = useDispatch();
  const [devicesStatusCount, setDevicesStatusCount] = useState({});
  useEffect(async () => {
    const response = await api.get("/api/SummaryTiles", {
      headers: { "Authorization": localStorage.getItem('access_token') },

    });
    
    if (response.status == 200) {
      dispatch(tilesList(response.data));
    }

  }, []);
  const [open, setOpen] = useState({
    isOnline: false,
    isOffline: false,
    running: false,
    alert: false
  })
  const navigate = useNavigate();
  const handleOpenOnline = () => {
    setOpen({
      isOnline: !open.isOnline
    })
  }
  const handleOpenOffline = () => {
    setOpen({
      isOffline: !open.isOffline
    })
  }
  const handleRunning = () => {
    setOpen({
      running: !open.running
    })
  }

  const handleOpenAlerts = () => {
    setOpen({
      alert: !open.alert
    })
  }
  const handleChange = (id) => {
    console.log(id);
    navigate('/dashboard/' + id);
  }



  const tilesData = useSelector((state) => state.tilesList.tiles);
  //console.log(tilesData);
  useEffect(()=>{
    setDevicesStatusCount(tilesData);
  },[tilesData]);

  const handleClickAwayAlert = () => {
   setOpen({
    ...open,
      alert:false,
    })
  };
  const handleClickAwayOnline = () => {
    setOpen({
     ...open,
       isOnline:false,
     })
   };

   const handleClickAwayOffline = () => {
    setOpen({
     ...open,
       isOffline:false,
     })
   };

   const handleClickAwayRunning= () => {
    setOpen({
     ...open,
       running:false,
     })
   };
   
  return (
    <div className='tiles' style={{ display: "flex", justifyContent: "space-between" }}>
            <ClickAwayListener onClickAway={handleClickAwayOnline}>

      <div style={{ background: "#50bb50", position: "relative", zIndex: "999" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p >Online</p>
          <IoMdArrowDropdown style={{ transform: open.isOnline ? "rotate(180deg)" : "rotate(0deg)", color: open.isOnline ? "black" : "white" }} onClick={handleOpenOnline} fontSize="28px" />
        </div>

        <p>{devicesStatusCount?.online?.count}</p>
        <p className='drop-down' style={{ display: open.isOnline ? "block" : "none" }}>
          <ul>
          {
            devicesStatusCount?.online?.onlineRec?.map((online, ind) => {
              return(
                <li key={ind} onClick={() =>handleChange(online.assetId)}>{online.assetName}</li>
              )
            })
          }   
        </ul>
        </p>

      </div>
      </ClickAwayListener>

      <ClickAwayListener onClickAway={handleClickAwayOffline}>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p >Offline</p>
          <IoMdArrowDropdown style={{ transform: open.isOffline ? "rotate(180deg)" : "rotate(0deg)", color: open.isOffline ? "black" : "white" }} onClick={handleOpenOffline} fontSize="28px" />
        </div>
        <p>{devicesStatusCount?.offline?.count}</p>
        <p className='drop-down' style={{ display: open.isOffline ? "block" : "none" }}>
          <ul>
          {
            devicesStatusCount?.offline?.offlineRec?.map((offline, ind) => {
              return(
                <li key={ind} onClick={() =>handleChange(offline.assetId)}>{offline.assetName}</li>
              )
            })
          }   
        </ul>
        </p>
      </div>
      </ClickAwayListener>

      <ClickAwayListener onClickAway={handleClickAwayRunning}>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p >Running</p>
          <IoMdArrowDropdown style={{ transform: open.running ? "rotate(180deg)" : "rotate(0deg)", color: open.running ? "black" : "white" }} onClick={handleRunning} fontSize="28px" />
        </div>

        <p>{devicesStatusCount?.running?.count}</p>
        <p className='drop-down' style={{ display: open.running ? "block" : "none" }}>
          <ul>
            {
              devicesStatusCount?.running?.runRec?.map((running, ind) => {
                return(
                  <li key={ind} onClick={() =>handleChange(running.assetId)}>{running.assetName}</li>
                )
              })
            }   
          </ul>
        </p>
      </div>
      </ClickAwayListener>

      <ClickAwayListener onClickAway={handleClickAwayAlert}>
      <div style={{ position: "relative" }} >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
          <p >Alerts</p>
          <IoMdArrowDropdown style={{ transform: open.alert ? "rotate(180deg)" : "rotate(0deg)", color: open.alert ? "black" : "white" }} onClick={handleOpenAlerts}  fontSize="28px" />
        </div>

        <p>{devicesStatusCount?.alert?.count}</p>
        <p className='drop-down' style={{ display: open.alert ? "block" : "none" }} >
          <ul>
          {
            devicesStatusCount?.alert?.alertRec?.map((alert, ind) => {
              return(
                <li key={ind} onClick={() =>handleChange(alert.assetId)}>{alert.assetName}</li>
              )
            })
          }   
        </ul>
        </p>

      </div>
      </ClickAwayListener>

    </div>
  )

}

export default Tiles