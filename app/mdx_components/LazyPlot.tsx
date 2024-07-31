"use client"

import React, { useRef, useEffect, useState } from "react"
import Plot from 'react-plotly.js'
import styles from './LazyPlot.module.css'

interface LazyPlotProps {
    filePath: string
}

const fetchPlotlyFigure = async (filePath: string) => {
    const response = await fetch(`/api/github-json?filePath=${encodeURIComponent(filePath)}`)
    if (!response.ok) {
        throw new Error('Failed to fetch file data')
    }
    const text = await response.text()
    return JSON.parse(text)
}

export function LazyPlot(props: LazyPlotProps) {
    const [figure, setFigure] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isFigureLoaded, setIsFigureLoaded] = useState(false)

    const plotContainerRef = useRef<any>()
    const [dimensions, setDimensions] = useState({ width: 0, height: 0})

    const aspectRatio = 4 / 3

    // fetch the figure data when the "Load figure" button is clicked
    const loadFigure = async () => {
        if (!props.filePath) return

        setLoading(true)
        setError(null)
        try {
            const data = await fetchPlotlyFigure(props.filePath)
            setFigure(data)
            setIsFigureLoaded(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // add window resize listener for recalculating plot dimensions
    useEffect(() => {
        const updateDimensions = () => {
            const container = plotContainerRef.current
            if (container) {
                const width = container.offsetWidth
                const height = width / aspectRatio
                setDimensions({ width, height })
            }
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)
    }, [aspectRatio])

    if (!isFigureLoaded) {
        return (
            <div className={styles.loadButtonContainer} ref={plotContainerRef}>
                <button className={styles.loadButton} onClick={loadFigure} disabled={loading}>
                    {loading ? 'Loading...' : 'Load figure'}
                </button>
            </div>
        )
    }

    if (error) return <div>Error: {error}</div>
    if (!figure) return <div>Figure not found</div>

    const layout = {
        ...figure.layout,
        autosize: true,
        width: dimensions.width,
        height: dimensions.height,
        margin: {
            t: 0,
            r: 0,
            b: 10,
            l: 0
        },
        paper_bgcolor: `rgba(0, 0, 0, 0)`,
        font: {
            color: `grey`,
            size: 12
        }
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
                        showTips: false
                    }}
                    frames={figure.frames}
                />
            </div>
        </div>
    )
}

export default LazyPlot