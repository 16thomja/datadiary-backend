"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"
import React, { useEffect, useMemo, useRef, useState } from "react"
import type PlotlyImport from "react-plotly.js"

import styles from "./LazyPlot.module.css"

// give TS real plotly props since we're dynamically loading
type PlotProps = ComponentProps<typeof PlotlyImport>

// plotly MUST NOT be loaded/bundled on the server,
// as it references self/window
const Plot = dynamic<PlotProps>(
  () => import("react-plotly.js").then((mod) => mod.default),
  { ssr: false }
)

interface LazyPlotProps {
  filePath: string
}

const fetchPlotlyFigure = async (filePath: string) => {
  const response = await fetch(`https://assets.datadiary.dev/${filePath}`, {
    method: "GET",
  })
  if (!response.ok) {
    throw new Error("Failed to fetch file data")
  }
  const text = await response.text()
  return JSON.parse(text)
}

export function LazyPlot({ filePath }: LazyPlotProps) {
  const [figure, setFigure] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const plotContainerRef = useRef<any>(undefined)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const aspectRatio = 4 / 3

  // fetch the figure data when the "Load figure" button is clicked
  const loadFigure = async () => {
    if (!filePath) return

    setLoading(true)
    setError(null)
    try {
      setFigure(await fetchPlotlyFigure(filePath))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // add window resize listener for recalculating plot dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (plotContainerRef.current) {
        const width = plotContainerRef.current.offsetWidth
        const height = width / aspectRatio
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [aspectRatio])

  const layout = useMemo(() => {
    if (!figure) return null

    return {
      ...figure.layout,
      autosize: true,
      width: dimensions.width,
      height: dimensions.height,
      margin: { t: 0, r: 0, b: 10, l: 0 },
      paper_bgcolor: "rgba(0, 0, 0, 0)",
      font: { color: "grey", size: 12 },
    }
  }, [figure, dimensions])

  if (error)
    return <div className={styles.loadButtonContainer}>Error: {error}</div>

  if (!figure) {
    return (
      <div className={styles.loadButtonContainer} ref={plotContainerRef}>
        <button
          className={styles.loadButton}
          onClick={loadFigure}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load figure"}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.plotContainer} ref={plotContainerRef}>
      <div className={styles.plotContent}>
        <Plot
          data={figure.data}
          layout={layout}
          style={{ width: `100%`, height: `100%` }}
          useResizeHandler={true}
          config={{
            displayModeBar: false,
            showTips: false,
          }}
          frames={figure.frames}
        />
      </div>
    </div>
  )
}

export default LazyPlot
