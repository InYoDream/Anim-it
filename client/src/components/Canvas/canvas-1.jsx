import React, { useEffect, useRef, useState } from "react";

function DrawingCanvas() {
    const canvasRef = useRef(null);
    const [frames, setFrames] = useState([]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

    let stroke_color = "black";
    let stroke_width = "2";
    let is_drawing = false;

    function changeColor(element) {
        stroke_color = element.style.background;
    }

    function start(event) {
        is_drawing = true;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.beginPath();
        context.moveTo(getX(event), getY(event));
        event.preventDefault();
    }

    function draw(event) {
        if (is_drawing) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.lineTo(getX(event), getY(event));
            context.strokeStyle = stroke_color;
            context.lineWidth = stroke_width;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.stroke();
        }
        event.preventDefault();
    }

    function stop(event) {
        if (is_drawing) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.stroke();
            context.closePath();
            is_drawing = false;
            saveFrame(canvas);
        }
        event.preventDefault();
    }

    function saveFrame(canvas) {
        const frameCanvas = document.createElement("canvas");
        frameCanvas.width = canvas.width;
        frameCanvas.height = canvas.height;
        const context = frameCanvas.getContext("2d");
        context.drawImage(canvas, 0, 0);
        const newFrames = [...frames];
        newFrames[currentFrameIndex] = frameCanvas.toDataURL();
        setFrames(newFrames);
    }

    function clearCanvas() {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function addNewFrame() {
        const newFrames = [...frames, null];
        setFrames(newFrames);
        setCurrentFrameIndex(newFrames.length - 1);
    }
    //   useEffect(() => {
    //     redrawFrame(currentFrameIndex);
    //   }, [currentFrameIndex]);

    function switchFrame(index) {
        setCurrentFrameIndex(index);
        redrawFrame(index);
    }

    function redrawFrame(index) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (frames[index]) {
            const image = new Image();
            image.src = frames[index];
            image.onload = () => {
                context.drawImage(image, 0, 0);
            };
        }
    }

    function getX(event) {
        const canvas = canvasRef.current;
        if (event.pageX === undefined) {
            return event.targetTouches[0].pageX - canvas.offsetLeft;
        } else {
            return event.pageX - canvas.offsetLeft;
        }
    }

    function getY(event) {
        const canvas = canvasRef.current;
        if (event.pageY === undefined) {
            return event.targetTouches[0].pageY - canvas.offsetTop;
        } else {
            return event.pageY - canvas.offsetTop;
        }
    }

    return (
        <div className="w-full h-full bg-white">
            <canvas
                ref={canvasRef}
                id="canvas"
                onTouchStart={start}
                onTouchMove={draw}
                onTouchEnd={stop}
                onMouseDown={start}
                onMouseMove={draw}
                onMouseUp={stop}
                onMouseOut={stop}
                style={{ border: "1px solid black" }}
                className="w-full h-[60%]"
            />
            <div>
                <button onClick={clearCanvas}>Clear</button>
                <button onClick={addNewFrame}>Add New Frame</button>
                <div
                    onClick={(e) => changeColor(e.target)}
                    style={{ background: "red" }}
                    className="stroke-color"
                ></div>
                <div
                    onClick={(e) => changeColor(e.target)}
                    style={{ background: "blue" }}
                    className="stroke-color"
                ></div>
                <input
                    type="color"
                    onChange={(e) => (stroke_color = e.target.value)}
                    placeholder="Colors"
                />
            </div>
            <input
                type="range"
                min="1"
                max="100"
                onChange={(e) => (stroke_width = e.target.value)}
            />
            <div>
                {frames.map((_, index) => (
                    <button key={index} onClick={() => switchFrame(index)}>
                        Frame {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default DrawingCanvas;