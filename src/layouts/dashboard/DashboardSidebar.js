import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {useDispatch,useSelector } from 'react-redux';
import {userGroup} from "../../Slice/logInSlice";
// material
import { styled } from '@mui/material/styles';
import { Box,  Drawer} from '@mui/material';
// mocks_
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import TechTrakingLogo from '../../components/TechTrakingLogo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import sidebarConfig from './SidebarConfig';
import SidebarConfiAdManager from './SidebarConfiAdManager';
import SidebarConfiAdInspecter from './SidebarConfiAdInspecter';

import { getServerEndpoint } from '../../utils/serverEndpoint';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../../components/CompoStyles.css"

const api = axios.create({
  baseURL: getServerEndpoint()
});

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12]
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  let navigate = useNavigate();

  const dispatch=useDispatch()
  

  useEffect(async () => {
    let axiosConfig = {
      headers: { Authorization: localStorage.getItem('access_token') }
    };
    const userObjs=localStorage.getItem("loggedInUser");
    const response = await api
      .get('/api/userGroup', axiosConfig)
      .then((res) => {
        if (res.status == 200) {
           dispatch(userGroup({data:res.data,useRole:userObjs}));
        }
      })
      .catch((err) => {
        console.log(err, 'errors');
      });
  }, []);

  let userRole =useSelector((state)=> state.userGroup.userGroup[0]);

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);
if(userRole == undefined)
{
  return (<div>Something went wrong, Please logout and logIn again</div>)
}

  const renderContent = (
    <Scrollbar
      style={{ borderRight: '1px solid black', backgroundColor: 'white' }}
      sx={{
        height: 1,

        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' }
      }}
    >
      
    <Box sx={{ px: 1.5, py: 1.3, display: 'inline-flex', borderBottom: '1px solid white',backgroundColor:'#1B1464' }}>
      <TechTrakingLogo />
    </Box>

        {userRole?.group_id == 'admin' ? <NavSection  navConfig={sidebarConfig} /> : ''}
        {userRole?.group_id == 'inspector' ? <NavSection navConfig={SidebarConfiAdInspecter} /> : ''}
        {userRole?.group_id == 'manager' ? <NavSection navConfig={SidebarConfiAdManager} /> : ''}
  
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed'
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
        

}
