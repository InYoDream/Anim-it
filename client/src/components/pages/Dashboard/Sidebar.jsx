import React from 'react';
import { useNavigate } from "react-router-dom";
import {CirclePlus} from "lucide-react";
import { LogOut , Users ,Plus } from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
    const handlenewfile=()=>{
        navigate("/prod")
    }


  return (
    <div className='h-screen w-[15%] bg-first'>
      <div className='w-full h-[90%]'>
        <div className='flex items-center p-4 text-text-two gap-4 font-semibold text-xl'>
          <img src={require('../../../images/2.png')} className='rounded-full w-12 h-12' alt="" />
          Vikrant Rana
        </div>
        <div className='w-full h-full p-4 flex flex-col gap-4 mt-8'>
          <div className='flex gap-4 text-text-three hover:text-text-two transition-all duration-100' onClick={()=>{navigate('/prod')}}>
            <Plus/>
            Create New 
          </div>
          <div className='flex gap-4 text-text-three hover:text-text-two transition-all duration-100' onClick={()=>{navigate('/collab')}}>
            <Users/>
            Community Dash
          </div>
        </div>
      </div>
      <div className='flex flex-row text-white mb-auto justify-center gap-4 hover:bg-third h-[10%] items-center ' onClick={()=>{navigate('/')}}>
        <LogOut/>
        LogOut
      </div>
    </div>
  );
}

export default Sidebar;
