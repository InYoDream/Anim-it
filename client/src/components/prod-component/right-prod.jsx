//right-prod

import React, { useContext, useEffect, useState } from "react";
import { ProdContext } from "../context/prodContext";

export default function Rprod() {
    const {
        tool,
        linewidth,
        setLinewidth,
        selectedElement,
        setSelectedElement,
    } = useContext(ProdContext);
    const [size, setSize] = useState(linewidth); // State to manage size

    // Update size when linewidth changes
    useEffect(() => {
        setSize(linewidth);
    }, [linewidth]);

    // Handle change in size
    function handleSizeChange(event) {
        setSize(event.target.value);
        setLinewidth(event.target.value);
    }

    function handlechange() {
        // if (selectedElement.type === "rectangle") {
        //     setSelectedElement(prev => ({
        //         ...prev,
        //         x1,
        //         x2,
        //         y1,
        //         y2
        //     }));
        // }
    }

    return (
        <div className="w-[350px] bg-second text-white">
            {tool === "pencil" || tool === "eraser" ? (
                <div className="overflow-hidden flex items-center justify-center">
                    <div className="flex flex-col">
                        <p className="text-text-two font-semibold mb-8 text-center">
                            Position
                        </p>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-row gap-2">
                                <p className="text-white">x1</p>
                                <input
                                    type="text"
                                    className="w-12 bg-second outline-none text-text-one"
                                    placeholder="32"
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="text-white">x1</p>
                                <input
                                    type="text"
                                    className="w-12 outline-none bg-second text-text-one"
                                    placeholder="32"
                                />
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={size}
                            onChange={handleSizeChange} // Call handleSizeChange on slider change
                        />
                    </div>
                    {/* <input className="text-black" type="text" onChange={(e) => { setLinewidth(parseInt(e.target.value)) }} /> */}
                </div>
            ) : (selectedElement && selectedElement.type === "rectangle") ||
                tool === "rectangle" ? (
                <div className="overflow-hidden flex items-center justify-center">
                    <div className="flex flex-col gap-4">
                        <p className="text-text-two font-semibold mb-8 text-center">
                            Position
                        </p>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-row gap-2">
                                <p className="text-white">x1</p>
                                <input
                                    type="text"
                                    className="w-12 bg-second outline-none text-text-one"
                                    onChange={(e) => {
                                        handlechange();
                                    }}
                                    value={selectedElement ? selectedElement.x1 : 0}
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="text-white">y1</p>
                                <input
                                    type="text"
                                    className="w-12 outline-none bg-second text-text-one"
                                    onChange={handlechange}
                                    placeholder={selectedElement ? selectedElement.y1 : 0}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-row gap-2">
                                <p className="text-white">x2</p>
                                <input
                                    type="text"
                                    className="w-12 bg-second outline-none text-text-one"
                                    onChange={handlechange}
                                    placeholder={selectedElement ? selectedElement.x2 : 0}
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="text-white">y2</p>
                                <input
                                    type="text"
                                    className="w-12 outline-none bg-second text-text-one"
                                    onChange={handlechange}
                                    placeholder={selectedElement ? selectedElement.y2 : 0}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <input className="text-black" type="text" onChange={(e) => { setLinewidth(parseInt(e.target.value)) }} /> */}
                </div>
            ) : (selectedElement && selectedElement.type === "line") ||
                tool === "line" ? (
                <div className="overflow-hidden flex items-center justify-center">
                    <div className="flex flex-col gap-4">
                        <p className="text-text-two font-semibold mb-8 text-center">
                            Position
                        </p>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-row gap-2">
                                <p className="text-white">x1</p>
                                <input
                                    type="text"
                                    className="w-12 bg-second outline-none text-text-one"
                                    onChange={(e) => {
                                        handlechange();
                                    }}
                                    value={selectedElement ? selectedElement.x1 : 0}
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="text-white">y1</p>
                                <input
                                    type="text"
                                    className="w-12 outline-none bg-second text-text-one"
                                    onChange={handlechange}
                                    placeholder={selectedElement ? selectedElement.y1 : 0}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-row gap-2">
                                <p className="text-white">x2</p>
                                <input
                                    type="text"
                                    className="w-12 bg-second outline-none text-text-one"
                                    onChange={handlechange}
                                    placeholder={selectedElement ? selectedElement.x2 : 0}
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <p className="text-white">y2</p>
                                <input
                                    type="text"
                                    className="w-12 outline-none bg-second text-text-one"
                                    onChange={handlechange}
                                    placeholder={selectedElement ? selectedElement.y2 : 0}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <input className="text-black" type="text" onChange={(e) => { setLinewidth(parseInt(e.target.value)) }} /> */}
                </div>
            ) : null}
        </div>
    );
}