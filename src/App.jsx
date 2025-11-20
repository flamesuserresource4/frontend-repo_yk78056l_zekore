import Header from './components/Header'
import ImageToRecipe from './components/ImageToRecipe'
import IngredientsToRecipes from './components/IngredientsToRecipes'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_50%)]" />

      <div className="relative max-w-5xl mx-auto px-6 py-14">
        <Header />

        <div className="grid md:grid-cols-2 gap-6">
          <ImageToRecipe />
          <IngredientsToRecipes />
        </div>

        <div className="mt-10 text-center text-blue-300/70 text-sm">
          Wskazówka: to demo używa prostych reguł do generowania przepisów. Możemy podłączyć prawdziwy model wizji lub większą bazę przepisów.
        </div>
      </div>
    </div>
  )
}

export default App
