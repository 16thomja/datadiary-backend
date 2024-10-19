"use client"

import React, {useRef, useEffect, useState } from 'react'
import styles from './MdxVideo.module.css'

interface MdxVideoProps {
    filePath: string
    alt: string
    maxWidth: string
    originalWidth: number
    originalHeight: number
    controls?: boolean
    autoPlay?: boolean
    loop?: boolean
    muted?: boolean
    hideVolumeControl?: boolean
}

const MdxVideo: React.FC<MdxVideoProps> = ({
    filePath,
    alt,
    maxWidth,
    originalWidth,
    originalHeight,
    controls = true,
    autoPlay = false,
    loop = false,
    muted = false,
}) => {
    const videoRef = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState<number | null>(null)
    
    useEffect(() => {
        if (videoRef.current) {
            const calculatedHeight = (videoRef.current.offsetWidth * originalHeight) / originalWidth
            setHeight(calculatedHeight)
        }
    }, [originalWidth, originalHeight])

    return (
        <div className={styles.videoWrapper} style={{ maxWidth: maxWidth || '100%' }}>
            <div className={styles.videoContainer} style={{ height: height ? `${height}px` : 'auto' }}>
                <video
                    src={`https://assets.datadiary.dev/${filePath}`}
                    controls={controls}
                    autoPlay={autoPlay}
                    loop={loop}
                    muted={muted}
                    style={{ width: '100%', height: '100%' }}
                >
                    {alt}
                </video>
            </div>
        </div>
    )
}

export default MdxVideo