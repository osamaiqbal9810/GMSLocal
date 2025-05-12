import React,{useState} from 'react'
import io from 'socket.io-client';
import { getServerEndpoint } from '..//..//utils/serverEndpoint';
import { list, updateAsset, listAlerts, updateAlerts, updateAts } from '../../Slice/assetsListSlice';
import { tilesList, updateTilesList } from '../../Slice/tilesSlice';
import { useSelector, useDispatch } from 'react-redux';
function SocketIo() {
    const dispatch = useDispatch();
    let [socket, setSocket] = useState(null);
    React.useEffect(() => {
        console.log("Connect To socket");
        let ws = io(getServerEndpoint());
        ws.connect();
        ws.on("connect", () => {
            console.log(ws.connected); // true
        });

        ws.on('gateDataReceive', (data) => {
            dispatch(updateAsset({ data: data[0] }));
        });

        ws.on('triggerNotification', (data) => {
            dispatch(updateAlerts(data));
        });
        ws.on('triggerAssetStatusChange', (data)=>{
             dispatch(tilesList(data.value));
          })
          ws.on('gateDataReceive', (data)=>{

            if(data[0].suppDevice.type==="GENSET")
            {
              dispatch(updateAsset({data:data[0]})); 
            }
            else if(data[0].suppDevice.type==="ATS")
            {
              dispatch(updateAts({data:data[0]}))
            }  
           })
        setSocket(ws);
        return () => {
            ws.disconnect();
        }

    }, [])
    return (
        <div>

        </div>
    )
}

export default SocketIo
