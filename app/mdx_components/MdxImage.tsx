import React from 'react'
import Image from 'next/image'
import styles from './MdxImage.module.css'

interface MdxImageProps {
    filePath: string
    alt: string
    maxWidth?: string
    originalWidth: number
    originalHeight: number
    attributionId?: number // unique identifier to match attribution at end of post
    title?: string
}

const MdxImage: React.FC<MdxImageProps> = ({
    filePath, 
    alt, 
    maxWidth,
    originalWidth,
    originalHeight,
    attributionId,
    title,
}) => {
    const aspectRatio = (originalHeight / originalWidth) * 100

    return (
        <div className={styles.imageWrapper} style={{ maxWidth: maxWidth || '100%' }}>
            <div className={styles.imageContainer} style={{ paddingBottom: `${aspectRatio}%` }}>
                <Image
                    src={`https://assets.datadiary.dev/${filePath}`}
                    alt={alt}
                    fill
                    // mobile, tablet, desktop
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    unoptimized={true}
                />
            </div>
            {attributionId && title && (
                <figcaption className={styles.figcaption}>
                    {title}{' '}
                    <a href={`#attribution-${attributionId}`} className={styles.attributionLink}>
                        [ {attributionId} ]
                    </a>
                </figcaption>
            )}
        </div>
    )
}

export default MdxImage