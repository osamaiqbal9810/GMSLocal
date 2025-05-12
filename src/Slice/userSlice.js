import { createSlice } from '@reduxjs/toolkit';
import { getServerEndpoint } from '../utils/serverEndpoint';
import axios from 'axios';
const api = axios.create({
  baseURL: getServerEndpoint(),
});

const initialState = {
  userGroups:[],
  user: {
    "department":[],
    "subdivision":"",
    "active":true,
    "isRemoved":false,
    "isAdmin":true,
    "userGroups":[],
    "teamLead":"",
    "team":[],
    "name":"",
    "tenantId":"",
    "email":"",
    "hashedPassword":"",
    "userGroup":{},
    "group_id":"",
    "genericEmail":"",
    "mobile":"",
    "createdAt":{"$date":{"$numberLong":""}},
    "updatedAt":{"$date":{"$numberLong":""}},
    "__v":0,
    "assignedLocation":"",
    "assignedLocationName":"",
    "phone":""
 },

 update: {}
}
export const userSlice = createSlice({
  name: 'editUser',
  initialState,
  reducers: {
    edit: (state, action) => {
        state.user = action.payload;
    },  
    update: (state, action) => {
      // console.log(action.payload.username);
  },
 

  },

})

export const { edit,update,userGroup } = userSlice.actions
export default userSlice.reducer