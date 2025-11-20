import { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function UploadAndIngredients() {
  const [ingredients, setIngredients] = useState('')
  const [number, setNumber] = useState(5)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageResult, setImageResult] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setImageResult(null)
    try {
      const res = await fetch(`${API_BASE}/api/recipes/by-ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map((i) => i.trim()).filter(Boolean),
          number: Number(number) || 5,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResults(data.results || [])
    } catch (err) {
      setError('Nie udało się pobrać przepisów')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError('')
    setResults([])
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${API_BASE}/api/recipes/by-image`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setImageResult(data)
    } catch (err) {
      setError('Nie udało się rozpoznać zdjęcia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Kuchenny Asystent AI</h1>
        <p className="text-blue-200">Dodaj zdjęcie dania albo wpisz składniki, a otrzymasz gotowe przepisy.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">1) Rozpoznaj danie ze zdjęcia</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="block w-full text-sm text-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
          />
          {imageResult && (
            <div className="mt-4">
              {imageResult.image && (
                <img src={imageResult.image} alt={imageResult.title} className="rounded-lg mb-3" />
              )}
              <h3 className="text-white font-semibold mb-2">{imageResult.title}</h3>
              {imageResult.ingredients?.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-blue-200 font-medium mb-1">Składniki:</h4>
                  <ul className="list-disc list-inside text-blue-100/90">
                    {imageResult.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </div>
              )}
              {imageResult.instructions?.length > 0 && (
                <div>
                  <h4 className="text-blue-200 font-medium mb-1">Przygotowanie:</h4>
                  <ol className="list-decimal list-inside text-blue-100/90 space-y-1">
                    {imageResult.instructions.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">2) Wygeneruj przepisy ze składników</h2>
          <form onSubmit={handleSearch} className="space-y-3">
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="np. kurczak, pomidor, makaron"
              className="w-full px-3 py-2 rounded-md bg-slate-900/60 text-blue-100 border border-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-3">
              <label className="text-blue-200 text-sm">Ilość przepisów:</label>
              <input
                type="number"
                min={1}
                max={10}
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-20 px-3 py-2 rounded-md bg-slate-900/60 text-blue-100 border border-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="ml-auto px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition"
                disabled={loading}
              >
                {loading ? 'Szukam...' : 'Szukaj przepisów'}
              </button>
            </div>
          </form>

          {error && <p className="text-red-400 mt-3">{error}</p>}

          {results.length > 0 && (
            <div className="mt-4 space-y-4">
              {results.map((r) => (
                <div key={r.id} className="bg-slate-900/40 border border-blue-500/10 rounded-lg p-4">
                  <div className="flex gap-4">
                    {r.image && (
                      <img src={r.image} alt={r.title} className="w-28 h-28 object-cover rounded" />
                    )}
                    <div>
                      <h3 className="text-white font-semibold">{r.title}</h3>
                      {(r.usedIngredients?.length > 0 || r.missedIngredients?.length > 0) && (
                        <p className="text-blue-200 text-sm mt-1">
                          Masz: {r.usedIngredients?.join(', ') || '—'}
                          {r.missedIngredients?.length ? ` • Brakuje: ${r.missedIngredients.join(', ')}` : ''}
                        </p>
                      )}
                      {r.instructions?.length > 0 && (
                        <ol className="list-decimal list-inside text-blue-100/90 mt-2 space-y-1">
                          {r.instructions.map((s, idx) => <li key={idx}>{s}</li>)}
                        </ol>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
