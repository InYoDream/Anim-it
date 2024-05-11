import React, { useState } from 'react';

const Bezier = ({ viewBoxWidth, viewBoxHeight, startPoint, endPoint }) => {
    const [controlPoint, setControlPoint] = useState({ x: 0, y: 0 });
    const [draggingPointId, setDraggingPointId] = useState(null);

    const handleMouseDown = (pointId) => {
        setDraggingPointId(pointId);
    };

    const handleMouseUp = () => {
        setDraggingPointId(null);
    };

    const handleMouseMove = ({ clientX, clientY }) => {
        if (!draggingPointId) {
            return;
        }

        const svgRect = document.getElementById('canvas').getBoundingClientRect();

        const svgX = clientX - svgRect.left;
        const svgY = clientY - svgRect.top;

        const viewBoxX = svgX * viewBoxWidth / svgRect.width;
        const viewBoxY = svgY * viewBoxHeight / svgRect.height;

        setControlPoint({ x: viewBoxX, y: viewBoxY });
    };

    const instructions = `
    M ${startPoint.x},${startPoint.y}
    Q ${controlPoint.x},${controlPoint.y}
      ${endPoint.x},${endPoint.y}
  `;

    return (
        <svg
            id="canvas"
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ width: '100%', overflow: 'visible' }}
        >
            <ConnectingLine from={startPoint} to={controlPoint} />
            <ConnectingLine from={controlPoint} to={endPoint} />
            <Curve instructions={instructions} />
            <LargeHandle coordinates={startPoint} onMouseDown={() => handleMouseDown('startPoint')} />
            <LargeHandle coordinates={endPoint} onMouseDown={() => handleMouseDown('endPoint')} />
            <SmallHandle coordinates={controlPoint} onMouseDown={() => handleMouseDown('controlPoint')} />
        </svg>
    );
};

const ConnectingLine = ({ from, to }) => (
    <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="rgb(200, 200, 200)"
        strokeDasharray="5,5"
        strokeWidth={2}
    />
);

const Curve = ({ instructions }) => (
    <path
        d={instructions}
        fill="none"
        stroke="rgb(213, 0, 249)"
        strokeWidth={5}
    />
);

const LargeHandle = ({ coordinates, onMouseDown }) => (
    <ellipse
        cx={coordinates.x}
        cy={coordinates.y}
        rx={15}
        ry={15}
        fill="rgb(244, 0, 137)"
        onMouseDown={onMouseDown}
        style={{ cursor: '-webkit-grab' }}
    />
);

const SmallHandle = ({ coordinates, onMouseDown }) => (
    <ellipse
        cx={coordinates.x}
        cy={coordinates.y}
        rx={8}
        ry={8}
        fill="rgb(255, 255, 255)"
        stroke="rgb(244, 0, 137)"
        strokeWidth={2}
        onMouseDown={onMouseDown}
        style={{ cursor: '-webkit-grab' }}
    />
);

export default Bezier;
