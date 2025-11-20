import React from 'react'

export default function Header() {
  return (
    <header className="text-center mb-10">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
        Kulinarna Asystentka
      </h1>
      <p className="mt-3 text-blue-200/90 text-lg">
        Prześlij zdjęcie dania, aby otrzymać przepis — albo wpisz składniki i zobacz co ugotować
      </p>
    </header>
  )
}
