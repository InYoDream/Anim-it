//canvas.js
import { X } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
// import fabric from 'fabric'
import { fabric } from "fabric";

import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";
import { ProdContext } from "../context/prodContext";
import { Play, Plus, Pause } from "lucide-react";

const generator = rough.generator();
// const drawingAreaWidth = window.innerWidth / 2; // Define the width of the drawing area
// const drawingAreaHeight = window.innerHeight / 2; // Define the height of the drawing area

const createElement = (id, x1, y1, x2, y2, type, linewidth, color) => {
    switch (type) {
        case "line":
        case "rectangle":
            const roughElement =
                type === "line"
                    ? generator.line(x1, y1, x2, y2)
                    : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
            console.log(roughElement);
            // roughElement.op
            return { id, x1, y1, x2, y2, type, roughElement };
        case "circle":
            return { id, x1, y1, x2, y2, type };

        case "pencil":
            console.log(color);
            return { id, type, points: [{ x: x1, y: y1 }], linewidth: linewidth };
        case "eraser":
            return {
                id,
                type,
                points: [{ x: x1, y: y1 }],
                linewidth: linewidth,
                color: "#ffffff",
            };
        case "text":
            return { id, type, x1, y1, x2, y2, text: "" };
        default:
            throw new Error("Type not recognised: ${ type }");
    }
};

const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? "inside" : null;
};

const positionWithinElement = (x, y, element) => {
    const { type, x1, x2, y1, y2 } = element;
    switch (type) {
        case "line":
            const on = onLine(x1, y1, x2, y2, x, y);
            const start = nearPoint(x, y, x1, y1, "start");
            const end = nearPoint(x, y, x2, y2, "end");
            return start || end || on;
        case "rectangle":
            const topLeft = nearPoint(x, y, x1, y1, "tl");
            const topRight = nearPoint(x, y, x2, y1, "tr");
            const bottomLeft = nearPoint(x, y, x1, y2, "bl");
            const bottomRight = nearPoint(x, y, x2, y2, "br");
            const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
            return topLeft || topRight || bottomLeft || bottomRight || inside;
        case "circle":
            const distanceFromCenter = Math.sqrt((x - x1) * 2 + (y - y1) * 2);
            const radius = Math.sqrt((x1 - x2) * 2 + (y2 - y1) * 2);
            const insideCircle = distanceFromCenter <= radius;
            return insideCircle ? "inside" : null;
        case "pencil":
            const betweenAnyPoint = element.points.some((point, index) => {
                const nextPoint = element.points[index + 1];
                if (!nextPoint) return false;
                return (
                    onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
                );
            });
            return betweenAnyPoint ? "inside" : null;
        case "eraser":
            const betweenAnyPointe = element.points.some((point, index) => {
                const nextPoint = element.points[index + 1];
                if (!nextPoint) return false;
                return (
                    onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null
                );
            });
            return betweenAnyPointe ? "inside" : null;
        case "text":
            return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
        default:
            throw new Error("Type not recognised: ${ type }");
    }
};

const distance = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
    return elements
        .map((element) => ({
            ...element,
            position: positionWithinElement(x, y, element),
        }))
        .find((element) => element.position !== null);
};

const adjustElementCoordinates = (element) => {
    const { type, x1, y1, x2, y2 } = element;
    if (type === "rectangle") {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
        if (x1 < x2 || (x1 === x2 && y1 < y2)) {
            return { x1, y1, x2, y2 };
        } else {
            return { x1: x2, y1: y2, x2: x1, y2: y1 };
        }
    }
};

const cursorForPosition = (position) => {
    switch (position) {
        case "tl":
        case "br":
        case "start":
        case "end":
            return "nwse-resize";
        case "tr":
        case "bl":
            return "nesw-resize";
        default:
            return "move";
    }
};

const resizedCoordinates = (clientX, clientY, position, coordinates) => {
    const { x1, y1, x2, y2 } = coordinates;
    switch (position) {
        case "tl":
        case "start":
            return { x1: clientX, y1: clientY, x2, y2 };
        case "tr":
            return { x1, y1: clientY, x2: clientX, y2 };
        case "bl":
            return { x1: clientX, y1, x2, y2: clientY };
        case "br":
        case "end":
            return { x1, y1, x2: clientX, y2: clientY };
        default:
            return null; //should not really get here...
    }
};

const useHistory = (initialState) => {
    const [index, setIndex] = useState(0);
    const [history, setHistory] = useState([initialState]);

    const setState = (action, overwrite = false) => {
        const newState =
            typeof action === "function" ? action(history[index]) : action;
        if (overwrite) {
            const historyCopy = [...history];
            historyCopy[index] = newState;
            setHistory(historyCopy);
        } else {
            const updatedState = [...history].slice(0, index + 1);
            setHistory([...updatedState, newState]);
            setIndex((prevState) => prevState + 1);
        }
    };

    const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
    const redo = () =>
        index < history.length - 1 && setIndex((prevState) => prevState + 1);
    // console.log(history)
    return [history[index], setState, undo, redo];
};

const getSvgPathFromStroke = (stroke) => {
    if (!stroke.length) return "";

    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
};
const drawElement = (
    roughCanvas,
    context,
    element,
    linewidth,
    selectedElement,
    cur_element_thinning,
    color
) => {
    switch (element.type) {
        case "line":
        case "rectangle":
            if (selectedElement && selectedElement.id === element.id) {
                element.roughElement.options.stroke = "#0000ff";
            } else {
                element.roughElement.options.stroke = "#000";
            }
            roughCanvas.draw(element.roughElement);
            break;
        case "circle":
            console.log(element);
            const radius = Math.abs(element.x2 - element.x1) / 2;
        // roughCanvas.circle(element.x1, element.y1, radius);

        case "pencil":
            console.log("Eraser color:", element.color); // Check if color is passed correctly
            // Explicitly set the color to white
            context.fillStyle = element.color || "black";
            const stroke = getSvgPathFromStroke(
                getStroke(element.points, {
                    size: element.linewidth,
                    thinning: 0.7,
                    color: element.color,
                })
            );
            context.fill(new Path2D(stroke));
            break;
        case "eraser":
            console.log("Eraser color:", element.color); // Check if color is passed correctly
            // Explicitly set the color to white
            context.fillStyle = element.color || "#ffffff";
            const strokes = getSvgPathFromStroke(
                getStroke(element.points, {
                    size: element.linewidth,
                    thinning: 0.7,
                })
            );
            context.fill(new Path2D(strokes));
            break;

        case "text":
            context.textBaseline = "top";
            context.font = "24px sans-serif";
            context.fillText(element.text, element.x1, element.y1);
            break;
        default:
            throw new Error("Type not recognised: ${ element.type }");
    }
};

const adjustmentRequired = (type) => ["line", "rectangle"].includes(type);

const usePressedKeys = () => {
    const [pressedKeys, setPressedKeys] = useState(new Set());

    useEffect(() => {
        const handleKeyDown = (event) => {
            setPressedKeys((prevKeys) => new Set(prevKeys).add(event.key));
        };

        const handleKeyUp = (event) => {
            setPressedKeys((prevKeys) => {
                const updatedKeys = new Set(prevKeys);
                updatedKeys.delete(event.key);
                return updatedKeys;
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return pressedKeys;
};

// // Function to get mouse coordinates relative to the drawing area
// const getMouseCoordinates = event => {
//   const clientX = event.clientX - panOffset.x;
//   const clientY = event.clientY - panOffset.y;
//   return { clientX, clientY };
// };

export default function Canvas() {
    const [elements, setElements, undo, redo] = useHistory([]);
    const [currframe, setCurrframe] = useState(null);
    const [genai, setGenai] = useState("");
    // const [brush_width, set_brush_width] = useState(0.9);
    // const [action, setAction] = useState("none");
    // const [tool, setTool] = useState("rectangle");
    const [frame, setFrame] = useState([]);
    const canvasref = useRef(null);
    const {
        tool,
        setTool,
        undocall,
        redocall,
        linewidth,
        action,
        setAction,
        selectedElement,
        setSelectedElement,
        color,
    } = useContext(ProdContext);
    const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
    const [startPanMousePosition, setStartPanMousePosition] = React.useState({
        x: 0,
        y: 0,
    });
    const textAreaRef = useRef();
    const pressedKeys = usePressedKeys();
    const [isplaying, setisplaying] = useState(false);
    const [playLinePosition, setPlayLinePosition] = useState(0);

    useEffect(() => {
        undo();
    }, [undocall]);
    useEffect(() => {
        redo();
    }, [redocall]);

    useEffect(() => {
        const canvas = document.getElementById("canvas");
        const ok = document.getElementById("maindiv");
        // Disable panning on the canvas
        const handleWheel = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        const handleMouseDown = (event) => {
            event.preventDefault();
        };

        canvas.addEventListener("mousedown", handleMouseDown);
        // canvas.addEventListener("wheel", handleWheel, { passive: false }); // { passive: false } to ensure preventDefault works
        // ok.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            canvas.removeEventListener("mousedown", handleMouseDown);
            // canvas.removeEventListener("wheel", handleWheel, { passive: false });
            // ok.addEventListener("wheel", handleWheel, { passive: false });
        };
    }, []);

    useLayoutEffect(() => {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        const roughCanvas = rough.canvas(canvas);
        generator.rectangle(10, 120, 100, 100, { fill: "red" });
        context.clearRect(0, 0, canvas.width, canvas.height);
        const cur_element_thinning = linewidth;
        // console.log("LLLL", linewidth);

        context.save();
        context.translate(panOffset.x, panOffset.y);
        console.log(elements);
        elements.forEach((element) => {
            if (
                selectedElement &&
                action === "writing" &&
                selectedElement.id === element.id
            )
                return;
            console.log("COLOR", color);
            drawElement(
                roughCanvas,
                context,
                element,
                linewidth,
                selectedElement,
                cur_element_thinning,
                color
            );
        });
        context.restore();
    }, [elements, action, selectedElement, panOffset]);

    useEffect(() => {
        const undoRedoFunction = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "z") {
                if (event.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            }
        };

        document.addEventListener("keydown", undoRedoFunction);
        return () => {
            document.removeEventListener("keydown", undoRedoFunction);
        };
    }, [undo, redo]);

    useEffect(() => {
        console.log("change ", elements);
    }, [elements]);

    useEffect(() => {
        const panFunction = (event) => {
            setPanOffset((prevState) => ({
                x: prevState.x - event.deltaX,
                y: prevState.y - event.deltaY,
            }));
        };

        // document.addEventListener("wheel", panFunction);
        return () => {
            // document.removeEventListener("wheel", panFunction);
        };
    }, []);
    useEffect(() => {
        const textArea = textAreaRef.current;
        if (action === "writing") {
            setTimeout(() => {
                textArea.focus();
                textArea.value = selectedElement.text;
            }, 0);
        }
    }, [action, selectedElement]);

    const updateElement = (
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        options,
        linewidth,
        color
    ) => {
        const elementsCopy = [...elements];
        // console.log({x1,y1,x2,y2})
        // x2=x2-75;
        switch (type) {
            case "line":
            case "rectangle":
                elementsCopy[id] = createElement(
                    id,
                    x1,
                    y1,
                    x2,
                    y2,
                    type,
                    linewidth,
                    color
                );
                break;
            case "circle":
                elementsCopy[id] = createElement();
            case "pencil":
                elementsCopy[id].points = [
                    ...elementsCopy[id].points,
                    { x: x2, y: y2 },
                ];
                break;
            case "eraser":
                elementsCopy[id].points = [
                    ...elementsCopy[id].points,
                    { x: x2, y: y2 },
                ];
                break;
            case "text":
                const textWidth = document
                    .getElementById("canvas")
                    .getContext("2d")
                    .measureText(options.text).width;
                const textHeight = 24;
                elementsCopy[id] = {
                    ...createElement(
                        id,
                        x1,
                        y1,
                        x1 + textWidth,
                        y1 + textHeight,
                        type,
                        linewidth,
                        color
                    ),
                    text: options.text,
                };
                break;
            default:
                throw new Error("Type not recognised: ${ type }");
        }

        setElements(elementsCopy, true);
        setSelectedElement((prev) => ({
            ...prev,
            x1,
            y1,
            x2,
            y2,
        }));
    };

    const getMouseCoordinates = (event) => {
        // console.log(event.pageX)
        // console.log(event.pageY,"pagey")
        // console.
        const val = canvasref.current.offsetLeft;
        // console.log(val)
        // console.logg
        // console.log(event.clientX,panOffset.x)
        // console.log(panOffset.x,panOffset.y)
        let clientX = event.clientX - panOffset.x;
        let clientY = event.clientY - panOffset.y;
        // console.log({clientX,clientY})
        clientX = clientX - val;
        clientY = clientY;
        return { clientX, clientY };
    };

    const handleMouseDown = (event) => {
        if (action === "writing") return;

        const { clientX, clientY } = getMouseCoordinates(event);

        // // Check if the mouse is within the drawing area
        // if (!isInDrawingArea(clientX, clientY)) {
        //   return;
        // }

        if (event.button === 1 || pressedKeys.has(" ")) {
            setAction("panning");
            setStartPanMousePosition({ x: clientX, y: clientY });
            return;
        }

        if (tool === "selection") {
            const element = getElementAtPosition(clientX, clientY, elements);
            if (element) {
                if (element.type === "pencil") {
                    const xOffsets = element.points.map((point) => clientX - point.x);
                    const yOffsets = element.points.map((point) => clientY - point.y);
                    setSelectedElement({ ...element, xOffsets, yOffsets });
                } else if (element.type === "eraser") {
                    const xOffsets = element.points.map((point) => clientX - point.x);
                    const yOffsets = element.points.map((point) => clientY - point.y);
                    setSelectedElement({ ...element, xOffsets, yOffsets });
                } else {
                    const offsetX = clientX - element.x1;
                    const offsetY = clientY - element.y1;
                    setSelectedElement({ ...element, offsetX, offsetY });
                }
                setElements((prevState) => prevState);

                if (element.position === "inside") {
                    setAction("moving");
                } else {
                    setAction("resizing");
                }
            } else {
                setSelectedElement(null);
            }
        } else {
            const id = elements.length;
            const element = createElement(
                id,
                clientX,
                clientY,
                clientX,
                clientY,
                tool,
                linewidth
            );
            setElements((prevState) => [...prevState, element]);
            setSelectedElement(element);

            setAction(tool === "text" ? "writing" : "drawing");
        }
    };

    const handleMouseMove = (event) => {
        const { clientX, clientY } = getMouseCoordinates(event);

        // // Check if the mouse is within the drawing area
        // if (!isInDrawingArea(clientX, clientY)) {
        //   return;
        // }

        if (action === "panning") {
            const deltaX = clientX - startPanMousePosition.x;
            const deltaY = clientY - startPanMousePosition.y;
            setPanOffset({
                x: panOffset.x + deltaX,
                y: panOffset.y + deltaY,
            });
            return;
        }

        if (tool === "selection") {
            const element = getElementAtPosition(clientX, clientY, elements);
            event.target.style.cursor = element
                ? cursorForPosition(element.position)
                : "default";
        }

        if (action === "drawing") {
            const index = elements.length - 1;
            const { x1, y1 } = elements[index];
            updateElement(index, x1, y1, clientX, clientY, tool, linewidth);
        } else if (action === "moving") {
            if (
                selectedElement.type === "pencil" ||
                selectedElement.type === "eraser"
            ) {
                const newPoints = selectedElement.points.map((_, index) => ({
                    x: clientX - selectedElement.xOffsets[index],
                    y: clientY - selectedElement.yOffsets[index],
                }));
                const elementsCopy = [...elements];
                elementsCopy[selectedElement.id] = {
                    ...elementsCopy[selectedElement.id],
                    points: newPoints,
                };
                setElements(elementsCopy, true);
            } else {
                const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
                const width = x2 - x1;
                const height = y2 - y1;
                const newX1 = clientX - offsetX;
                const newY1 = clientY - offsetY;
                const options = type === "text" ? { text: selectedElement.text } : {};
                updateElement(
                    id,
                    newX1,
                    newY1,
                    newX1 + width,
                    newY1 + height,
                    type,
                    options,
                    linewidth
                );
            }
        } else if (action === "resizing") {
            const { id, type, position, ...coordinates } = selectedElement;
            const { x1, y1, x2, y2 } = resizedCoordinates(
                clientX,
                clientY,
                position,
                coordinates
            );
            updateElement(id, x1, y1, x2, y2, type, linewidth);
        }
    };

    const handleMouseUp = (event) => {
        const { clientX, clientY } = getMouseCoordinates(event);

        // // Check if the mouse is within the drawing area
        // if (!isInDrawingArea(clientX, clientY)) {
        //   return;
        // }

        if (selectedElement) {
            if (
                selectedElement.type === "text" &&
                clientX - selectedElement.offsetX === selectedElement.x1 &&
                clientY - selectedElement.offsetY === selectedElement.y1
            ) {
                setAction("writing");
                return;
            }

            const index = selectedElement.id;
            const { id, type } = elements[index];
            if (
                (action === "drawing" || action === "resizing") &&
                adjustmentRequired(type)
            ) {
                const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
                updateElement(id, x1, y1, x2, y2, type);
            }
        }

        if (action === "writing") return;

        setAction("none");
        // setSelectedElement(null);
    };

    const handleBlur = (event) => {
        const { id, x1, y1, type } = selectedElement;
        setAction("none");
        setSelectedElement(null);
        updateElement(
            id,
            x1,
            y1,
            null,
            null,
            type,
            { text: event.target.value },
            linewidth
        );
    };

    const handlechange = (index) => {
        if (currframe !== null && frame[currframe] !== elements) {
            console.log(currframe, frame[currframe], elements, "if");
            alert("changed");
            const newFrame = [...frame];
            newFrame[currframe] = elements;
            setFrame(newFrame);
        }
        console.log(frame, index);
        setCurrframe(index);
        setElements(frame[index]);
    };

    const handleadd = () => {
        if (currframe !== null && frame[currframe] !== elements) {
            // If the current frame is not null and its content has changed
            const newFrame = [...frame];
            // Insert the new frame after the current frame
            newFrame.splice(currframe, 0, elements);
            setFrame(newFrame);
            setCurrframe(currframe + 1);
        } else if (currframe !== null && frame[currframe] === elements) {
            // If the current frame is not null and its content is unchanged
            setCurrframe(null);
            setElements(frame.length > 0 ? frame[frame.length - 1] : []);
        } else {
            // If there is no current frame (i.e., the canvas is empty)
            const newFrame = [...frame];
            newFrame.push(elements);
            setFrame(newFrame);
            setCurrframe(newFrame.length - 1);
        }
    };

    const toggle_play = () => {
        setisplaying(!isplaying);
    };

    useEffect(() => {
        console.log(frame);
    }, [frame]);

    useEffect(() => {
        let timeoutId;

        const updatePlayLinePosition = () => {
            const maxPosition = (frame.length + 2) * 36.1; // Calculate maximum position
            const newPosition = playLinePosition + 36.1; // Increment by frame width (36.1 pixels)

            if (newPosition < maxPosition) {
                // Update play line position if it's within the maximum position
                setPlayLinePosition(newPosition);
                timeoutId = setTimeout(updatePlayLinePosition, 100); // Update every 100 milliseconds
            } else {
                // Clear timeout and reset play line position if it reaches the end
                clearTimeout(timeoutId);
                setPlayLinePosition(0);
                toggle_play(); // Stop playback
            }
        };

        if (isplaying) {
            // Start updating play line position
            timeoutId = setTimeout(updatePlayLinePosition, 100);
        } else {
            // Clear timeout if playback is stopped
            clearTimeout(timeoutId);
        }

        return () => clearTimeout(timeoutId); // Cleanup function
    }, [isplaying, frame.length, playLinePosition, toggle_play]);

    useEffect(() => {
        let timeoutId;

        const updatePlayLinePosition = () => {
            const maxPosition = (frame.length + 2) * 36.1; // Calculate maximum position
            const newPosition = playLinePosition + 36.1; // Increment by frame width (36.1 pixels)

            if (newPosition < maxPosition) {
                // Update play line position if it's within the maximum position
                setPlayLinePosition(newPosition);
                timeoutId = setTimeout(updatePlayLinePosition, 100); // Update every 100 milliseconds

                // Play the frame
                const currentFrameIndex = Math.floor(newPosition / 36.1) - 1; // Calculate the current frame index
                if (currentFrameIndex >= 0 && currentFrameIndex < frame.length) {
                    setElements(frame[currentFrameIndex]); // Set canvas elements to the current frame
                }
            } else {
                // Clear timeout and reset play line position if it reaches the end
                clearTimeout(timeoutId);
                setPlayLinePosition(0);
                toggle_play(); // Stop playback
            }
        };

        if (isplaying) {
            // Start updating play line position
            timeoutId = setTimeout(updatePlayLinePosition, 100);
        } else {
            // Clear timeout if playback is stopped
            clearTimeout(timeoutId);
        }

        return () => clearTimeout(timeoutId); // Cleanup function
    }, [isplaying, frame.length, playLinePosition, toggle_play]);

    const handleprompt = async () => {
        const data= new URLSearchParams();
        data.append('string',svg)
        await axios.post("https://4jns4l83-5000.inc1.devtunnels.ms/process-prompt", data)
            .then((res) => {
                console.log(res);
                console.log(res.data.extracted_text)
                // renderSVG({ svg: })
                console.log(svg,"svg")
                renderSVG({svg:res.data.extracted_text})
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const [svg, setSvg] = useState('')
    function renderSVG({svg}) {
        // const canvasElement = document.getElementById('canvas');
        console.log(svg)
        const canvas = new fabric.Canvas('canvas');

        fabric.loadSVGFromString(svg, function (objects, options) {
            const svgObject = fabric.util.groupSVGElements(objects, options);

            // yahan pe canvas ke center position ko store krega 
            svgObject.set({
                left: (canvas.width / 2 - svgObject.width / 2) - 170,
                top: (canvas.height / 2 - svgObject.height / 2) - 40,
                zoomX: 0.5,
                zoomY: 0.5
            });
            console.log(svgObject)
            // aur yahan canvas ke center position pe render kar dega svg img ko 
            canvas.add(svgObject);
            canvas.renderAll();
            console.log("done")
        });
    }
    return (
        <div
            ref={canvasref}
            id="maindiv"
            className="bg-first w-full flex flex-col justify-center h-full"
        >
            {
                tool === "ai" && <div className="inset-0 absolute bg-first z-50 bg-opacity-70 w-screen flex justify-center h-screen">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 10 }}
                        className="bg-third w-[40%] rounded-xl h-[10%] p-4 justify-center items-center flex flex-row"
                    >
                        <input onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleprompt();
                                // renderSVG()
                            }
                        }} onChange={(e) => {
                            setSvg(e.target.value)
                        }}
                            placeholder="Enter a Prompt for GenAI" className="w-[90%] h-full bg-transparent pl-2 outline-none text-white" />
                        <X className="size-8 text-text-one  hover:text-text-two" onClick={() => { setTool('selection') }} />
                    </motion.div>
                </div>
            }
            {/* <div style={{ position: "fixed", zIndex: 2 }}>
                <input
                    type="radio"
                    id="selection"
                    checked={tool === "selection"}
                    onChange={() => setTool("selection")}
                />
                <label htmlFor="selection">Selection</label>
                <input type="radio" id="line" checked={tool === "line"} onChange={() => setTool("line")} />
                <label htmlFor="line">Line</label>
                <input
                    type="radio"
                    id="rectangle"
                    checked={tool === "rectangle"}
                    onChange={() => setTool("rectangle")}
                />
                <label htmlFor="rectangle">Rectangle</label>
                <input
                    type="radio"
                    id="pencil"
                    checked={tool === "pencil"}
                    onChange={() => setTool("pencil")}
                />
                <label htmlFor="pencil">Pencil</label>
                <input type="radio" id="text" checked={tool === "text"} onChange={() => setTool("text")} />
                <label htmlFor="text">Text</label>
            </div>
            <div style={{ position: "fixed", zIndex: 2, bottom: 0, padding: 10 }}>
                <button onClick={undo}>Undo</button>
                <button onClick={redo}>Redo</button>
            </div> */}
            {action === "writing" ? (
                <textarea
                    ref={textAreaRef}
                    onBlur={handleBlur}
                    style={{
                        position: "fixed",
                        top: selectedElement.y1 - 2 + panOffset.y,
                        left: selectedElement.x1 + panOffset.x,
                        font: "24px sans-serif",
                        margin: 0,
                        padding: 0,
                        border: 0,
                        outline: 0,
                        resize: "auto",
                        overflow: "hidden",
                        whiteSpace: "pre",
                        background: "transparent",
                        zIndex: 2,
                    }}
                />
            ) : null}
            <div
                className="border mb-auto rounded-lg border-2px bg-second"
                style={{ height: 1550, overflow: "hidden", position: "relative" }}
            >
                <canvas
                    id="canvas"
                    // ref={canvasref}
                    width={window.innerWidth} // Set your desired width here
                    height={window.innerHeight / 1.3} // Set your desired height here
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    className="border-2px rounded-2xl border  "
                    style={{ border: '1px solid #ccc'  }}
                >
                </canvas>
                {/* <canvas id="canvas" width={window.innerWidth} height={window.innerHeight / 1.3} ></canvas> */}
            </div>
            <div className="text-white relative">
                <button onClick={handleadd}>
                    <Plus />
                </button>
                <button className="ml-3" onClick={toggle_play}>
                    {isplaying ? <Pause /> : <Play />}
                </button>
                <div className="flex overflow-x-auto border-2 pd-80">
                    {frame &&
                        frame.map((val, index) => (
                            <div
                                className={
                                    index === currframe
                                        ? "m-1 bg-orange-500 w-8 h-24 text-center pt-8"
                                        : "m-1 bg-gray-500 w-8 h-24 text-center pt-8"
                                }
                                key={index}
                                onClick={() => {
                                    handlechange(index);
                                }}
                            >
                                {index}
                            </div>
                        ))}
                    {
                        <div
                            className="absolute top-[34px] left-0 bg-red-500 h-24"
                            style={{
                                width: "8px",
                                transform: `translateX(${playLinePosition}px)`,
                            }}
                        ></div>
                    }
                </div>
            </div>
        </div>
    );
}
// import React, { useState } from 'react';
// import { fabric } from 'fabric';

// function Canvas() {
//     const [svgString, setSvgString] = useState('');

//     function renderSVG() {
//         const canvas = new fabric.Canvas('existingCanvas');

//         // svg string pass krke ek fabric object bann jayga , svgString mein ek ek krke pura array pass kr de and saare frames generate ho jaynge
//         fabric.loadSVGFromString(svgString, function (objects, options) {
//             const svgObject = fabric.util.groupSVGElements(objects, options);

//             // yahan pe canvas ke center position ko store krega
//             svgObject.set({
//                 left: canvas.width / 2 - svgObject.width / 2,
//                 top: canvas.height / 2 - svgObject.height / 2
//             });

//             // aur yahan canvas ke center position pe render kar dega svg img ko
//             canvas.add(svgObject);
//             canvas.renderAll();
//         });
//     }

//     return (
//         <div>
//             <textarea
//                 value={svgString}
//                 onChange={(e) => setSvgString(e.target.value)}
//                 placeholder="Paste SVG here"
//                 style={{ width: '100%', height: '100px', marginBottom: '10px' }}
//             />
//             <button onClick={renderSVG}>Render SVG</button>
//             {/* <canvas id="existingCanvas" width="800" height="400" style={{ border: '1px solid #ccc' }}></canvas>
//              */}
//             <canvas
//                 id="existingCanvas"
//                 // ref={canvasref}
//                 width={800} // Set your desired width here
//                 height={400} // Set your desired height here
//                 // onMouseDown={handleMouseDown}
//                 // onMouseMove={handleMouseMove}
//                 // onMouseUp={handleMouseUp}
//                 className="border-2px rounded-2xl border bg-green-500"
//                 style={{ border: '1px solid #ccc' }}
//             >
//                 Canvas
//             </canvas>
//         </div>
//     );
// }

// export default Canvas;