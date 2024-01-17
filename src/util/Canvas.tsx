const Canvas = (handleClick:any, CanvasRef:any, width:number, height:number) =>{
    
    return (
        <canvas
            width={width}
            height={height}
            onClick={handleClick}
            style={canvasStyle}
            ref={CanvasRef}
        />)
}

export default Canvas;

const canvasStyle = {
    border: "1px solid black"
}