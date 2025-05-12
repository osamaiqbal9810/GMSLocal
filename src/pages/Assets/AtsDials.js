import React from 'react'
import { RadialGauge } from 'react-canvas-gauges';
function AtsDials({atsValues,supportedParams, arrangeAtsDials}) {
  
  let arrange = arrangeAtsDials;
  return (
        <div>
          <div>
            {arrange.map((key,ind) => {
              if (key!== "systemOverview" && key!== "lastOutageTime" && key!== "lastOutageDuration" && key!== "switchTrasferTotal" && key!== "modBusProductId") {
                 
                if(atsValues !== undefined && atsValues.hasOwnProperty(key))
                {
                  let suppUnit = supportedParams.find(({name}) => name === key);
                  let min = suppUnit.min !== null ? suppUnit.min : 0;
                  let max = suppUnit.max !== null ? suppUnit.max : 100;
                  let value = atsValues[key].value;
                  if(key === "engineSpeed")
                  {
                    value = atsValues[key].value/1000;
                  }
                  let currentTime = new Date().getTime();
                  let lastUpdate = new Date(atsValues[key]?.lastUpdated).getTime();
                  let timeDiff = (currentTime - lastUpdate)/60000;
                  return (
                    <div className='dials' key={ind}>
                    
                    <RadialGauge
                      units={suppUnit.unit !== null ? suppUnit.unit.hasOwnProperty('short') ? suppUnit.unit.short : suppUnit.unit : null}
  
                      value={value}
                      valueText={value}
                      width={270}
                      minValue={min}
                      maxValue={max}
                      majorTicks={suppUnit.majorTicks}
                      height={270}
                      minorTicks={10}
                      colorPlate="#1B1464"
                      colorPlateEnd={atsValues[key].missed===true  && atsValues[key].valid===false || timeDiff >= 2 ?   "red":  atsValues[key].missed===true  && atsValues[key].valid===true ? "#E26310":  "#1B1464"}
                      colorMajorTicks="#F40C08"
                      colorMinorTicks="#F4B708"
                      colorTitle="#F7FAF1"
                      colorUnits="#F7FAF1"
                      colorNumbers="#F7FAF1"
                      colorNeedle="#F7FAF1"
                      colorValueTextShadow="#F4B708"
                      data-animation-duration="500"
                      colorValueBoxBackground="white"
                      colorValueBoxRect="white" 
                      colorValueText="green"
                      valueBoxStroke="3rem"
                      valueBoxWidth="35%"
                      fontValueSize={35}
                      animate="true"
                      animationRule="linear"
                      animatedValue="true"
                      animateOnInit="true"
                      animationDuration="500"
                    ></RadialGauge>
                    <div className='dials-tiles'>{suppUnit.label}</div>
                    </div>
                  );
                }
              }
            })}
            </div>
        </div>
    )
}

export default AtsDials
