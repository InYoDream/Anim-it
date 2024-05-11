//left-prod

import React, { useContext, useState } from "react";
import {
    Pen,
    RectangleHorizontal,
    Move,
    Slash,
    Type,
    Undo,
    Redo,
    Circle,
    Eraser,
    Bot
} from "lucide-react";
import { ProdContext } from "../context/prodContext";

export default function Lprod() {
    const {
        setTool,
        undocall,
        redocall,
        setUndocall,
        setRedocall,
        setSelectedElement,
        setcolor,
        color,
    } = useContext(ProdContext);
    // Function to handle color selection
    const handleColorSelection = (event) => {
        const color = event.target.value;
        // Do something with the selected color, like setting it in the context
        console.log("Selected color:", color);
        setcolor(color);
    };

    return (
        <div className="w-[200px] bg-second p-2 flex items-center gap-8 flex-col">
            <p className="text-text-one font-bold">Tools</p>
            <div className="grid grid-cols-2 grid-rows-10 gap-8">
                <Pen
                    className="text-text-one hover:text-text-two size-8"
                    onClick={() => {
                        setTool("pencil");
                    }}
                />
                <RectangleHorizontal
                    className="text-text-one hover:text-text-two size-8"
                    onClick={() => {
                        setTool("rectangle");
                        setSelectedElement(null);
                    }}
                />
                <Eraser
                    className="text-text-one hover:text-text-two size-8"
                    onClick={() => {
                        setTool("eraser");
                    }}
                />
                <Move
                    className="text-text-one hover:text-text-two size-8"
                    onClick={() => {
                        setTool("selection");
                    }}
                />
                <Slash
                    className="text-text-one hover:text-text-two size-8"
                    onClick={() => {
                        setTool("line");
                    }}
                />
                <Type
                    className="text-text-one hover:text-text-two size-8"
                    onClick={() => {
                        setTool("text");
                    }}
                />
                <Circle
                    className="text-text-one hover:text-text-two size-8"
                    onClick={() => {
                        setTool("circle");
                    }}
                />
                <Bot className="text-text-one  hover:text-text-two size-8" onClick={() => { setTool("ai") }} />
                {/* Color picker */}
                <input
                    type="color"
                    onChange={handleColorSelection}
                    className="rounded-md p-1 border border-gray-300"
                />
            </div>
            <div className="w-full flex flex-row">
                <Undo
                    className="text-text-one hover:text-text-two size-8"
                    onClick={() => {
                        setUndocall(!undocall);
                    }}
                />
                <Redo
                    className="text-text-one hover:text-text-two size-8"
                    onClick={() => {
                        setRedocall(!redocall);
                    }}
                />
            </div>
        </div>
    );
}