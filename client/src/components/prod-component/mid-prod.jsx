import React, { useContext } from "react";
import { ProdContext } from "../context/prodContext";
import Canvas from "../Canvas/Canvas";

export default function Mprod(){
    const {tool,setTool} = useContext(ProdContext)
    console.log(tool,"mid")
    return(
        <div className="w-full bg-[#1e1f22] h-full overflow-hidden flex justify-center items-center">
            <Canvas/>
            {/* <DrawingCanvas/> */}
        </div>
    )
}