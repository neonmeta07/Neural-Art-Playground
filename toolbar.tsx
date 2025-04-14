"use client"

import type React from "react"

import { useState } from "react"
import { Paintbrush, Trash2, Users, Wand2, ChevronUp, ChevronDown, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useStyleTransfer } from "@/hooks/use-style-transfer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"

interface ToolbarProps {
  brushSize: number
  setBrushSize: (size: number) => void
  brushColor: string
  setBrushColor: (color: string) => void
  onClearCanvas: () => void
  isCollaborating: boolean
  setIsCollaborating: (isCollaborating: boolean) => void
  isProcessing: boolean
  setIsProcessing: (isProcessing: boolean) => void
  selectedModel: string
  setSelectedModel: (model: string) => void
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export function Toolbar({
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  onClearCanvas,
  isCollaborating,
  setIsCollaborating,
  isProcessing,
  setIsProcessing,
  selectedModel,
  setSelectedModel,
  canvasRef,
}: ToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { applyStyleTransfer } = useStyleTransfer()
  const { isMobile } = useMobile()

  const handleStyleTransfer = async () => {
    if (isProcessing || !canvasRef.current) return

    setIsProcessing(true)
    try {
      await applyStyleTransfer(canvasRef.current, selectedModel)
    } finally {
      setIsProcessing(false)
    }
  }

  const styleModels = [
    { id: "vanGogh", name: "Van Gogh" },
    { id: "picasso", name: "Picasso" },
    { id: "monet", name: "Monet" },
    { id: "kandinsky", name: "Kandinsky" },
  ]

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 transition-all duration-300 ${isExpanded ? "h-auto pb-6" : "h-16"}`}
    >
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-t-none rounded-b-lg"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Brush tools */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Paintbrush className="h-5 w-5" />
              <Slider
                value={[brushSize]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setBrushSize(value[0])}
                className="w-24"
              />
              <span className="text-xs">{brushSize}px</span>
            </div>

            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Wand2 className="h-4 w-4" />
                  <span className={isMobile ? "sr-only" : ""}>Style Transfer</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {styleModels.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={selectedModel === model.id ? "bg-gray-100" : ""}
                  >
                    {model.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={handleStyleTransfer} disabled={isProcessing}>
                  Apply Style
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCollaborating(!isCollaborating)}
              className={`gap-2 ${isCollaborating ? "bg-green-50 border-green-200 text-green-700" : ""}`}
            >
              <Users className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : ""}>{isCollaborating ? "Collaborating" : "Collaborate"}</span>
            </Button>

            <Button variant="outline" size="sm" onClick={onClearCanvas} className="gap-2">
              <Trash2 className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : ""}>Clear</span>
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium mb-2">Style Transfer Options</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {styleModels.map((model) => (
                <Button
                  key={model.id}
                  variant={selectedModel === model.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedModel(model.id)}
                  className="w-full"
                >
                  {model.name}
                </Button>
              ))}
            </div>
            <div className="mt-4">
              <Button onClick={handleStyleTransfer} disabled={isProcessing} className="w-full">
                {isProcessing ? "Processing..." : "Apply Style Transfer"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
