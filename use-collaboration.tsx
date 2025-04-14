"use client"

import { useCallback } from "react"

type Stroke = {
  startX: number
  startY: number
  endX: number
  endY: number
  color: string
  size: number
}

export function useCollaboration() {
  // Generate a unique user ID for this session
  const getUserId = useCallback(() => {
    let userId = localStorage.getItem("art-studio-user-id")
    if (!userId) {
      userId = Math.random().toString(36).substring(2, 15)
      localStorage.setItem("art-studio-user-id", userId)
    }
    return userId
  }, [])

  // Broadcast a stroke to other users (mock implementation using localStorage)
  const broadcastStroke = useCallback(
    (stroke: Stroke) => {
      const userId = getUserId()
      const timestamp = Date.now()
      const strokeEvent = {
        userId,
        timestamp,
        stroke,
      }

      // Store in localStorage as a mock "broadcast"
      localStorage.setItem(`stroke-${timestamp}-${userId}`, JSON.stringify(strokeEvent))

      // Dispatch a custom event to notify other tabs/windows
      window.dispatchEvent(
        new CustomEvent("art-studio-stroke", {
          detail: strokeEvent,
        }),
      )
    },
    [getUserId],
  )

  // Receive strokes from other users
  const receiveStrokes = useCallback(
    (callback: (stroke: Stroke) => void) => {
      const userId = getUserId()

      const handleStorageChange = (e: StorageEvent) => {
        if (!e.key || !e.key.startsWith("stroke-")) return

        try {
          const strokeEvent = JSON.parse(e.newValue || "")
          // Only process strokes from other users
          if (strokeEvent.userId !== userId) {
            callback(strokeEvent.stroke)
          }
        } catch (error) {
          console.error("Error processing stroke event", error)
        }
      }

      const handleCustomEvent = (e: CustomEvent) => {
        const strokeEvent = e.detail
        // Only process strokes from other users
        if (strokeEvent.userId !== userId) {
          callback(strokeEvent.stroke)
        }
      }

      // Listen for storage changes (for cross-tab communication)
      window.addEventListener("storage", handleStorageChange)

      // Listen for custom events (for same-tab communication)
      window.addEventListener("art-studio-stroke", handleCustomEvent as EventListener)

      // Clean up old stroke data periodically
      const cleanupInterval = setInterval(() => {
        const now = Date.now()
        const expirationTime = 5 * 60 * 1000 // 5 minutes

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.startsWith("stroke-")) {
            try {
              const strokeEvent = JSON.parse(localStorage.getItem(key) || "")
              if (now - strokeEvent.timestamp > expirationTime) {
                localStorage.removeItem(key)
              }
            } catch (error) {
              // Ignore parsing errors
            }
          }
        }
      }, 60 * 1000) // Run every minute

      // Return cleanup function
      return () => {
        window.removeEventListener("storage", handleStorageChange)
        window.removeEventListener("art-studio-stroke", handleCustomEvent as EventListener)
        clearInterval(cleanupInterval)
      }
    },
    [getUserId],
  )

  return {
    broadcastStroke,
    receiveStrokes,
  }
}
