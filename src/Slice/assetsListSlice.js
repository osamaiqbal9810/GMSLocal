import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  asset: [],
  atsList: [],
  alertsList: []
};
export const assetsListSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    list: (state, action) => {
      state.asset = action.payload;
      let devices = action.payload.filter(({ assetType }) => assetType === 'device');
      let atsDevices = devices.filter(({ suppDevice }) => suppDevice.type === 'ATS');
      state.atsList = atsDevices;
      return;
    },
    updateAsset: (state, action) => {
      let all = state.asset;
      let data = action.payload.data;
      if (data && all.length > 0) {
        let findIndex = all.findIndex(({ _id }) => _id === data._id);
        state.asset[findIndex] = data;
      }
    },
    updateAts: (state, action) => {
      let all = state.atsList;
      let data = action.payload.data;
      if (data && all.length > 0) {
        let findIndex = all.findIndex(({ _id }) => _id === data._id);
        state.atsList[findIndex] = data;
      }
    },
    listAlerts: (state, action) => {
      state.alertsList = action.payload;
    },
    updateAlerts: (state, action) => {
      let data = action.payload;
      let duplicateFlag = false;
      if (data) {
        state.alertsList.forEach((alert) =>
          alert.forEach((alrt) => {
            if (alrt._id === data._id) {
              duplicateFlag = true;
            }
          })
        );
        if (duplicateFlag === false) {
          let alertsArray = [];
          alertsArray.push(data);
          if (state.alertsList.length <= 0) {
            state.alertsList.push(alertsArray);
          } else {
            state.alertsList.forEach((alert) => {
              alert.unshift(data);
            })
          }

        }
      }
    },
    clearAlerts: (state, action) => {
      state.alertsList = [];
    },
    ackAlerts: (state, action) => {
      let all = state.alertsList;
      let data = action.payload;
      state.alertsList = [];
      if (data) {
        all.forEach((alert, i) =>
          alert.forEach((alrt, j) => {
            if (alrt._id != data._id) {
              let alertsArray = [];
              alertsArray.push(alrt);
              state.alertsList.push(alertsArray);
            }
          })
        );
      }
    }
  }
});

export const { list, updateAsset, updateAts, listAlerts, updateAlerts, clearAlerts, ackAlerts } = assetsListSlice.actions;

export default assetsListSlice.reducer;
