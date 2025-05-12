import React,{useEffect, useRef} from 'react'
import {Line,Bar, Pie} from "react-chartjs-2"
import { Chart as ChartJS } from 'chart.js/auto'
import { YAxis } from 'recharts'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale';
import Card from '@mui/material/Card';

const BarChart = ({chartData,genData,runDatas,pieDatas}) => {

  return (
    <div>
    <div style={{width:"100%",margin:"auto",boxShadow:"0 0 6px #c5c5c5"}}>
    <Line style={{background:"white",padding:"10px"}} data={chartData} options={{scales:{y:{ ticks:{stepSize:1},beginAtZero:true, grid:{display:false}},x:{grid:{display:false},type:"time", time: {
                  unit: 'hour',
                  displayFormats: {
                      hour: 'HH:mm'
                  }
                } ,adapters: { 
            date: {
              locale: enUS, 
            },
            
          }, }}}} />
    </div>

    <div className='lineChartsDev' style={{}}>
      <div style={{width:"100%",background:"white",padding:"20px",boxShadow:"0 0 6px #c5c5c5"}}>
        <Line  data={genData} options={{scales:{y:{ticks:{stepSize:1},beginAtZero:true, grid:{display:true}},x:{grid:{display:false},type:"time",  time: {
                  unit: 'hour',
                  displayFormats: {
                      hour: 'HH:mm'
                  }
                },adapters:{
            date: {
              locale: enUS, 
            }
        }}}}} />
    </div>
    <div  style={{width:"100%",background:"white",padding:"20px",boxShadow:"0 0 6px #c5c5c5"}}>
      <Line  data={runDatas}  options={{scales:{y:{ ticks:{stepSize:1},beginAtZero:true, grid:{display:false}},x:{grid:{display:false},type:"time", time: {
                unit: 'hour',
                displayFormats: {
                    hour: 'HH:mm'
                }
              },adapters:{
          date: {
            locale: enUS, 
          },
      }}}}}  />
    </div>
    </div>
    </div>
  )
}

export default BarChart