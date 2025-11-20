import React, { useState } from 'react'

export default function ImageToRecipe() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null)
    setResult(null)
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError('')

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const form = new FormData()
      form.append('file', file)

      const res = await fetch(`${baseUrl}/api/recipes/from-image`, {
        method: 'POST',
        body: form,
      })

      if (!res.ok) throw new Error('Nie udało się rozpoznać przepisu')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <h2 className="text-white font-semibold text-xl mb-4">Zdjęcie → Przepis</h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="block w-full text-sm text-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        <button
          disabled={!file || loading}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {loading ? 'Przetwarzanie...' : 'Otrzymaj przepis'}
        </button>
      </form>

      {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}

      {result && (
        <div className="mt-6 bg-slate-900/40 border border-blue-500/10 rounded-xl p-4">
          <h3 className="text-white text-lg font-bold">{result.title}</h3>
          <div className="mt-3">
            <p className="text-blue-200 font-semibold mb-1">Składniki:</p>
            <ul className="list-disc list-inside text-blue-200/90 space-y-1">
              {result.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-blue-200 font-semibold mb-1">Przygotowanie:</p>
            <ol className="list-decimal list-inside text-blue-200/90 space-y-1">
              {result.steps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
