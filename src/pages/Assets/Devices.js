import { Container } from '@mui/material';
import React, { Suspense } from 'react';

import AssetsData from './AssetsData';

function Devices() {
  return (
    <Container maxWidth="xl">
      <AssetsData/>
    </Container>
  )
}

export default Devices
