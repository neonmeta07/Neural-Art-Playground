"use client"

import type React from "react"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { useCollaboration } from "@/hooks/use-collaboration"
import { useMobile } from "@/hooks/use-mobile"

interface CanvasProps {
  brushSize: number
  brushColor: string
  isCollaborating: boolean
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(function Canvas(
  { brushSize, brushColor, isCollaborating },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const { isMobile } = useMobile()
  const { broadcastStroke, receiveStrokes } = useCollaboration()

  // Forward the canvas ref
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Restore any saved drawing after resize
      const savedData = localStorage.getItem("canvasData")
      if (savedData) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
        }
        img.src = savedData
        img.crossOrigin = "anonymous"
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Handle collaboration mode
  useEffect(() => {
    if (!isCollaborating) return

    const handleReceivedStrokes = (stroke: any) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.beginPath()
      ctx.moveTo(stroke.startX, stroke.startY)
      ctx.lineTo(stroke.endX, stroke.endY)
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.size
      ctx.lineCap = "round"
      ctx.stroke()
    }

    const unsubscribe = receiveStrokes(handleReceivedStrokes)
    return unsubscribe
  }, [isCollaborating, receiveStrokes])

  // Save canvas data periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const canvas = canvasRef.current
      if (canvas) {
        localStorage.setItem("canvasData", canvas.toDataURL())
      }
    }, 5000) // Save every 5 seconds

    return () => clearInterval(saveInterval)
  }, [])

  const startDrawing = (x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(x, y)

    // Store the last position for drawing
    const lastPos = { x, y }
    return lastPos
  }

  const draw = (x: number, y: number, lastPos: { x: number; y: number }) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.stroke()

    // Broadcast stroke in collaboration mode
    if (isCollaborating) {
      broadcastStroke({
        startX: lastPos.x,
        startY: lastPos.y,
        endX: x,
        endY: y,
        color: brushColor,
        size: brushSize,
      })
    }

    return { x, y }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const lastPos = startDrawing(x, y)
    if (lastPos) {
      canvasRef.current?.setAttribute("data-last-x", lastPos.x.toString())
      canvasRef.current?.setAttribute("data-last-y", lastPos.y.toString())
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const lastX = Number.parseFloat(canvasRef.current?.getAttribute("data-last-x") || "0")
    const lastY = Number.parseFloat(canvasRef.current?.getAttribute("data-last-y") || "0")

    const newLastPos = draw(x, y, { x: lastX, y: lastY })
    if (newLastPos) {
      canvasRef.current?.setAttribute("data-last-x", newLastPos.x.toString())
      canvasRef.current?.setAttribute("data-last-y", newLastPos.y.toString())
    }
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const lastPos = startDrawing(x, y)
    if (lastPos) {
      canvasRef.current?.setAttribute("data-last-x", lastPos.x.toString())
      canvasRef.current?.setAttribute("data-last-y", lastPos.y.toString())
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()

    if (!isDrawing) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const lastX = Number.parseFloat(canvasRef.current?.getAttribute("data-last-x") || "0")
    const lastY = Number.parseFloat(canvasRef.current?.getAttribute("data-last-y") || "0")

    const newLastPos = draw(x, y, { x: lastX, y: lastY })
    if (newLastPos) {
      canvasRef.current?.setAttribute("data-last-x", newLastPos.x.toString())
      canvasRef.current?.setAttribute("data-last-y", newLastPos.y.toString())
    }
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full bg-white touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={stopDrawing}
    />
  )
})
