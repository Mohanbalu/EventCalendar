"use client"

import { useState, useEffect } from "react"

export function useResponsive() {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop")
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth

      if (width < 768) {
        setScreenSize("mobile")
        setIsMobile(true)
        setIsTablet(false)
        setIsDesktop(false)
      } else if (width < 1024) {
        setScreenSize("tablet")
        setIsMobile(false)
        setIsTablet(true)
        setIsDesktop(false)
      } else {
        setScreenSize("desktop")
        setIsMobile(false)
        setIsTablet(false)
        setIsDesktop(true)
      }
    }

    // Check on mount
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
  }
}
