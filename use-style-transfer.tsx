"use client"

import { useCallback } from "react"
import { useStyleTransferWorker } from "@/hooks/use-style-transfer-worker"

export function useStyleTransfer() {
  const { applyStyleTransfer: applyStyleWithWorker } = useStyleTransferWorker()

  const applyStyleTransfer = useCallback(
    async (canvas: HTMLCanvasElement, modelId: string) => {
      return applyStyleWithWorker(canvas, modelId)
    },
    [applyStyleWithWorker],
  )

  return {
    applyStyleTransfer,
  }
}
