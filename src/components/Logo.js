import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box } from '@mui/material';
import logo from '../Images/logo.png';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return (
    <RouterLink to="/">
      <img src={logo} alt="logo" style={{marginTop:"1px"}} width={90} height={67} />
    </RouterLink>
  );
}
