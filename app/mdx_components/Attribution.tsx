import React from "react"

import styles from "./Attribution.module.css"

interface AttributionProps {
  attributionId: number // unique id for linking from item to attribution
  title: string
  author: string
  authorUrl?: string
  source?: string
  sourceUrl?: string
  license: string
  licenseUrl: string
  modifications?: string
}

const Attribution: React.FC<AttributionProps> = ({
  attributionId,
  title,
  author,
  authorUrl,
  source,
  sourceUrl,
  license,
  licenseUrl,
  modifications,
}) => {
  return (
    <div id={`attribution-${attributionId}`}>
      <p className={styles.attribution}>
        <strong>{title}</strong> by{" "}
        {authorUrl ? ( // make author name link if applicable
          <a
            href={authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.attributionLink}
          >
            {author}
          </a>
        ) : (
          author
        )}
        , licensed under{" "}
        <a
          href={licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.attributionLink}
        >
          {license}
        </a>
        .
        <br />
        {source && sourceUrl && (
          <>
            Source:{" "}
            <a href={sourceUrl} className={styles.attributionLink}>
              {source}
            </a>
          </>
        )}
        <br />
        {modifications && <>Modifications: {modifications}</>}
      </p>
    </div>
  )
}

export default Attribution
