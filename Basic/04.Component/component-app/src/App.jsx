import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ClassComponent from './components/ClassComponent'
import FunctionComponent from './components/functionComponent'

function App() {
  
  return (
    <>
      <ClassComponent />
      <hr />
      <FunctionComponent />
    </>
  )
}

export default App
