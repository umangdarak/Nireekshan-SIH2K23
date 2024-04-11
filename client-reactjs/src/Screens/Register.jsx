import React, { useState } from 'react'
import {auth} from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";

export default function Register() {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [username,setUsername]=useState('');
    const [confirmP,setConfirmP]=useState('');
    const navigate=useNavigate();
    const handleRegister=()=>{
        if(email==''||password==''||username==''||confirmP==''){
            alert("Please Enter all the Details");
        }
        else{
            if(password===confirmP){
            try{
            RegisterUser(email,password,username);
            navigate('/login');
        }
            catch(e){
                alert("Please Try Again");
            }}
            else{
                alert("Passwords do not match")
            }
        }

    }
    const RegisterUser=async(email,password,username)=>{
        try{
        const {user}=await createUserWithEmailAndPassword(auth,email,password);
        await updateProfile(user,{displayName:username});}
        catch(e){
            alert("Failed to Register User.Please Try Again");
        }
    }
  return (
    <div  style={{background:'url(src/assets/Signin.png)',backgroundSize: 'cover',
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
        <div className='flex flex-row-reverse justify-between ml-10 '>
        <div className='flex flex-col mt-16 mr-20'>
            <h2 className='text-4xl font-normal'>Sign in</h2>
            <div className='h-12 my-5 bg-white rounded-xl w-80 ml-3'>
        <input type="text" placeholder="    Username" className="h-12  w-80 rounded-xl " 
        value={username} onChange={(e)=>setUsername(e.target.value)}
        />
        <div className='h-12 my-5 bg-white rounded-xl w-80'>
        <input type="email" placeholder="    Email" className="h-12  w-80 rounded-xl"
        value={email} onChange={(e)=>setEmail(e.target.value)}/></div>
        <div className='h-12 my-5 bg-white rounded-xl w-80'>
        <input type="password" placeholder="    Password" className="h-12  w-80 rounded-xl"
        value={password} onChange={(e)=>setPassword(e.target.value)}
        /></div>
         <div className='h-12 my-5 bg-white rounded-xl w-80'>
        <input type="password" placeholder="    Confirm Password" className="h-12  w-80 rounded-xl"
        value={confirmP} onChange={(e)=>setConfirmP(e.target.value)}
        /></div>
       <div className='flex flex-row justify-between mt-12'>
        <button className='text-blue-700 text-3xl font-neutral'onClick={()=>{navigate('/login')}}>Sign In?</button>
        <button 
        className='bg-blue-700 w-14 h-14 rounded-full flex flex-row items-center justify-center'

        onClick={handleRegister}>
            <FaArrowRight size={25} color='black'/>
        </button>
        </div>
        
        </div></div>
            <div className='flex flex-col items-center '>
                <div className='flex flex-col items-start'>
                <h1 className=' text-8xl text-white font-bold'>Welcome </h1>
                <h1 className=' text-8xl text-white font-bold'>to Nireekshan </h1></div>
                <div className='flex flex-col items-center justify-center'>
                <img src='src/assets/11.png' style={{width:450}}/>
                </div>
            </div></div>

        
    </div>
  )
}
