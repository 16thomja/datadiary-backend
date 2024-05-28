"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import styles from "./ThemeSwitch.module.css"

export default function ThemeSwitch() {
    const [mounted, setMounted] = useState(false)
    const { setTheme, resolvedTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    if (!mounted) return (
      <button className={styles.unmounted}></button>
    )

    if (resolvedTheme == 'dark') {
      return (
        <button className={styles.mounted} onClick={() => setTheme('light')}>
          light mode
        </button>
      )
    }

    if (resolvedTheme == 'light') {
      return (
        <button className={styles.mounted} onClick={() => setTheme('dark')}>
          dark mode
        </button>
      )
    }
}