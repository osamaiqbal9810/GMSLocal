import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import "./setup.css"
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { getServerEndpoint } from '../../../utils/serverEndpoint';
import axios from "axios"
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useSelector } from 'react-redux';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,

        },
    },
};

function SetupForm(props) {
    const notifydanger = () => toast.warning('Please Fill out this form completely');

    const [confirmpasswordErr, setConfirmpasswordErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);
    const [errTiming,setErrTiming]=useState(false);


    const [passRegexs, setPassRegexs] = useState('');

    const notify = () => toast.success("User updated Successfully");
    const [roles, setRoles] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        async function getRoles() {
            const response = await api.get('/api/userGroup', { headers: { "Authorization": localStorage.getItem('access_token') } });
            const locationResp = await api.get('/api/asset', { headers: { "Authorization": localStorage.getItem('access_token') } });

            if (response.status == 200) {
                setRoles(response.data);
            }
            if (locationResp.status == 200) {
                setLocations(locationResp.data.assetsList);
            }
        }
        getRoles();
    }, [])
    const data = useSelector(state => state.edit.user);
    const [userValues, setUserValues] = useState({
        name: "",
        email: "",
        genericEmail: "",
        password: "",
        alerts: {
            sms: false,
            email: false
        },
        confirmpassword: "",
        userGroup: "",
        assignedLocation: "",
        mobile: "",
        phone: ""
    });

    useEffect(() => {
        setUserValues(data);
    }, [roles, data])


    const handleChange = (e) => {
        setUserValues({
            ...userValues,
            [e.target.name]: e.target.value
        })
    };


    const api = axios.create({
        baseURL: getServerEndpoint(),
    });

    const handleEditSubmit = async () => {
        if (errTiming){
            setErrTiming(false)
          }

        if (userValues.password  &&   !userValues.confirmpassword) {
            setPassRegexs('Confirm password required');
            return
          } else {
            setPassRegexs('');
          }

          if (userValues.confirmpassword && userValues.password != userValues.confirmpassword) {
            setPassRegexs('Password & Confirm password doesn\'t match');
            return
          } else {
            setPassRegexs('');
          }

          if (!userValues.password) {
          
            setPasswordErr(true);
            return
          } else {
            setPasswordErr(false);
            
          }
      
          if (!userValues.confirmpassword) {
            setConfirmpasswordErr(true);
            return
          } else {
            setConfirmpasswordErr(false);
          }

        let data = userValues;
        let id = data._id;
        const response = await api.put('/api/users/' + id + "/", data,
            {
                headers: { "Authorization": localStorage.getItem('access_token') },
                params: { id: id }
            });
        if (response.status == 200) {
            props.loadUser();
            setUserValues({
                name: "",
                email: "",
                genericEmail: "",
                password: "",
                alerts: {
                    sms: false,
                    email: false
                },
                confirmpassword: "",
                userGroup: "",
                assignedLocation: "",
                mobile: "",
                phone: ""
            })
            notify();
        }
   
    }

    const handleFocus = (e) => {
    if (e.target.name == 'password') {
          setPasswordErr(false);
          setPassRegexs('');
        } else if (e.target.name == 'confirmpassword') {
          setConfirmpasswordErr(false);
        }
      };
    
    const handleChangeAlert = (e) => {
        setUserValues({
            ...userValues,
            alerts: {
                ...userValues.alerts,
                [e.target.name]: e.target.checked
            }
        });
    };

    useEffect(()=>{
   
        setTimeout(() => {
          setErrTiming(true)
      
        }, 8000);
      
        },[errTiming])


    return (
        <div>
            <h3>Edit User</h3>
            <div style={{ width: "100%" }} >
                <Box
                    sx={{
                        width: 700,
                        maxWidth: '100%',
                        marginTop: "15px"
                    }}
                >
                    <label> Name</label>

                    <TextField
                        onChange={handleChange}
                        name="name"
                        sx={{ outline: "none", border: "1px solid black" }}
                        value={userValues.name}
                        fullWidth placeholder="admin" id="fullWidth" />
                </Box>

                <Box
                    sx={{
                        width: 700,
                        maxWidth: '100%',
                        marginTop: "15px"
                    }}
                >
                    <label> Email</label>
                    <TextField
                        inputProps={
                            { readOnly: true, }
                        }
                        value={userValues.email}
                        onChange={handleChange}
                        name="email"

                        sx={{ outline: "none", border: "1px solid black" }}
                        fullWidth placeholder="admin@rms.com" id="fullWidth" />
                </Box>

                <div >
                    <Box

                        sx={{
                            width: 700,
                            maxWidth: '100%',
                            marginTop: "15px"
                        }}
                    >
                        <label> Password</label>
                        <TextField
                            value={userValues.password}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            name="password"
                            sx={{ outline: "none", border: "1px solid black" }}
                            fullWidth placeholder="Password" id="fullWidth" />
                             {errTiming==false?
                  <span   className="err-span-validation" style={{ display: passwordErr ? 'block' : 'none'  ,background:"#FF3333",padding:"10px 30px",color:"white",borderRadius:"8px",position:"relative",marginTop:"10px"}}>
            <AiOutlineExclamationCircle style={{position:"absolute",right:"0",color:"white",fontSize:"20px",marginRight:"10px"}}/>
            <div style={{width: "0",height: "0",borderLeft: "10px solid transparent",borderRight: "10px solid transparent",borderBottom: "10px solid #FF3333",position:"absolute",top:"-9.6px"}}></div>
                  password required
            </span>
                       :""}
                <span className="err-span-validation">{passwordErr ? passwordErr : ''}</span>
                    </Box>

                    <Box
                        sx={{
                            width: 700,
                            maxWidth: '100%',
                            marginTop: "15px"
                        }}
                    >
                        <label> Confirm Password</label>
                        <TextField
                            value={userValues.confirmpassword}
                            onChange={handleChange}
                            name="confirmpassword"
                            sx={{ outline: "none", border: "1px solid black" }}
                            onFocus={handleFocus}
                            fullWidth placeholder="Confirm Password" id="fullWidth" />
                                  {
                 errTiming==false? 
              <span    className="err-span-validation" style={{ display: confirmpasswordErr ? 'block' : 'none'  ,background:"#FF3333",padding:"10px 30px",color:"white",borderRadius:"8px",position:"relative",marginTop:"10px"}}>
            <AiOutlineExclamationCircle style={{position:"absolute",right:"0",color:"white",fontSize:"20px",marginRight:"10px"}}/>
            <div style={{width: "0",height: "0",borderLeft: "10px solid transparent",borderRight: "10px solid transparent",borderBottom: "10px solid #FF3333",position:"absolute",top:"-9.6px"}}></div>
                 Confirm Password Required
            </span>:""}
            {
                 errTiming==false? 
            <span    className="err-span-validation" style={{ display: passRegexs ? 'block' : 'none'  ,background:"#FF3333",padding:"10px 30px",color:"white",borderRadius:"8px",position:"relative",marginTop:"10px"}}>
            <AiOutlineExclamationCircle style={{position:"absolute",right:"0",color:"white",fontSize:"20px",marginRight:"10px"}}/>
            <div style={{width: "0",height: "0",borderLeft: "10px solid transparent",borderRight: "10px solid transparent",borderBottom: "10px solid #FF3333",position:"absolute",top:"-9.6px"}}></div>
                Password & Confirm password doesn't match
            </span>:""}    
                    </Box>
                    
                </div>

                <Box sx={{
                    width: 700,
                    maxWidth: '100%',
                    marginTop: "15px"
                }}>
                    <InputLabel id="demo-multiple-name-label">Role</InputLabel>
                    <Select
                        onChange={handleChange}
                        name="userGroup"
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        value={userValues.userGroup ?? " "}
                        input={<OutlinedInput label="Name" />}
                        MenuProps={MenuProps}
                        sx={{ outline: "none", border: "1px solid black", width: "100%", borderRadius: "0" }}
                    >
                        {roles.map((role, index) => {
                            if (role.group_id !== 'admin') {
                                return (
                                    <MenuItem
                                        key={index}
                                        value={role._id}
                                    >
                                        {role.name}
                                    </MenuItem>
                                )
                            }
                        })}
                    </Select>

                </Box>

                <Box
                    sx={{
                        width: 700,
                        maxWidth: '100%',
                        marginTop: "15px"
                    }}
                >
                    <label> Alert Email</label>
                    <TextField
                        required
                        onChange={handleChange}
                        value={userValues?.genericEmail}
                        name="genericEmail"

                        sx={{ outline: "none", border: "1px solid black" }}
                        fullWidth placeholder="admin2@gms.com" id="fullWidth" />
                </Box>
                <Box
                    sx={{
                        width: 700,
                        maxWidth: '100%',
                        marginTop: '15px',
                    }}
                >
                    <InputLabel id="demo-multiple-name-label">Alerts</InputLabel>
                    <FormControlLabel control={<Checkbox name="email" checked={userValues?.alerts?.email} onChange={handleChangeAlert} sx={{ color: "#1B1464" }} />} label="Email" />
                </Box>
                <Box
                    sx={{
                        width: 700,
                        maxWidth: '100%',
                        marginTop: "15px"
                    }}
                >
                    <label> Phone</label>
                    <TextField
                        value={userValues.phone}
                        onChange={handleChange}
                        name="phone"

                        sx={{ outline: "none", border: "1px solid black" }}
                        fullWidth placeholder="Phone" id="fullWidth" />
                </Box>


                <Box
                    sx={{
                        width: 700,
                        maxWidth: '100%',
                        marginTop: "15px"
                    }}
                >
                    <label> Mobile</label>
                    <TextField
                        value={userValues.mobile}
                        onChange={handleChange}
                        name="mobile"

                        sx={{ outline: "none", border: "1px solid black" }}
                        fullWidth placeholder="+1454445500" id="fullWidth" />
                </Box>
                <Button onClick={handleEditSubmit} type="submit" sx={{ background: "#1B1464", borderRadius: "0", marginTop: "20px", minWidth: "120px", boxShadow: "0" }} variant="contained">Submit</Button>
                <ToastContainer />


            </div>
        </div>
    )
}

export default SetupForm