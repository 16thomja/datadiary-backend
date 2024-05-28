"use client"

import React, { useRef, useEffect, useState, MutableRefObject } from "react"
import Plot from 'react-plotly.js'
import styles from './LazyPlot.module.css'

// import Loadable from "react-loadable"

// const Plotly = Loadable({
//     loader: () => import(`react-plotly.js`),
//     loading: ({ timedOut }) =>
//       timedOut ? (
//         <blockquote>Error: Loading Plotly timed out.</blockquote>
//       ) : (
//         <blockquote>Loading...</blockquote>
//       ),
//     timeout: 10000,
// })

interface LazyPlotProps {
    filePath: string
}

const fetchPlotlyFigure = async (filePath: string) => {
    const response = await fetch(`/api/github-file?filePath=${encodeURIComponent(filePath)}`)
    if (!response.ok) {
        throw new Error('Failed to fetch file data')
    }
    const text = await response.text()
    return JSON.parse(text)
}

export function LazyPlot(props: LazyPlotProps) {
    const [figure, setFigure] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const plotContainerRef = useRef<any>()
    const [dimensions, setDimensions] = useState({ width: 0, height: 0})

    const aspectRatio = 4 / 3

    // try to load figure json when filePath changes
    useEffect(() => {
        if (!props.filePath) return

        const getFileData = async () => {
            try {
                const data = await fetchPlotlyFigure(props.filePath)
                // data.layout.margin = { t: 0, r: 0, b: 0, l: 0 }
                // data.layout.paper_bgcolor = `rgba(0, 0, 0, 0)`
                // data.layout.font = {color: `grey`, size: 12}
                // data.layout.dragmode = true
                // data.layout.autosize = true
                setFigure(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        getFileData()
    }, [props.filePath])

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

    if (loading) return <div>Loading...</div>
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
                {figure ? (
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
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    )
}

export default LazyPlot