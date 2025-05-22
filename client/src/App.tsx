import { useState } from 'react'

function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind + Vite + React + TypeScriptwvsdvs</h1>
      
      <div className="bg-white p-6 rounded shadow-md">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Count is {count}
        </button>
        
        <p className="mt-2 text-gray-600">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

export default App