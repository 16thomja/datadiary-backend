import React from "react"

import Attribution from "./Attribution"
import styles from "./AttributionList.module.css"

interface AttributionProps {
  attributionId: number // unique identifier to match item in post
  title: string
  author: string
  authorUrl?: string
  source?: string
  sourceUrl?: string
  license: string
  licenseUrl: string
  modifications?: string
}

interface AttributionListProps {
  attributions: AttributionProps[]
}

const AttributionList: React.FC<AttributionListProps> = ({ attributions }) => {
  if (!attributions || attributions.length === 0) {
    return null
  }

  return (
    <section>
      <h3 className={styles.attributionHeader}>Attributions</h3>
      <ol>
        {attributions.map((attr) => (
          <li key={attr.attributionId}>
            <Attribution
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

export default AttributionList
