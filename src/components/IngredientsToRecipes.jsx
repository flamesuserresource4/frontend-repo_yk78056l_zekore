import React, { useState } from 'react'

export default function IngredientsToRecipes() {
  const [ingredients, setIngredients] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const items = ingredients.split(',').map(s => s.trim()).filter(Boolean)
    if (items.length === 0) return

    setLoading(true)
    setError('')

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/recipes/from-ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: items })
      })

      if (!res.ok) throw new Error('Nie udało się pobrać przepisów')
      const data = await res.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <h2 className="text-white font-semibold text-xl mb-4">Składniki → Proponowane przepisy</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Wpisz składniki, oddzielone przecinkami (np. makaron, czosnek, oliwa)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full rounded-md bg-slate-900/50 border border-blue-500/20 px-3 py-2 text-blue-100 placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          disabled={loading || ingredients.trim().length === 0}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {loading ? 'Szukanie...' : 'Pokaż przepisy'}
        </button>
      </form>

      {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          {results.map((r, i) => (
            <div key={i} className="bg-slate-900/40 border border-blue-500/10 rounded-xl p-4">
              <h3 className="text-white text-lg font-bold">{r.title}</h3>
              <p className="text-blue-200 font-semibold mt-2">Składniki:</p>
              <ul className="list-disc list-inside text-blue-200/90">
                {r.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
              </ul>
              <p className="text-blue-200 font-semibold mt-3">Przygotowanie:</p>
              <ol className="list-decimal list-inside text-blue-200/90">
                {r.steps.map((s, idx) => <li key={idx}>{s}</li>)}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
