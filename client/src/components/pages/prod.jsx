import React, { useState } from "react";
import { ProdContext } from "../context/prodContext";
import Lprod from "../prod-component/left-prod";
import Mprod from "../prod-component/mid-prod";
import Rprod from "../prod-component/right-prod";
import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";

export default function Production() {
    const [tool, setTool] = useState("selection");
    const [action, setAction] = useState("none");
    const [undocall, setUndocall] = useState(false);
    const [redocall, setRedocall] = useState(false);
    const [linewidth, setLinewidth] = useState(32);
    const [selectedElement, setSelectedElement] = useState(null);
    const [ele, setEle] = useState([])
    const [canvascontext, setCanvascontext] = useState(null)
    const [roughcanvas, setRoughcanvas] = useState()
    const generator = rough.generator();
    const [color,setColor] = useState("black")
    
    return (
        <div className="flex flex-row overflow-hidden w-screen h-screen">
            <ProdContext.Provider
                value={{
                    tool,
                    setTool,
                    undocall,
                    setRedocall,
                    setUndocall,
                    redocall,
                    linewidth,
                    setLinewidth,
                    action,
                    setAction,
                    selectedElement,
                    setSelectedElement,
                    ele,
                    setEle,
                    canvascontext, setCanvascontext,
                    roughcanvas, setRoughcanvas,
                    color,setColor
                }}
            >
                <Lprod />
                <Mprod />
                <Rprod />
            </ProdContext.Provider>
        </div>
    )
}