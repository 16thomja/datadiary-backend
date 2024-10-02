import React from 'react'
import Image from 'next/image'

interface MdxImageProps {
    filePath: string
    alt: string
    maxWidth: string
    attribution?: string
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill' | undefined
    [key: string]: any
}

const MdxImage: React.FC<MdxImageProps> = ({
    filePath, 
    alt, 
    maxWidth, 
    attribution,
    layout = 'responsive', 
    ...props 
}) => {
    return (
        <div style={{ maxWidth, margin: '10px auto', width: '100%' }}>
            <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                <Image
                    src={`https://assets.datadiary.dev/${filePath}`}
                    alt={alt}
                    layout={layout}
                    objectFit='contain'
                    unoptimized={true}
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    width={0}
                    height={0}
                    {...props}
                />
            </div>
            {attribution && (
                <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '5px' }}>
                    {attribution}
                </p>
            )}
        </div>
    )
}

export default MdxImage