"use client"

import React from "react"
import Link from "next/link"
import ThemeSwitch from "./ThemeSwitch"
import styles from "./Navbar.module.css"
import { usePathname } from "next/navigation"
import { HiHome } from "react-icons/hi2";

function PathElements({ path }: {path: string}) {
    // Split the path into components
    const pathComponents = path.split("/").filter(component => component !== "")
    // Initialize an empty array to store links
    const elements = [];

    // Add home link first
    elements.push(<Link className={styles.homeLink} href="/"><HiHome size={40}/></Link>)

    // Iterate over path components
    for (let i = 0; i < pathComponents.length; i++) {
        // If it's the last component, create a non-link span
        elements.push(<span className={styles.seps}>/</span>)
        if (i == pathComponents.length - 1) {
            elements.push(<span className={styles.currentLocation}>{pathComponents[i]}</span>)
        } else {
            // Otherwise, create a link
            const href = "/" + pathComponents.slice(0, i+1).join("/")
            elements.push(<Link className={styles.links} href={href}>{pathComponents[i]}</Link>)
        }
    }

    return (
        <div className={styles.linksDiv}>
            {elements.map((element, index) => (
                <React.Fragment key={index}>
                    {element}
                </React.Fragment>
            ))}
        </div>
    )
}

export default function Navbar() {
    return (
        <nav className={styles.navigation}>
            <PathElements path={usePathname()} />
            <div>
                <ThemeSwitch />
            </div>
        </nav>
    )
}