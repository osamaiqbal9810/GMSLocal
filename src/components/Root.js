import { styled } from '@mui/material/styles';

export  const PopUpModal = styled('div')(({ theme }) => ({

  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50vw',
  background: 'white',
  border: '2px solid #000',
  boxShadow: "24",
  padding:"40px",
  [theme.breakpoints.down('md')]: {
    padding:"24px ",
    width: '85vw',

  },

}
));

export  const PopUpModalAssignDevice = styled('div')(({ theme }) => ({

  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50vw',
  background: 'white',
  border: '2px solid #000',
  boxShadow: "24",
  padding:"40px",

  [theme.breakpoints.down('md')]: {
    padding:"18px",
    width: '85vw',
  
  },

}
));

export  const PopUpModalAssignNewDevice = styled('div')(({ theme }) => ({

  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60vw',
  background: 'white',
  border: '2px solid #000',
  boxShadow: "24",
  padding:"40px",
  overflowY:"scroll",

  [theme.breakpoints.down('md')]: {
    padding:"18px",
    width: '90vw',
    paddingTop:"30px",
  },

}
));


