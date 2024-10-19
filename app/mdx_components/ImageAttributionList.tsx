import React from 'react'
import ImageAttribution from './ImageAttribution'
import styles from './ImageAttributionList.module.css'

interface ImageAttributionProps {
    attributionId: number // unique identifier to match image in post
    title: string
    author: string
    authorUrl?: string
    source?: string
    sourceUrl?: string
    license: string
    licenseUrl: string
    modifications?: string
}

interface ImageAttributionListProps {
    attributions: ImageAttributionProps[]
}

const ImageAttributionList: React.FC<ImageAttributionListProps> = ({ attributions }) => {
    if (!attributions || attributions.length === 0) {
        return null
    }

    return (
        <section>
            <h3 className={styles.attributionHeader}>Attributions</h3>
            <ol>
                {attributions.map((attr) => (
                    <li key={attr.attributionId}>
                        <ImageAttribution
                            attributionId={attr.attributionId}
                            title={attr.title}
                            author={attr.author}
                            authorUrl={attr.authorUrl}
                            source={attr.source}
                            sourceUrl={attr.sourceUrl}
                            license={attr.license}
                            licenseUrl={attr.licenseUrl}
                            modifications={attr.modifications}
                        />
                    </li>
                ))}
            </ol>
        </section>
    )
}

export default ImageAttributionList