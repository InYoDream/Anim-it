import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function Dash() {
  const navigate = useNavigate();
  const [recent, setRecent] = useState(null)
  const handlenewfile = () => {
    navigate("/prod")
  }
  {/* <button className="ads alm arh arv avz awf axu bbm bbs bbw bce big bg-slate-700 rounded-full text-white *: p-3"  onClick={handlenewfile}>Production Page</button> */ }
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex flex-col bg-second w-full h-screen">
        <div className="flex flex-col h-[45%] p-12 gap-8 ">
          <p className="text-text-two font-semibold text-xl">Templates</p>
          <div className="w-full h-[60%] flex flex-row gap-8">
            <div className="flex">
              <div onClick={()=>{navigate('/prod')}} className="w-80 h-40 rounded-lg bg-green-100 border hover:scale-[1.05] transition-all duration-200 flex justify-center items-center hover:text-xl gap-2">
                <Plus className="text-black size-4" />
                Create New
              </div>
            </div>
            <div className="w-80 h-40 rounded-lg bg-green-100 border hover:scale-[1.05] transition-all duration-200 flex justify-center items-center hover:text-xl gap-2">
              Load Existing
            </div>
          </div>
        </div>
        <div className="flex justify-center ">
          <div className="w-[90%] border-border bg-homegreen h-[2px] rounded-lg"></div>
        </div>
        <div className="flex flex-col h-[45%] p-12 gap-8 ">
          <p className="text-text-two font-semibold text-xl">Recents</p>
          {
            recent && recent.lenght > 0 ? (
              <div></div>
            ) : (
              <div className="flex justify-center items-center text-1xl mt-12 text-text-one">
                No Recent work
              </div>
            )
          }
        </div>
      </div>
    </div >
  )
}