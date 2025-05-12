import React, { useRef, useState, useEffect  } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import './setup.css';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { getServerEndpoint } from '../../../utils/serverEndpoint';
import axios from 'axios';
import SetupFormEdit from './SetupFormEdit';
import './setup.css';
import "./setupOverride.css";
import { AiOutlineExclamationCircle } from 'react-icons/ai';


function SetupForm(props) {



  
  //styling

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };
  //styling end
  const api = axios.create({
    baseURL: getServerEndpoint()
  });

  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [admin, setAdmin] = useState({});
  const [errTiming,setErrTiming]=useState(false);
  const [alertEmailErr,setAlertEmailErr]=useState(false)
  useEffect(() => {
    async function getRoles() {
      const response = await api.get('/api/userGroup', {
        
        headers: { Authorization: localStorage.getItem('access_token') }
      });
      const locationResp = await api.get('/api/asset', {
        headers: { Authorization: localStorage.getItem('access_token') }
      });
      const userResponse = await api.get('/api/users', {
        headers: { Authorization: localStorage.getItem('access_token') },
        user: localStorage.getItem('loggedInUser')
      });
      if (userResponse.status == 200) {
        let admin = userResponse.data.find(({group_id}) => group_id == 'admin');
        setAdmin(admin);
        setUsersList(userResponse);
      }
      if (response.status == 200) {
        setRoles(response.data);
      }
      if (locationResp.status == 200) {
        setLocations(locationResp.data.assetsList);
      }
    }
    getRoles();
  }, []);

  
    
    
  const notify = () => toast.success('User successfully created');
  const notifydanger = () => toast.warning('Please Fill out this form completely');

  const handleChangeAlert = (e) => {
    setValues({
      ...values,
      alerts:{
        ...values.alerts,
        [e.target.name]: e.target.checked
      }
    });
  };

    const [values, setValues] = useState({
        name: "",
        email: "",
        genericEmail: "",
        password: "",
        alerts:{
          sms:false,
          email:false
        },
        confirmpassword: "",
        userGroup: "",
        assignedLocation: "",
        mobile: "",
        phone: ""
    })

  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [confirmpasswordErr, setConfirmpasswordErr] = useState(false);
  const [assignedLocationErr, setAssignedLocationErr] = useState(false);
  const [roleErr, setRoleErr] = useState(false);

  const [emailRegex, setEmailRegex] = useState('');
  const [passRegexs, setPassRegexs] = useState('');
 
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.name == 'assignedLocation') {
      setAssignedLocationErr(false);
    }
    if (e.target.name == 'userGroup') {
      setRoleErr(false);
    }
    
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => { 
    if (errTiming){
      setErrTiming(false)

    }
    let emailRegex = new RegExp(
      "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );

    if (values.confirmpassword && values.password != values.confirmpassword) {
      setPassRegexs('Password & confirm password must match');
      return

    } else {
      setPassRegexs('');
    }

    if (values.email && !emailRegex.test(values.email)) {
      setEmailRegex('Please enter a valid email');
      return
    } else {
      setEmailRegex('');
    }
    if (!values.name ) {
      setNameErr(true);
      return
    
    } else  {
      setNameErr(false);
    }
    if (!values.email) {
      setEmailErr(true);
      return
     
    } else  {
      setEmailErr(false);
    }

    if (!values.password) {
      setPasswordErr(true);
      return
    } else {
      setPasswordErr(false);
      
    }

    if (!values.confirmpassword) {
      setConfirmpasswordErr(true);
      return
   
    } else {
      setConfirmpasswordErr(false);
    }

    if (!values.userGroup) {
      setRoleErr(true);
      return
    }
    if (values.alerts.email && !values.genericEmail ){
         setAlertEmailErr(true)
        return
    }
    else {
      setAlertEmailErr(false)
    }
  
    values.assignedLocation = admin?.assignedLocation;
    let userObj = values;
    let data = { user: userObj };
    const response = await api.post('/api/users', data, {
      headers: { Authorization: localStorage.getItem('access_token') }
    });
    if (response.status == 200) {
      props.loadUser();
      setValues({
        name: "",
        email: "",
        genericEmail: "",
        password: "",
        alerts:{
          sms:false,
          email:false
        },
        confirmpassword: "",
        userGroup: "",
        assignedLocation: "",
        mobile: "",
        phone: ""
      })
      notify();
    }
    
  };

  const handleFocus = (e) => {
    if (e.target.name == 'name') {
      setNameErr(false);
    } else if (e.target.name == 'email') {
      setEmailErr(false);
      setEmailRegex('');
    } else if (e.target.name == 'password') {
      setPasswordErr(false);
      setPassRegexs('');
    } else if (e.target.name == 'confirmpassword') {
      setConfirmpasswordErr(false);
    }
  };

  useEffect(()=>{
   
  setTimeout(() => {
    setErrTiming(true)

  }, 8000);

  },[errTiming])

 
  return (
    <>
      {props.userCom ? (
        <>
       <h3>Add New user</h3>
        <div style={{ width: '100%' }}>
        
          <Box
            sx={{
              width: 700,
              maxWidth: '100%',
              marginTop: '15px'
            }}
          >
            <label> Name</label>

            <TextField
                  inputProps={{
            autocomplete: 'new-password',
            form: {
            autocomplete: 'off',
           },
           }}
              value={values.name}
              onChange={handleChange}
              name="name"
              sx={{ outline: 'none', border: '1px solid black' }}
              fullWidth
              placeholder="admin"
              id="fullWidth"
              onFocus={handleFocus}
              style={{ border: nameErr ? '1px solid red' : '1px solid black' }}
            />
              { errTiming==false?  <span   className="err-span-validation" style={{ display: nameErr ? 'block' : 'none'  ,background:"#FF3333",padding:"10px 30px",color:"white",borderRadius:"8px",position:"relative",marginTop:"10px"}}>
            <AiOutlineExclamationCircle style={{position:"absolute",right:"0",color:"white",fontSize:"20px",marginRight:"10px"}}/>
            <div style={{width: "0",height: "0",borderLeft: "10px solid transparent",borderRight: "10px solid transparent",borderBottom: "10px solid #FF3333",position:"absolute",top:"-9.6px"}}></div>
                       Name Required
            </span>:""}
          </Box>

          <Box
            sx={{
              width: 700,
              maxWidth: '100%',
              marginTop: '15px'
            }}
          >
            <label> Email</label>
            <TextField
            inputProps={{
            autocomplete: 'new-password',
            form: {
            autocomplete: 'off',
           },
           }}
              required={true}
              value={values.email}
              onChange={handleChange}
              name="email"
              sx={{ outline: 'none', border: '1px solid black'}}
              fullWidth
              placeholder="admin@gms.com"
              id="fullWidth"
              onFocus={handleFocus}
              style={{ border: nameErr ? '1px solid red' : '1px solid black' }}
            />
             { errTiming==false?
                 <span  className="err-span-validation" style={{ display: emailErr ? 'block' : 'none'  ,background:"#FF3333",padding:"10px 30px",color:"white",borderRadius:"8px",position:"relative",marginTop:"10px"}}>
            <AiOutlineExclamationCircle style={{position:"absolute",right:"0",color:"white",fontSize:"20px",marginRight:"10px"}}/>
            <div style={{width: "0",height: "0",borderLeft: "10px solid transparent",borderRight: "10px solid transparent",borderBottom: "10px solid #FF3333",position:"absolute",top:"-9.6px"}}></div>
                       Email Required
            </span>
                         :""} 
            <span className="err-span-validation">{emailRegex ? emailRegex : ''}</span>
          </Box>
          <Box
            sx={{
              width: 700,
              maxWidth: '100%',
              marginTop: '15px'
            }}
          > 
          </Box>

            <div>
              <Box
                sx={{
                  width: 700,
                  maxWidth: '100%',
                  marginTop: '15px'
                }}
              >
                <label> Password</label>
                <TextField
                  inputProps={{
                    autocomplete: 'new-password',
                    form: {
                    autocomplete: 'off',
                   },
                   }}
                  value={values.password}
                  onChange={handleChange}
                  name="password"
                  sx={{ outline: 'none', border: '1px solid black' }}
                  fullWidth
                  placeholder="Password"
                  id="fullWidth"
                  onFocus={handleFocus}
                  style={{ border: passwordErr ? '1px solid red' : '1px solid black' }}
                />
                {errTiming==false?
                  <span   className="err-span-validation" style={{ display: passwordErr ? 'block' : 'none'  ,background:"#FF3333",padding:"10px 30px",color:"white",borderRadius:"8px",position:"relative",marginTop:"10px"}}>
            <AiOutlineExclamationCircle style={{position:"absolute",right:"0",color:"white",fontSize:"20px",marginRight:"10px"}}/>
            <div style={{width: "0",height: "0",borderLeft: "10px solid transparent",borderRight: "10px solid transparent",borderBottom: "10px solid #FF3333",position:"absolute",top:"-9.6px"}}></div>
                  Password Required
            </span>
                       :""}
                <span className="err-span-validation">{passwordErr ? passwordErr : ''}</span>
              </Box>

              <Box
                sx={{
                  width: 700,
                  maxWidth: '100%',
                  marginTop: '15px'
                }}
              >
                <label> Confirm Password</label>
                <TextField
                  inputProps={{
                    autocomplete: 'new-password',
                    form: {
                    autocomplete: 'off',
                   },
                   }}
                  value={values.confirmpassword}
                  onChange={handleChange}
                  name="confirmpassword"
                  sx={{ outline: 'none', border: '1px solid black' }}
                  fullWidth
                  placeholder="Confirm Password"
                  id="fullWidth"
                  onFocus={handleFocus}
                  style={{ border: confirmpasswordErr ? '1px solid red' : '1px solid black' }}
                />
                {
                 errTiming==false? 
              <span    className="err-span-validation" style={{ display: confirmpasswordErr ? 'block' : 'none'  ,background:"#FF3333",padding:"10px 30px",color:"white",borderRadius:"8px",position:"relative",marginTop:"10px"}}>
            <AiOutlineExclamationCircle style={{position:"absolute",right:"0",color:"white",fontSize:"20px",marginRight:"10px"}}/>
            <div style={{width: "0",height: "0",borderLeft: "10px solid transparent",borderRight: "10px solid transparent",borderBottom: "10px solid #FF3333",position:"absolute",top:"-9.6px"}}></div>
                  Password Required
            </span>:""}
            {
                 errTiming==false? 
            <span    className="err-span-validation" style={{ display: passRegexs ? 'block' : 'none'  ,background:"#FF3333",padding:"10px 30px",color:"white",borderRadius:"8px",position:"relative",marginTop:"10px"}}>
            <AiOutlineExclamationCircle style={{position:"absolute",right:"0",color:"white",fontSize:"20px",marginRight:"10px"}}/>
            <div style={{width: "0",height: "0",borderLeft: "10px solid transparent",borderRight: "10px solid transparent",borderBottom: "10px solid #FF3333",position:"absolute",top:"-9.6px"}}></div>
              Password & confirm password must match
            </span>:""}
              </Box>
            </div>
          <Box
            sx={{
              width: 700,
              maxWidth: '100%',
              marginTop: '15px'
            }}
            >
            <InputLabel id="demo-multiple-name-label">Role</InputLabel>
            <Select
              onChange={handleChange}
              name="userGroup"
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={values.userGroup}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
              displayEmpty
              sx={{ outline: 'none', border: '1px solid black', width: '100%', borderRadius: '0' }}
              style={{ border: roleErr ? '1px solid red' : '1px solid black' }}
            >
              {roles.map((value, index) => {
                if(value.group_id !== 'admin')
                {
                  return (
                    <MenuItem key={index} value={value._id}>
                      {value.name}
                    </MenuItem>
                  );
                }
              })}
            </Select>
           
           {errTiming==false?
            <span    className="err-span-validation" style={{ display: roleErr ? 'block' : 'none'  ,background:"#FF3333",padding:"10px 30px",color:"white",borderRadius:"8px",position:"relative",marginTop:"10px"}}>
            <AiOutlineExclamationCircle style={{position:"absolute",right:"0",color:"white",fontSize:"20px",marginRight:"10px"}}/>
            <div style={{width: "0",height: "0",borderLeft: "10px solid transparent",borderRight: "10px solid transparent",borderBottom: "10px solid #FF3333",position:"absolute",top:"-9.6px"}}></div>
              Role Required
            </span>
                  :""}
          </Box>
            
          <Box
            sx={{
              width: 700,
              maxWidth: '100%',
              marginTop: '15px'
            }}
          >
            <label> Alert Email</label>
            <TextField
          
              required
              onChange={handleChange}
              value={values.genericEmail}
              name="genericEmail"
              sx={{ outline: 'none', border: '1px solid black' }}
              fullWidth
              placeholder="admin2@gms.com"
              id="fullWidth"
              style={{ border: alertEmailErr ? '1px solid red' : '1px solid black' }}
            />

              {errTiming==false?
            <span    className="err-span-validation" style={{ display: alertEmailErr ? 'block' : 'none'  ,background:"#FF3333",padding:"10px 30px",color:"white",borderRadius:"8px",position:"relative",marginTop:"10px"}}>
            <AiOutlineExclamationCircle style={{position:"absolute",right:"0",color:"white",fontSize:"20px",marginRight:"10px"}}/>
            <div style={{width: "0",height: "0",borderLeft: "10px solid transparent",borderRight: "10px solid transparent",borderBottom: "10px solid #FF3333",position:"absolute",top:"-9.6px"}}></div>
              Alert Email  Required
            </span>
                  :""}
          </Box>


          <Box
            sx={{
              width: 700,
              maxWidth: '100%',
              marginTop: '15px',
            }}
          >
            <InputLabel id="demo-multiple-name-label">Alerts</InputLabel>
            <FormControlLabel control={<Checkbox name ="email" checked={values.alerts.email} onChange={handleChangeAlert} style={{color:"#1B1464"}} />} label="Email" />
          </Box>
          <Box
            sx={{
              width: 700,
              maxWidth: '100%',
              marginTop: '15px'
            }}
          >
            <label> Phone</label>
            <TextField
              inputProps={{
                autocomplete: 'new-password',
                form: {
                autocomplete: 'off',
               },
               }}
              value={values.phone}
              onChange={handleChange}
              name="phone"
              required={true}
              sx={{ outline: 'none', border: '1px solid black' }}
              fullWidth
              placeholder="Phone"
              id="fullWidth"
            />
          </Box>

          <Box
            sx={{
              width: 700,
              maxWidth: '100%',
              marginTop: '15px'
            }}
          >
            <label> Mobile</label>
            <TextField
              inputProps={{
                autocomplete: 'new-password',
                form: {
                autocomplete: 'off',
               },
               }}
              value={values.mobile}
              onChange={handleChange}
              name="mobile"
              sx={{ outline: 'none', border: '1px solid black' }}
              fullWidth
              placeholder="+1454445500"
              id="fullWidth"
            />
          </Box>

          <Box
            sx={{
              width: 700,
              maxWidth: '100%',
              marginTop: '15px'
            }}
          ></Box>
          <Button
            onClick={handleSubmit}
            type="submit"
            sx={{
              background: '#1B1464',
              borderRadius: '0',
              marginTop: '20px',
              minWidth: '120px',
              boxShadow: '0'
            }}
            variant="contained"
          >
            Submit
          </Button>
          <ToastContainer />
        </div>
        </>
      ) : (
        <SetupFormEdit editUser={props.editUser} setEditUser={props.setEditUser} loadUser={props.loadUser}/>
      )}
      
    </>
    
  );
}

export default SetupForm;
