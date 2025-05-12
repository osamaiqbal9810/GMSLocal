import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import AccountPopover from './AccountPopover';
import { useState } from 'react';
import Logo from '../../components/Logo';
import '../style.css';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: '10px 10px white',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  height:"100px",
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar, dashboardText }) {
  const scollling = window.scrollY;
  const [style, setStyles] = useState(false);

  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      setStyles(true);
    } else {
      setStyles(false);
    }
  }

  return (
    <RootStyle sx={{backgroundColor: "#1B1464"}} className="header" style={{height:"116px"}}>
      <ToolbarStyle style={{marginTop:"10px"}}>
        <IconButton
          onClick={onOpenSidebar}
          sx={{ mr: 1, color: 'white', display: { lg: 'none' } }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
       <Box sx={{display:'flex', alignItems:'center'}}>
        <Logo />
        <h1 className="logo-text" style={{marginLeft:"10px"}}>Generator Monitoring System</h1>
       </Box>
        <Box sx={{ flexGrow: 1 }} />
        
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
