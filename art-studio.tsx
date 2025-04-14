"use client"

import { useRef, useState } from "react"
import { Canvas } from "@/components/canvas"
import { Toolbar } from "@/components/toolbar"
import { StyleTransferProvider } from "@/components/style-transfer-provider"
import { CollaborationProvider } from "@/components/collaboration-provider"
import { LoadingSpinner } from "@/components/loading-spinner"
import { NFTExport } from "@/components/nft-export"

export function ArtStudio() {
  const [brushSize, setBrushSize] = useState(5)
  const [brushColor, setBrushColor] = useState("#000000")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [selectedModel, setSelectedModel] = useState("vanGogh")
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleClearCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  return (
    <StyleTransferProvider>
      <CollaborationProvider isActive={isCollaborating}>
        <div className="relative h-screen w-full overflow-hidden">
          {isProcessing && <LoadingSpinner />}

          <Canvas ref={canvasRef} brushSize={brushSize} brushColor={brushColor} isCollaborating={isCollaborating} />

          <Toolbar
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            brushColor={brushColor}
            setBrushColor={setBrushColor}
            onClearCanvas={handleClearCanvas}
            isCollaborating={isCollaborating}
            setIsCollaborating={setIsCollaborating}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            canvasRef={canvasRef}
          />

          <NFTExport canvasRef={canvasRef} />
        </div>
      </CollaborationProvider>
    </StyleTransferProvider>
  )
}
