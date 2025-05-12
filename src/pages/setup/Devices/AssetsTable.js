import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PopUpModal } from '../../../components/Root';
import '../Asset/assettables.css';
import { getServerEndpoint } from '../../../utils/serverEndpoint';

function AssetsTable() {
  const api = axios.create({
    baseURL: getServerEndpoint()
  });
  const [openSuppDevice, setOpenSuppDevice] = React.useState(false);
  const handleCloseDevice = () => setOpenSuppDevice(false);

  const [addDevice, setAddDevices] = useState([]);
  const [deviceId, setDeviceId] = useState();

  const [deviceValue, setDeviceValue] = useState({
    name: '',
    modelInfo: {
      Make: '',
      Model: ''
    }
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    bgcolor: 'background.paper',
    p: 6,
  
  };
  const textFieldStyle = {
    width: '70vw',
    maxWidth: '100%',
    margin: '10px',
   
  };

  async function getDevices() {
    const response = await api.get('/api/devices', {
      headers: { Authorization: localStorage.getItem('access_token') }
    });
    if (response.status === 200) {
      setAddDevices(response.data.assetsList);
    }
  }
  useEffect(() => {
    getDevices();
  }, []);

  const handleChangeDevice = (e) => {
    const value = e.target.value;

    setDeviceValue({
      ...deviceValue,
      [e.target.name]: value
    });
  };

  const handleChangeDeviceModelInfo = (e) => {
    const value = e.target.value;

    setDeviceValue({
      ...deviceValue,
      modelInfo: {
        ...deviceValue.modelInfo,
        [e.target.name]: value
      }
    });
  };

  const handlClickEdit = async (val) => {
    const response = await api.get('/api/devices/' + val, {
      headers: { Authorization: localStorage.getItem('access_token') },
      params: { id: val }
    });

    if (response.status === 200) {
      setDeviceId(val);
      setDeviceValue(response.data);
      setOpenSuppDevice(true);
    }
  };

  const notifyUpdate = () => toast.success('Device Updated Successfully');

  const updateDevice = async () => {
    const response = await api.put('/api/devices/' + deviceId, deviceValue, {
      headers: { Authorization: localStorage.getItem('access_token') },
      params: { id: deviceId }
    });

    if (response.status === 200) {
      setOpenSuppDevice(false);
      notifyUpdate();
    }
  };

  const handlClickDelete = async (val) => {
    const response = await api.delete('/api/devices/' + val, {
      headers: { Authorization: localStorage.getItem('access_token') },
      params: { id: val }
    });
    if (response.status === 200) {
      setOpenSuppDevice(false);
      notifyUpdate();
    }
  };

  return (
    <div>
      <div>
        <Modal
          open={openSuppDevice}
          onClose={handleCloseDevice}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <PopUpModal>
            <Box >
              <TextField
                label="Name"
                name="name"
                sx={textFieldStyle}
                value={deviceValue.name}
                fullWidth
                onChange={handleChangeDevice}
              />
              <TextField
                label="Make"
                name="Make"
                sx={textFieldStyle}
                value={deviceValue.modelInfo.Make}
                fullWidth
                onChange={handleChangeDeviceModelInfo}
              />

              <TextField
                label="Model"
                name="Model"
                sx={textFieldStyle}
                value={deviceValue.modelInfo.Model}
                fullWidth
                onChange={handleChangeDeviceModelInfo}
              />
              <Button variant="contained" onClick={updateDevice}>
                Update
              </Button>
            </Box>
          </PopUpModal>
        </Modal>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: '0 0 12px 3px #c1bdbd', maxWidth: '1200px' ,margin:"30px auto"}}
        >
          <Table  aria-label="simple table">
            <TableHead sx={{ background: '#1B1464', border: 'none' }}>
              <TableRow>
                <TableCell sx={{color:"white"}} align="center">Name</TableCell>
                <TableCell sx={{color:"white"}} align="center">Make - Model</TableCell>
                <TableCell  sx={{color:"white"}} align="center">Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addDevice.map((device,ind) => (
                <TableRow sx={{ border: '1.1px solid black' }} key={ind}>
                  <TableCell align="center">{device.name}</TableCell>

                  <TableCell align="center">
                    {device.modelInfo.Make} {device.modelInfo.Model}
                  </TableCell>
                  <TableCell align="center">{device.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default AssetsTable;
