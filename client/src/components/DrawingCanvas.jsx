import { useRef, useEffect, useState } from 'react'
import { Button } from './ui/button'
import './DrawingCanvas.css'

function DrawingCanvas({ onDraw, drawing, isHost }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState([])
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(3)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)

  const colors = [
    { value: '#000000', name: 'Black' },
    { value: '#FF0000', name: 'Red' },
    { value: '#00FF00', name: 'Green' },
    { value: '#0000FF', name: 'Blue' },
    { value: '#FFFF00', name: 'Yellow' },
    { value: '#FF00FF', name: 'Magenta' },
    { value: '#00FFFF', name: 'Cyan' },
    { value: '#FFFFFF', name: 'White' },
  ]

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

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    return { x, y }
  }

  const startDrawing = (e) => {
    if (!isHost) return

    const { x, y } = getCanvasCoordinates(e)
    const newPath = [{ x, y, color, size: brushSize }]
    setIsDrawing(true)
    setCurrentPath(newPath)
    
    // Start a new path in the drawing array
    const newDrawing = drawing ? [...drawing, newPath] : [newPath]
    onDraw(newDrawing)
  }

  const handleMouseMove = (e) => {
    if (isHost) {
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    draw(e)
  }

  const draw = (e) => {
    if (!isDrawing || !isHost) return

    const { x, y } = getCanvasCoordinates(e)
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

    // Update the last path in the drawing array in real-time
    if (drawing && drawing.length > 0) {
      const newDrawing = [...drawing.slice(0, -1), newPath]
      onDraw(newDrawing)
    }
  }

  const stopDrawing = () => {
    if (!isHost) return

    // Path is already in the drawing array, just finalize it
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
    <div className="drawing-canvas-container bg-white rounded-lg overflow-hidden relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="drawing-canvas w-full"
        onMouseDown={startDrawing}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={() => { stopDrawing(); setShowCursor(false); }}
        onMouseEnter={() => setShowCursor(true)}
        style={{ cursor: isHost ? 'none' : 'default', display: 'block' }}
      />
      
      {/* Custom Cursor */}
      {isHost && showCursor && (
        <div
          className="custom-cursor"
          style={{
            position: 'absolute',
            left: cursorPos.x,
            top: cursorPos.y,
            width: brushSize * 2,
            height: brushSize * 2,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            backgroundColor: `${color}40`,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
        />
      )}

      {isHost && (
        <div className="drawing-controls bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Brush Size Control */}
            <div className="flex items-center gap-3">
              <label className="text-white font-medium text-sm">Brush:</label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="brush-slider w-32"
              />
              <span className="text-white font-bold bg-white/20 px-3 py-1 rounded-full text-sm">
                {brushSize}px
              </span>
            </div>

            {/* Color Picker */}
            <div className="flex items-center gap-2">
              <label className="text-white font-medium text-sm">Color:</label>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c.value}
                    className={`color-button w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      color === c.value ? 'border-white scale-110 ring-2 ring-white' : 'border-white/40'
                    }`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setColor(c.value)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Clear Button */}
            <Button variant="destructive" size="sm" onClick={clearCanvas}>
              🗑️ Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DrawingCanvas
