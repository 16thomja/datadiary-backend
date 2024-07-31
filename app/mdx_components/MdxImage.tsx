import React from 'react'
import Image from 'next/image'

interface MdxImageProps {
    filePath: string
    alt: string
    maxWidth: string
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill' | undefined
    [key: string]: any
}

const MdxImage: React.FC<MdxImageProps> = ({ filePath, alt, maxWidth, layout = 'responsive', ...props }) => {
    return (
        <div style={{ maxWidth, margin: '10px auto', width: '100%' }}>
            <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                <Image
                    src={`/api/github-image?filePath=${encodeURIComponent(filePath)}`}
                    alt={alt}
                    layout={layout}
                    objectFit='contain'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    width={0}
                    height={0}
                    {...props}
                />
            </div>
        </div>
    )
}

export default MdxImage