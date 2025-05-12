// material
import { Container} from '@mui/material';
// components
import Page from '../../components/Page';
import { useParams } from 'react-router'; 
import React from 'react';



// ----------------------------------------------------------------------
import SpeedoMeter from './SpeedoMeter';

export default function Dials() {
  let { id } = useParams();
  
  return (
    <Container maxWidth="xl">
      <Page title="Dashboard">
        <SpeedoMeter id={id}/>
      </Page>
    </Container>
  );
}
