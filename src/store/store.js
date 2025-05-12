import { configureStore } from '@reduxjs/toolkit'
import logInSlice from '../Slice/logInSlice'
import userSlice from '../Slice/userSlice';
import assetsListSlice from '../Slice/assetsListSlice';
import tilesSlice from '../Slice/tilesSlice';
 
export const store = configureStore({  
  reducer: {
     login: logInSlice,
     edit: userSlice,
     update: userSlice,
     userGroup:logInSlice,
     list: assetsListSlice,
     updateAsset: assetsListSlice,
     updateAts: assetsListSlice,
     listAlerts: assetsListSlice,
     updateAlerts:assetsListSlice,
     clearAlerts:assetsListSlice,
     ackAlerts: assetsListSlice,
     tilesList: tilesSlice,
     updateTilesList: tilesSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})