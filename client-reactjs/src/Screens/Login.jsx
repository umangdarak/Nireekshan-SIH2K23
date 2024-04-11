import React from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";



export default function Login() {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const navigate=useNavigate();
    const loginUser=async(email,password)=>{
        try{     const userCredentials=await signInWithEmailAndPassword(auth,email,password);
        if(userCredentials.user&&userCredentials){
        }
    }catch(e){
        console.log(e)
    }
    }
    const handleLogin=()=>{
        if(email==''||password==''){
            return  alert("Please fill out all fields")
            
        }
        else{
            loginUser(email,password);
        }
    }
  return (
    <div style={{background:'url(src/assets/Signin.png)',backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%'}} className=' flex  flex-col w-full h-full'>
        <div className='flex flex-row  items-center justify-between'>
            <div className='flex flex-row items-center justify-start'>
            <img src='src/assets/LOGO.png' style={{width:'150px'}}/>
            <h2 className='text-5xl font-bold text-blue-700'>Nireekshan</h2>
            </div>
            <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Contact-Us</button>
           </div>
           <div className='flex flex-row justify-start'>
            <div className='flex flex-col items-center mt-2 ml-7'>
                <div className='flex flex-col items-start'>
                <h1 className=' text-8xl text-white font-bold'>Welcome </h1>
                <h1 className=' text-8xl text-white font-bold'>to Nireekshan </h1></div>
                <div className='flex flex-col items-center justify-center'>
                <img src='src/assets/11.png' style={{width:450}}/>
                </div>
            </div>
        <div className='flex flex-col ml-36 mt-28'>
            <h2 className='text-4xl font-normal'>Sign in</h2>
            <div className='h-12 my-5 bg-white rounded-xl w-80'>
        <input type="email" placeholder="    Email" className=" h-12  w-80 rounded-xl" 
        value={email} onChange={(e)=>setEmail(e.target.value)}/></div>
        <div className='h-12  bg-white rounded-xl'>
        <input type="password" placeholder="    Password" className=" h-12 w-80 rounded-xl " 
        value={password} onChange={(e)=>setPassword(e.target.value)}
        /></div>
        <div className='flex flex-row justify-end'>
            <button className='text-red-600'>Forgot Password?</button>
        </div>
        <div className='flex flex-row justify-between mt-12'>
        <button className='text-blue-700 text-3xl font-neutral'onClick={()=>{navigate('/register')}}>Sign Up?</button>
        <button 
        className='bg-blue-700 w-14 h-14 rounded-full flex flex-row items-center justify-center'

        onClick={handleLogin}>
            <FaArrowRight size={25} color='black'/>
        </button>
        </div>
        </div>
        </div>
    </div>
  )
}
