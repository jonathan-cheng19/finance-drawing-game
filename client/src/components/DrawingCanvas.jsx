import { useRef, useEffect, useState } from 'react'
import './DrawingCanvas.css'

function DrawingCanvas({ onDraw, drawing, isHost }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState([])
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(3)

  // Drawing on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw existing paths
    if (drawing && drawing.length > 0) {
      drawing.forEach(path => {
        if (path.length < 2) return

        ctx.beginPath()
        ctx.strokeStyle = path[0].color || '#000000'
        ctx.lineWidth = path[0].size || 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        ctx.moveTo(path[0].x, path[0].y)
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y)
        }
        ctx.stroke()
      })
    }
  }, [drawing])

  const startDrawing = (e) => {
    if (!isHost) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setCurrentPath([{ x, y, color, size: brushSize }])
  }

  const draw = (e) => {
    if (!isDrawing || !isHost) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newPath = [...currentPath, { x, y, color, size: brushSize }]
    setCurrentPath(newPath)

    // Draw current path
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (currentPath.length > 0) {
      const prev = currentPath[currentPath.length - 1]
      ctx.moveTo(prev.x, prev.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (!isHost) return

    if (isDrawing && currentPath.length > 0) {
      const newDrawing = drawing ? [...drawing, currentPath] : [currentPath]
      onDraw(newDrawing)
    }

    setIsDrawing(false)
    setCurrentPath([])
  }

  const clearCanvas = () => {
    if (!isHost) return

    onDraw([])
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="drawing-canvas-container">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ cursor: isHost ? 'crosshair' : 'default' }}
      />

      {isHost && (
        <div className="drawing-controls">
          <div className="control-group">
            <label>Brush Size:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="brush-slider"
            />
            <span className="brush-size-value">{brushSize}px</span>
          </div>

          <div className="control-group">
            <label>Color:</label>
            <div className="color-picker">
              {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map(c => (
                <button
                  key={c}
                  className={`color-button ${color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <button className="btn btn-danger" onClick={clearCanvas}>
            Clear Canvas
          </button>
        </div>
      )}
    </div>
  )
}

export default DrawingCanvas
