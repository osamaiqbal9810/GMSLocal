import React from 'react'
import { RadialGauge } from 'react-canvas-gauges';
function GensetDials({gensetState,supportedParams,arrangeGenDials}) {
  let arrange = arrangeGenDials;
  return (
        <div>
          {arrange.map((key, ind) => {
           
            if(gensetState !== undefined && gensetState.hasOwnProperty(key))
            {
              key=arrange[ind];
              if (key!== "systemOverview" && key!== "lastOutageTime" && key!== "lastOutageDuration" && key!== "switchTrasferTotal" && key !== 'engineTotalTime' && key !== 'engineTimeLoaded'  && key !== 'modBusProductId'   && key !== 'engineTotalStarts'  && key !== 'genStatus' && key !== 'controllerOpTime' && key !== 'generatedEnergy') {
                let suppUnit = supportedParams.find(({name}) => name === key);
                if(suppUnit !== undefined)
                {
                  let min = suppUnit !== null ? suppUnit.min : 0;
                  let max = suppUnit !== null ? suppUnit.max : 100;
                  let value = gensetState[key]?.value;
                  let unit= suppUnit !== null ? suppUnit.unit.hasOwnProperty('short') ? suppUnit.unit.short : suppUnit.unit : null;
                  if(key === "engineSpeed")
                  {
                    value = value/1000;
                    unit= unit+" * 1000"
                  }
                  let currentTime = new Date().getTime();
                  let lastUpdate = new Date(gensetState[key].lastUpdated).getTime();
                  let timeDiff = (currentTime - lastUpdate)/60000;
                  return (
                    <div className='dials' key={ind}>
                      <RadialGauge
                        units={unit}
                        value={value}
                        valueText={gensetState[key].value}
                        width={270}
                        minValue={min}
                        maxValue={max}
                        majorTicks={suppUnit.majorTicks}
                        height={270}
                        minorTicks={10}
                        colorPlate="#1B1464"
                        colorPlateEnd={gensetState[key].missed===true  && gensetState[key].valid===false  || timeDiff >= 2 ?   "red":  gensetState[key].missed===true  && gensetState[key].valid===true ? "#E26310":  "#1B1464"}
                        colorMajorTicks="#F40C08"
                        colorMinorTicks="#F4B708"
                        colorTitle="#F7FAF1"
                        colorUnits="#F7FAF1"
                        colorNumbers="#F7FAF1"
                        colorNeedle="#F7FAF1"
                        colorValueTextShadow="#F4B708"
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
                      > 
                      </RadialGauge>
                      
                    <div className="dials-tiles">{suppUnit.label }</div>
                    </div>
                  );
                }
              }
            }
          })}
        </div>
    )
}

export default GensetDials
