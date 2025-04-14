"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useCollaboration } from "@/hooks/use-collaboration"

interface CollaborationContextType {
  isActive: boolean
  broadcastStroke: (stroke: any) => void
  receiveStrokes: (callback: (stroke: any) => void) => () => void
}

const CollaborationContext = createContext<CollaborationContextType | null>(null)

export function CollaborationProvider({
  children,
  isActive,
}: {
  children: ReactNode
  isActive: boolean
}) {
  const { broadcastStroke, receiveStrokes } = useCollaboration()

  return (
    <CollaborationContext.Provider
      value={{
        isActive,
        broadcastStroke,
        receiveStrokes,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  )
}

export function useCollaborationContext() {
  const context = useContext(CollaborationContext)
  if (!context) {
    throw new Error("useCollaborationContext must be used within a CollaborationProvider")
  }
  return context
}
