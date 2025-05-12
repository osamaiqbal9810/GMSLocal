import { createSlice } from '@reduxjs/toolkit';
import { getServerEndpoint } from '../utils/serverEndpoint';
import axios from 'axios';
const api = axios.create({
  baseURL: getServerEndpoint(),
});

const initialState = {
  userGroup:[],
  allRoles:[],
  user: {
    email: '',
    password: '',
    remember: ''
  },
}
export const logInSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: async (state, action) => {
    
    },
 
    userGroup:(state,action)=>{
      if (Array.isArray(state.userGroup)) {
        const data=action.payload.data;
        state.allRoles.push(data);
        const userObjs = JSON.parse(action.payload.useRole);
        let userRole =  data.find(({ _id }) => _id === userObjs.userGroup._id);
        state.userGroup.push(userRole)
      
      }
   
    },
    logOut: (state, action) => {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("access_token");
    
    },

  },

})

export const { login, logOut,userGroup } = logInSlice.actions

export default logInSlice.reducer