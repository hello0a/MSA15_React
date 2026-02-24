import React, { useEffect, useState } from 'react'
import "../toast.css"

export default function Toast({ show, message, duration = 3000 }) {
    const [mounted, setMounted] = useState(false)
    const [exiting, setExiting] = useState(false)

    useEffect(() => {
        if(!show) return

        // 1. 마운트 + enter
        setMounted(true)
        setExiting(false)
        // 2. duration 후 exit 시작
        const exitTimer = setTimeout(() => {
            setExiting(true)
        }, duration)
        // 3. exit 애니메이션 끝난 뒤 unmount
        const unmountTimer = setTimeout(() => {
            setMounted(false)
            setMounted(false)
        }, duration + 350) // css exit 시간과 맞추기(0.35s)

        return () => {
            clearTimeout(exitTimer)
            clearTimeout(unmountTimer)
        }
    }, [show, duration])

    if (!mounted) return null

    return (
        <div className={`toast ${exiting ? "toast-exit" : "toast-enter"}`}>
            🎉 {message} 🎉
        </div>
    )
}
