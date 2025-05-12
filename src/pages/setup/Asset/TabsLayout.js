
import * as React from 'react';
import "../../../layouts/style.css"
import AssetForm from './AssetForm';

export default function BasicTabs(props) {
  return (
    <div>
      <AssetForm name={props.name} parentID = {props.parentID}  load ={props.loadFunc} modalStatus={props.modalStatus} />
    </div>
  );
}
