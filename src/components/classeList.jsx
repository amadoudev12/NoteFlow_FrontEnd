import React, { useEffect, useState } from 'react'
import enseignantService from '../../services/enseignantService'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const COLORS = [
  { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-600', text: 'text-blue-700' },
  { bg: 'bg-indigo-50', border: 'border-indigo-200', dot: 'bg-indigo-600', text: 'text-indigo-700' },
  { bg: 'bg-teal-50', border: 'border-teal-200', dot: 'bg-teal-600', text: 'text-teal-700' },
  { bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-600', text: 'text-amber-700' },
  { bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-600', text: 'text-purple-700' },
  { bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-600', text: 'text-rose-700' },
]

function StatCard({ items, index, isActive }) {
  console.log(items.matiere.nom)
  const color = COLORS[index % COLORS.length]

  const handleClick = () => {
    localStorage.setItem('matiere', items.matiere?.nom)
  }

  const content = (
    <div className={`
      relative bg-white rounded-2xl p-5 border transition-all duration-200
      ${isActive
        ? `border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer`
        : 'border-slate-100 opacity-70 cursor-default'
      }
    `}>
      {/* Barre colorée en haut */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${color.dot}`} />

      <div className="mt-1">
        {/* Badge matière */}
        <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-3 ${color.bg} ${color.text} border ${color.border}`}>
          {items.matiere?.nom}
        </span>

        {/* Nom de la classe */}
        <p className="text-2xl font-bold text-slate-800 tracking-tight leading-tight">
          {items.classe?.libelle}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${color.dot}`} />
            <span className="text-xs text-slate-400">
              {items.classe?.effectif ? `${items.classe.effectif} élèves` : 'Voir la classe'}
            </span>
          </div>
          {isActive && (
            <span className="text-xs text-blue-600 font-medium">
              Accéder →
            </span>
          )}
        </div>
      </div>
    </div>
  )

  if (isActive) {
    return (
      <Link to={`/dashboard/liste-eleve/${items.classe?.id}`} onClick={handleClick}>
        {content}
      </Link>
    )
  }

  return content
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse">
      <div className="h-1 bg-slate-100 rounded-t-xl -mt-5 -mx-5 mb-5 rounded-t-2xl" />
      <div className="h-5 w-20 bg-slate-100 rounded-full mb-3" />
      <div className="h-8 w-32 bg-slate-100 rounded-lg mb-4" />
      <div className="h-px bg-slate-100 mb-3" />
      <div className="h-4 w-24 bg-slate-100 rounded" />
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ClasseList() {
  const navigate = useNavigate()
  const location = useLocation()
  const [classes, setClasse] = useState(null)
  const [loading, setLoading] = useState(true)

  // Correction du bug : last == "notes" || "eleves" est toujours truthy
  const last = location.pathname.split('/').filter(Boolean).pop()
  const isActive = last === 'notes' || last === 'eleves'

  useEffect(() => {
    const getClasses = async () => {
      try {
        const res = await enseignantService.getClassesApi()
        if (res.data) setClasse(res.data)
      } catch (err) {
        console.log('erreur serveur')
        navigate('/500')
      } finally {
        setLoading(false)
      }
    }
    getClasses()
  }, [])

  return (
    <div className="ml-4 max-sm:ml-2">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Mes classes</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          {loading ? 'Chargement…' : `${classes?.length ?? 0} classe${(classes?.length ?? 0) > 1 ? 's' : ''} assignée${(classes?.length ?? 0) > 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : classes?.map((classeItems, i) => (
              <StatCard
                key={i}
                index={i}
                items={classeItems}
                isActive={isActive}
              />
            ))
        }
      </div>
    </div>
  )
}