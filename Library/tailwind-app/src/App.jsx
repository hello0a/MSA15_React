import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <h1 className='text-red-500 font-bold'>Hello Tailwind</h1>  
          <button className='bg-blue-500/50 px-3 py-1 my-4 rounded-md hover:bg-blue-500'>BUTTON</button>        
        </div>
      </div>
          <img
            class="h-48 w-full object-cover md:h-full md:w-48"
            src="https://i.ytimg.com/vi/LjpD0hxw1UI/mqdefault.jpg"
            alt="Modern building architecture"
          />
    </>
  )
}

export default App
