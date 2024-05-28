import React from 'react'
import Image, { ImageProps } from 'next/image'

interface MdxImageProps {
    src: string,
    alt: string,
    width: number,
    height: number
}

export default function MdxImage(props: MdxImageProps) {
    return (
        <div style={{ width: '100%' }}>
            <Image
                src={props.src}
                alt={props.alt}
                layout="responsive"
                width={props.width}
                height={props.height}
            />
        </div>
    )
}