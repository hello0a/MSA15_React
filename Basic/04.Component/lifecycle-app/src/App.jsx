import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LifeCycleClass from './components/LifeCycleClass'
import LifecycleFunction from './components/LifeCycleFunction'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LifeCycleClass />
      <LifecycleFunction />
    </>
  )
}

export default App
