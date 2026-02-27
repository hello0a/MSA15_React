import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Insert from './pages/board/Insert'
import Read from './pages/board/Read'
import Update from './pages/board/Update'
import Home from './pages/Home'
import List from './pages/board/List'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home /> } />
        <Route path='/boards' element={ <List /> } />
        <Route path='/boards/insert' element={ <Insert /> } />
        <Route path='/boards/:id' element={ <Read /> } />
        <Route path='/boards/update/:id' element={ <Update /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
