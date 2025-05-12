import * as React from 'react';
import Grid from '@mui/material/Grid';
import MajorLocationAssets from './MajorLocationAssets';
import MinorLocationAssets from './MinorLocationAssets';
import LocationIdentifier from './LocationIdentifier';
import axios from 'axios';
import { getServerEndpoint } from '../../../utils/serverEndpoint';
export default function TableLayout({ majorLocationAssets, setMajorLocationAssets, load }) {
  const api = axios.create({
    baseURL: getServerEndpoint()
  });
  const [locationSetup, setLocationSetup] = React.useState([]);
  
  async function getAsset() {
    const response = await api.get('/api/asset/location/railRoad', {
      headers: { Authorization: localStorage.getItem('access_token') }
    });

    if (response.status === 200) {
      setLocationSetup(response.data);
    }
  }

  const [minorLocationList, setMinorLocationList] = React.useState([]);
  const [locationIdentifierList, setLocationIdentifier] = React.useState([]);
  const loadMinorAsset = (parentId) => {
    
    setLocationIdentifier([]);
    const minorLocationAssets = locationSetup.assets.filter(
      ({ parentAsset }) => parentAsset === parentId
    );
    setMinorLocationList(minorLocationAssets);
  };

  const loadAssetIdentifier =async  (parentId) => {
    const response = await api.get('/api/asset/location/railRoad', {
      headers: { Authorization: localStorage.getItem('access_token') }
    });

      if (response.status === 200) {
        const locationSetup = response.data;
        const locationIdentifierAssets = locationSetup.assets.filter(
          ({ parentAsset }) => parentAsset === parentId
        );
        setLocationIdentifier(locationIdentifierAssets);
    }
  };

  React.useEffect(() => {
    getAsset();
  }, [load]);

  const getMinorLocationAsset = async (id) => {
    const response = await api.get('/api/asset/', {
      headers: { Authorization: localStorage.getItem('access_token') }
    });
    if (response.status === 200) {
      const locationSetup = response.data;
      const minorLocationAssets = locationSetup.assetsList.filter(
        ({ parentAsset }) => parentAsset === id
      );
      const filterMinorLocationAssets = minorLocationAssets.filter(
        ({ isRemoved }) => isRemoved === false
      );
      setMinorLocationList(filterMinorLocationAssets);
    }
  };

  const getLocationIdentifier = async (id) => {
    const response = await api.get('/api/asset/', {
      headers: { Authorization: localStorage.getItem('access_token') }
    });
    if (response.status === 200) {
      const locationSetup = response.data;
      const locationIdentifier = locationSetup.assetsList.filter(
        ({ parentAsset }) => parentAsset === id
      );
      const filterLocationIdentifier = locationIdentifier.filter(
        ({ isRemoved }) => isRemoved === false
      );
      setLocationIdentifier(filterLocationIdentifier);
    }
  };

  return (
    <Grid container spacing={2} style={{ marginLeft: '0' }}>
      <Grid item xs={12} lg={4}>
        <MajorLocationAssets
          majorLocationAssets={majorLocationAssets}
          loadFunction={loadMinorAsset}
          setMajorLocationAssets={setMajorLocationAssets}
          load={load}
        />
      </Grid>
      <Grid item xs={12}  lg={4}>
        <MinorLocationAssets
          minorLocationAssets={minorLocationList}
          loadFunction={loadAssetIdentifier}
          load={load}
          getMinorLocationAsset={getMinorLocationAsset}
        />
      </Grid>
      <Grid item xs={12}  lg={4}>
        <LocationIdentifier
          locationIdentifierAssets={locationIdentifierList}
          load={load}
          getLocationIdentifier={getLocationIdentifier}
        />
      </Grid>
    </Grid>
  );
}
