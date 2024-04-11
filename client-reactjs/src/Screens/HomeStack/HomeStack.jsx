import React, { useState } from 'react'
import AirQualityIndex from './AirQualityIndex';
import WaterQualityIndex from './WaterQualityIndex';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';

export default function HomeStack() {
  const [aqiSelect,setAqiSelect]=useState(true);
  const [wqiSelect,setWqiSelect]=useState(false);
  const navigate=useNavigate();
  const AQIhit=()=>{
    setAqiSelect(true);
    setWqiSelect(false);
  }
  const WQIhit=()=>{
    setAqiSelect(false);
    setWqiSelect(true);
  }
  return (
    <div style={{background:'url(src/assets/Signin.png)',backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100vh'}} className=' flex  flex-col w-full h-full'>

<div className='flex flex-row  items-center justify-between '>
            <div className='flex flex-row items-center justify-start'>
            <img src='src/assets/LOGO.png' style={{width:'150px'}}/>
            <h2 className='text-5xl font-bold text-blue-700'>Nireekshan</h2>
            </div>
            <div>
            <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
           onClick={async()=>{await auth.signOut();
            navigate('/login')
          }}
           
           >Sign Out</button>
            <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={()=>navigate('/profile')}
            >Profile</button>
            <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Contact Us</button>
            </div>
           </div>
           <div className='flex flex-col justify-center items-center'>
           <div className='flex flex-row  bg-white h-16 w-2/4 justify-between rounded-xl py-1 px-2'>
              <div className='flex flex-col items-center w-1/2 rounded-xl justify-center' onClick={AQIhit} style={{backgroundColor:aqiSelect?'#1d4ed8':'white'}}><h2 className={aqiSelect?'text-white text-2xl ml-1':'text-black text-2xl ml-1'}>AQI</h2></div>
              <div className='w-1/2 items-center flex flex-col rounded-xl justify-center'style={{backgroundColor:wqiSelect?'#1d4ed8':'white'}} onClick={WQIhit}><h2 className={wqiSelect?'text-white text-2xl ml-1':'text-blackc text-2xl ml-1'}>WQI</h2></div>
           </div></div>
           {aqiSelect&&<AirQualityIndex />}
           {wqiSelect&&<WaterQualityIndex />}
    </div>
  )
}
