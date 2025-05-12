import { Navigate, useRoutes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import Login from './pages/Login';
import './main.css';
import DashboardApp from './pages/Assets/Dials';
import Home from './pages/Dashboard/Home';
import Setup from './pages/setup/User/Index';
import Devices from './pages/Assets/Devices';
import RawData from './pages/Assets/RawData';
export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let location = useLocation();
  const checkUserToken = () => {
    const userToken = localStorage.getItem('access_token');
    if (!userToken || userToken === 'undefined') {
      setIsLoggedIn(false);
    }
    setIsLoggedIn(true);
  }

  useEffect((location) => {
    checkUserToken();
  }, [checkUserToken]);
  return useRoutes([
    isLoggedIn && {
      path: '/dashboard',
      element: <DashboardLayout title="Dashboard" />,
      children: [
        {
          path: 'home',
          element: (
              <Home title="Home" />
          ),
        },
        {
          path: ':id',
          element: (
              <DashboardApp />
          )
        },
        {
          path: 'app',
          element: (
              <DashboardApp />
          )
        },
        {
          path: 'asset',
          element: (
              <Devices />
          )
        },
        {
          path: 'setup',
          element: (
              <Setup />
          )
        },
        /* hidden route to view raw data from generator without interpretation*/
        // {
        //   path: 'raw-data',
        //   element: (
        //    <RawData />
        //   )
        // }
      ]
    },
    !isLoggedIn && {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Login /> },
        { path: 'login', element: <Login /> },
        { path: '*', element: <Login /> }
      ]
    },
    { path: '*', element: <Login /> }
  ]);

}
