import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box } from '@mui/material';
import logo from '../Images/TTLogo_new.png';

// ----------------------------------------------------------------------

TechTrakingLogo.propTypes = {
  sx: PropTypes.object
};

export default function TechTrakingLogo({ sx }) {
  return (
    <RouterLink to="/">
      <img src={logo} alt="logo" height={85} width={350} style={{padding:"10px 0px", marginTop:"10px"}}  />
    </RouterLink>
  );
}
