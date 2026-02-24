import React, { useEffect, useMemo, useState } from 'react'
import "../petals.css"

export default function Petals ({ show, duration = 7400, count = 150 }) {
    const [visible, setVisible] = useState(false)
    const colors = ["#ffb6c1", "#ff4f9a", "#ffffff"]; // 연핑크 / 진핑크 / 화이트

    const petals = useMemo(() => {
        // show 바뀔 때마다 랜덤 위치/속도 새로 생성
        return Array.from({ length: count }).map((_, i) => ({
            id: `${Date.now()}-${i}`,
            left: Math.random() * 100,
            delay: Math.random() * 1.8,
            size: 8 + Math.random() * 10,
            drift: (Math.random() - 0.5) * 160,
            rotate: Math.random() * 360,
            fall: 900 + Math.random() * 500,
            sway: 1.2 + Math.random() * 1.2,
            color: colors[Math.floor(Math.random() * colors.length)], // ⭐ 추가
        }));
    }, [show, count]);

    useEffect(() => {
        console.log("🌸 Petals show:", show);
        if (!show) return
        setVisible(true)
        const t = setTimeout(() => setVisible(false), duration)
        return () => clearTimeout(t)
    }, [show, duration])

    if (!visible) return null

    return (
        <div className="petals-layer" aria-hidden="true">
            {petals.map((p) => (
            <span
                key={p.id}
                className="petal"
                style={{
                    left: `${p.left}vw`,
                    width: `${p.size}px`,
                    height: `${p.size * 0.6}px`,
                    backgroundColor: p.color, // ⭐ 추가
                    animationDelay: `${p.delay}s`,
                    "--drift": `${p.drift}px`,
                    "--rot": `${p.rotate}deg`,
                    "--fall": `${p.fall}px`,
                    "--swayDur": `${p.sway}s`,
                }}
            />
            ))}
        </div>
    )
}
