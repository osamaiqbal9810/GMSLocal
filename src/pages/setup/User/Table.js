import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { MdDelete } from 'react-icons/md';
import { Button } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { getServerEndpoint } from '../../../utils/serverEndpoint';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { edit } from '../../../Slice/userSlice';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useSelector } from 'react-redux';

export default function Table(props) {
  const Root = styled('div')`
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid #ddd;
    text-align: center;
    padding: 8px;
  }

  th {
    background-color: #ddd;
  }
`;


  const [usersList, setUsersList] = useState([]);
  const [opens, setOpens] = React.useState(false);
  const [rowId, setRowId] = React.useState("") 
  const api = axios.create({
    baseURL: getServerEndpoint()

  
  });
  const dispatch = useDispatch();

    async function getUsers() {
      const userResponse = await api.get('/api/users', {
        headers: { Authorization: localStorage.getItem('access_token') },
        user: localStorage.getItem('loggedInUser')
      });
      if (userResponse.status == 200) ;
      {
        setUsersList(userResponse.data);
      }
    }
    useEffect(() => {
      getUsers();
    }, []);

  async function getUser(id) {
    const userResponse = await api.get('/api/users/' + id, {
      headers: { Authorization: localStorage.getItem('access_token') },
      params: { id: id }
    });
    if (userResponse.status == 200) {
      dispatch(edit(userResponse.data));
    }
  }

  async function DeleteUser() {
    const userResponse = await api.delete('/api/users/' + rowId, {
      headers: { Authorization: localStorage.getItem('access_token') },
      params: { id: rowId }
    });
    if (userResponse.status == 200) {
      props.loadUser();
    }
    setOpens(false);
  }

  const handleClick = () => {
    props.setUserComp(true);
  };

  const handleEdit = (id) => {
    props.setUserComp(false);
    getUser(id);
  };

const handleCloses = () => {
  setRowId("")
    setOpens(false);
   }
   const handleClickOpen = (id) => {
    setRowId(id)
    setOpens(true);
   };

  const userRoles= useSelector((state)=> state.userGroup.userGroup[0]);
  const allRoles= useSelector((state)=> state.userGroup.allRoles[0]);
  return (
    <Root sx={{ marginLeft: '20px', width: '100%', marginTop: '9px' ,overflowX:"auto" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <h3>Staff List</h3>

        <PersonAddAltIcon sx={{ color: '#1B1464', cursor: 'pointer' }} onClick={handleClick} />
      </div>
      <table  aria-label="custom pagination table" >
        <thead>
          <tr>
            <th style={{ background: '#1B1464', color: 'white' }}>Name</th>
            <th style={{ background: '#1B1464', color: 'white' }}>Email</th>
            <th style={{ background: '#1B1464', color: 'white' }}>Role</th>
            <th style={{ background: '#1B1464', color: 'white' }}>Edit</th>
            <th style={{ background: '#1B1464', color: 'white' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {props?.usersList?.map((row, index) => {
            let userRole = allRoles?.find(({_id}) => _id == row.userGroup);
           return(
            (userRoles?.isAdmin == false &&  row.userGroup==userRoles._id) ||  userRoles?.isAdmin == true ?
            <tr key={row._id}>
              <td>{row.name}</td>
              <td align="center">{row.email}</td>
              <td align="center">{userRole?.name}</td>
              <td align="center">
                <Button
                  sx={{ color: '#1B1464', cursor: 'pointer' }}
                  onClick={() => handleEdit(row._id)}
                >
                  Edit
                </Button>
              </td>
              <td >
                
                <MdDelete
                style={{display:userRoles?.isAdmin==true && row.isAdmin== true || userRoles?.isAdmin==false && row.isAdmin== true?"none":"block"}}
                  onClick={() => handleClickOpen(row._id)}
                  fontSize="20px"
                  color="red"
                  cursor="pointer"
                />
              </td>
            </tr>
            : null
           )})}
        </tbody>
      </table>
      <Dialog
                open={opens}
                onClose={handleCloses}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Are you sure . You want to delete?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                  
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button className='modalButtons' sx={{background:"#1B1464",borderRadius:"0",color:"white"}} onClick={handleCloses}>Disagree</Button>
                  <Button className='modalButtons'   sx={{background:"#1B1464",borderRadius:"0",color:"white"}} onClick={() => DeleteUser()} >
                    Agree
                  </Button>
                </DialogActions>
              </Dialog>
    </Root>
  );
}
