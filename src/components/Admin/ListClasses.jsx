import React, { useEffect, useState } from 'react'
import classeService from '../../../services/classeService'
import { Link } from 'react-router-dom'

const PALETTE = [
    { bg: '#FFF7ED', accent: '#F97316', dot: '#FDBA74' },
    { bg: '#F0FDF4', accent: '#16A34A', dot: '#86EFAC' },
    { bg: '#EFF6FF', accent: '#2563EB', dot: '#93C5FD' },
    { bg: '#FDF4FF', accent: '#A21CAF', dot: '#E879F9' },
    { bg: '#FFF1F2', accent: '#E11D48', dot: '#FDA4AF' },
    { bg: '#F0FDFA', accent: '#0D9488', dot: '#5EEAD4' },
    { bg: '#FFFBEB', accent: '#D97706', dot: '#FCD34D' },
    { bg: '#F5F3FF', accent: '#7C3AED', dot: '#C4B5FD' },
]

function StatCard({ classe, index, visible }) {
    const palette = PALETTE[index % PALETTE.length]
    const delay = `${index * 80}ms`

    return (
        <Link
            to={`/dashboard/admin/statistique/classe/${classe?.id}`}
            style={{
                '--accent': palette.accent,
                '--card-bg': palette.bg,
                '--dot': palette.dot,
                transitionDelay: delay,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
            }}
            className="stat-card"
        >
        <div className="card-glow" />
        <div className="card-dot" />
        <div className="card-body">
            <div className="card-badge">Classe</div>
            <p className="card-label">{classe?.libelle}</p>
            <div className="card-arrow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            </div>
        </div>
        </Link>
    )
}

export default function ListClasse() {
    const [classes, setClasses] = useState([])
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const getClasses = async () => {
        try {
            const res = await classeService.getAllClasse()
            if (res.data) {
                setClasses(res.data.classes)
            }
        } catch (err) {
            console.log("Error occurred")
        } finally {
            setLoading(false)
            setTimeout(() => setVisible(true), 50)
        }
        }
        getClasses()
    }, [])

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=DM+Sans:wght@400;500&display=swap');

            .liste-classe-root {
            font-family: 'DM Sans', sans-serif;
            padding: 2rem 0;
            }

            .liste-classe-header {
            margin-bottom: 2.5rem;
            }

            .liste-classe-title {
            font-family: sans-serif;
            font-size: 2rem;
            font-weight: 800;
            color: #0F172A;
            letter-spacing: -0.03em;
            margin: 0 0 0.25rem;
            }

            .liste-classe-subtitle {
            font-size: 0.95rem;
            color: #64748B;
            margin: 0;
            }

            .stat-card {
            position: relative;
            display: block;
            background: var(--card-bg);
            border-radius: 20px;
            padding: 1.6rem 1.5rem;
            text-decoration: none;
            overflow: hidden;
            border: 1.5px solid transparent;
            transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 10px rgba(0,0,0,0.04);
            }

            .stat-card:hover {
            border-color: var(--accent);
            box-shadow: 0 8px 30px rgba(0,0,0,0.10), 0 0 0 4px color-mix(in srgb, var(--accent) 12%, transparent);
            transform: translateY(-3px) scale(1.01) !important;
            }

            .stat-card:hover .card-arrow {
            opacity: 1;
            transform: translateX(0);
            }

            .card-glow {
            position: absolute;
            top: -30px;
            right: -30px;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: var(--accent);
            opacity: 0.08;
            filter: blur(20px);
            pointer-events: none;
            }

            .card-dot {
            position: absolute;
            top: 1.2rem;
            right: 1.3rem;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--dot);
            }

            .card-body {
            position: relative;
            z-index: 1;
            }

            .card-badge {
            display: inline-block;
            font-size: 0.7rem;
            font-weight: 500;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--accent);
            background: color-mix(in srgb, var(--accent) 12%, transparent);
            padding: 0.2rem 0.6rem;
            border-radius: 999px;
            margin-bottom: 0.75rem;
            }

            .card-label {
            // font-family: 'Syne', sans-serif;
            font-size: 1.8rem;
            font-weight: 800;
            color: #0F172A;
            margin: 0 0 1.2rem;
            letter-spacing: -0.02em;
            line-height: 1.1;
            }

            .card-arrow {
            display: flex;
            align-items: center;
            color: var(--accent);
            opacity: 0;
            transform: translateX(-6px);
            transition: opacity 0.2s, transform 0.2s;
            }

            .grid-classes {
            display: grid;
            grid-template-columns: repeat(1, 1fr);
            gap: 1rem;
            }

            @media (min-width: 480px) {
            .grid-classes { grid-template-columns: repeat(2, 1fr); }
            }

            @media (min-width: 900px) {
            .grid-classes { grid-template-columns: repeat(3, 1fr); }
            }

            @media (min-width: 1200px) {
            .grid-classes { grid-template-columns: repeat(4, 1fr); }
            }

            .skeleton-card {
            background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
            background-size: 400% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 20px;
            height: 130px;
            }

            @keyframes shimmer {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
            }
        `}</style>
        <div className="liste-classe-root">
            <div className="liste-classe-header">
            <h1 className="liste-classe-title">Mes Classes</h1>
            <p className="liste-classe-subtitle">{classes?.length} classe{classes?.length !== 1 ? 's' : ''} disponible{classes?.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="grid-classes">
            {loading
                ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 100}ms` }} />)
                : classes?.map((classeItem, i) => (
                    <StatCard key={i} classe={classeItem} index={i} visible={visible} />
                ))
            }
            </div>
        </div>
        </>
    )
}