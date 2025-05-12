import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import axios from 'axios';
import Page from '../../../components/Page';
import { getServerEndpoint } from '../../../utils/serverEndpoint';
import TableLayout from './TableLayout.js';
import LoadingScreen from 'react-loading-screen';
import logo from '../../../Images/logo.png';
// ----------------------------------------------------------------------

export default function Asset() {
  const [show, setShow] = useState('none');

  const [companyAsset, setCompanyAsset] = useState({});
  const [majorLocationAssets, setMajorLocationAssets] = useState([]);
  const [minorLocationAssets, setMinorLocationAssets] = useState([]);
  const [locationSetupData, setLocationSetupData] = useState([]);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: getServerEndpoint()
  });
  const display = (value) => {
    let style = {
      dShow: 'block',
      dNone: 'none'
    };
    if (value) {
      setShow(style.dShow);
    } else {
      setShow(style.dNone);
    }
  };
  async function getAsset() {
    setLoading(true);
    const response = await api.get('/api/asset/location/railRoad', {
      headers: { Authorization: localStorage.getItem('access_token') }
    });
    if (response.status === 200) {
      setLoading(false);
      loadFunction(response.data);
    }
  }
  useEffect(() => {
    getAsset();
  }, []);
  const loadFunction = (locationSetup) => {
    let company = locationSetup.assetTypes.find(({ parentAssetType }) => parentAssetType === null);
    let companyAsset,
      majorGeoType,
      minorGeoType,
      locationIdentifier = {};
    let majorLocationAssets = [];
    let minorLocationAssets = [];
    let addAndCheck = {
      showLocIdentifierAdd: false,
      showMinorAdd: false,
      minorGeoAllowed: false,
      locIdentifierAllowed: false,
      disableLocIdentifierAllowed: true
    };
    if (company) {
      companyAsset = locationSetup.assets.find(({ assetType }) => assetType === company.assetType);
      majorGeoType = locationSetup.assetTypes.find(
        ({ parentAssetType }) => parentAssetType === company._id
      );
      minorGeoType = locationSetup.assetTypes.find(
        ({ parentAssetType }) => parentAssetType === majorGeoType._id
      );
      majorLocationAssets = locationSetup.assets.filter(
        ({ assetType }) => assetType === majorGeoType.assetType
      );
      minorLocationAssets = locationSetup.assets.filter(
        ({ assetType }) => assetType === minorGeoType.assetType
      );
      if (locationIdentifier.plannable || minorGeoType.plannable) {
        addAndCheck.disableLocIdentifierAllowed = false;
        addAndCheck.minorGeoAllowed = true;
        locationIdentifier.plannable && (addAndCheck.locIdentifierAllowed = true);
      }
    }
    setCompanyAsset(companyAsset);
    setMinorLocationAssets(minorLocationAssets);
    setMajorLocationAssets(majorLocationAssets);
    setLocationSetupData(locationSetup);
  };

  const loadAsset = () => {
    getAsset();
  };

  return (
    <LoadingScreen
      loading={loading}
      bgColor="#1B1464"
      spinnerColor="#9ee5f8"
      textColor="#ffff"
      logoSrc={logo}
      text="Loading ..."
    >
      <Container maxWidth="xl">
        <Page title="Assets">
          <TableLayout
            majorLocationAssets={majorLocationAssets}
            minorLocationAssets={minorLocationAssets}
            load={loadAsset}
            locationSetup={locationSetupData}
            setMajorLocationAssets={setMajorLocationAssets}
          />
        </Page>
      </Container>
    </LoadingScreen>
  );
}
