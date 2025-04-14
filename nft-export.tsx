"use client"

import type React from "react"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface NFTExportProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export function NFTExport({ canvasRef }: NFTExportProps) {
  const [nftHash, setNftHash] = useState("")
  const [nftPreviewUrl, setNftPreviewUrl] = useState("")

  const generateFakeNFTHash = () => {
    const characters = "abcdef0123456789"
    let hash = "0x"
    for (let i = 0; i < 40; i++) {
      hash += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return hash
  }

  const handleExport = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Generate NFT hash
    const hash = generateFakeNFTHash()
    setNftHash(hash)

    // Get canvas data URL
    const dataUrl = canvas.toDataURL("image/png")
    setNftPreviewUrl(dataUrl)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `artwork-${nftHash.substring(0, 10)}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-20 right-4 rounded-full h-12 w-12 shadow-lg bg-white"
          onClick={handleExport}
        >
          <Download className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Artwork</DialogTitle>
          <DialogDescription>Your artwork has been converted to a digital asset.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {nftPreviewUrl && (
            <div className="border border-gray-200 rounded-lg overflow-hidden max-w-xs">
              <img src={nftPreviewUrl || "/placeholder.svg"} alt="Artwork preview" className="w-full h-auto" />
            </div>
          )}

          <div className="bg-gray-50 p-3 rounded-md w-full overflow-hidden">
            <p className="text-xs font-mono text-gray-500 truncate">NFT Hash: {nftHash}</p>
          </div>

          <Button onClick={downloadImage} className="w-full">
            Download Artwork
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
