import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import axios from 'axios';
import { getServerEndpoint } from '../../../utils/serverEndpoint';
import "./assetsData.css"
import "./AssetForm.css";

export default function AssetForm({ name, parentID, load, modalStatus }) {

    const [majorAsset, setMajorAsset] = useState(null);
    const [err, setErr] = useState(false)
    const [errTiming, setErrTiming] = useState(false);

    const api = axios.create({
        baseURL: getServerEndpoint(),
    });

    const getValue = (e) => {
        if (e.target.value.length > 0) {
            setErr(false)
        }
        else {
            setErr(true)
        }

        setMajorAsset(e.target.value);
    }

    const handleFocus = () => {
        setErr(false)
    }
    const submit = async (e) => {
        e.preventDefault();
        if (errTiming) {
            setErrTiming(false)
        }
        if (!majorAsset) {
            setErr(true)
            return;
        }

        let assetType = "Floor";
        if (name === "City") {
            assetType = "Location";
        }
        else if (name === "Location") {
            assetType = "Store";
        }
        let data = {
            asset: {
                assetType: assetType,
                attributes: {
                    geoJsonCard: "",
                    timezone: ""
                },
                description: majorAsset,
                end: 0,
                name: majorAsset,
                parentAsset: parentID,
                start: 0,
                unitId: majorAsset
            }
        }

        let response = await api.post("/api/asset", data, { headers: { "Authorization": localStorage.getItem('access_token') } })
        if (response.status === 200) {
            if (name === "City") {

                load();
                modalStatus(false);
            }
            else if (name === "Location") {
                localStorage.setItem("minorAssetID", response.data._id);
                load();
                modalStatus(false);
            }
            else if (name === "Asset") {
                localStorage.setItem("locationIdentifier", response.data._id);
                modalStatus(false);
            }
        }

    }

    useEffect(() => {
        setTimeout(() => {
            setErrTiming(true)

        }, 8000);

    }, [errTiming])


    return (
        <Box
            sx={{
                width: 800,
                maxWidth: '100%',
            }}
        >
            <h4>{name}</h4>
            <TextField onFocus={handleFocus} style={{ border: err ? "1px solid red" : "1px solid black" }} fullWidth label={name}  onChange={getValue} />

            {errTiming === false && err === true ?
                <span className="asset-form-validation">
                    <AiOutlineExclamationCircle style={{ position: "absolute", right: "0", color: "white", fontSize: "20px", marginRight: "10px" }} />
                    <div style={{ width: "0", height: "0", borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "10px solid #FF3333", position: "absolute", top: "-9.6px" }}></div>
                    {name} Field is required
                </span>
                : ""}
            <Button className="genset-button" type='submit' onClick={submit} variant="contained">Add {name}</Button>

        </Box>
    );
}
