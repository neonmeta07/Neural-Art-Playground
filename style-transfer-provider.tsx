"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useStyleTransferWorker } from "@/hooks/use-style-transfer-worker"

interface StyleTransferContextType {
  applyStyleTransfer: (canvas: HTMLCanvasElement, modelId: string) => Promise<void>
}

const StyleTransferContext = createContext<StyleTransferContextType | null>(null)

export function StyleTransferProvider({ children }: { children: ReactNode }) {
  const { applyStyleTransfer } = useStyleTransferWorker()

  return <StyleTransferContext.Provider value={{ applyStyleTransfer }}>{children}</StyleTransferContext.Provider>
}

export function useStyleTransfer() {
  const context = useContext(StyleTransferContext)
  if (!context) {
    throw new Error("useStyleTransfer must be used within a StyleTransferProvider")
  }
  return context
}
