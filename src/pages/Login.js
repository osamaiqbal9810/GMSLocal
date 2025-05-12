import { Container, Link,  Typography } from '@mui/material';
// material
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
// components
import Page from '../components/Page';
import { LoginForm } from '../sections/authentication/login';
import logo from "../Images/logo.png"
import "../layouts/style.css"

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
 
  height:"100vh",
  alignItems:"center",
  display:"flex",
 
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));


const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 780,
  margin: 'auto',
  display: 'flex',

  minHeight: '43vh',
  flexDirection: 'column',
  justifyContent: 'center',
  
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <RootStyle className="loginBackground"  title="Login | GMS">
      <Container sx={{boxShadow: "0 0  3px rgb(141 141 141)",background:"white"}} maxWidth="sm">
        <div style={{display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center"}}>
      <h2 style={{textAlign:"center",marginTop:"20px"}}>Genset Portal</h2>
      <img style={{width:"130px"}} src={logo}/>
      </div>
        <ContentStyle>
          <LoginForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
