import { useState } from 'react'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import Verify from './pages/verify'
import Issue from './pages/issue'

function App() {


  return (
   <Router>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/verify' element={<Verify/>}></Route>
      <Route path='/issue' element={<Issue/>}></Route>
    </Routes>
   </Router>
  )
}

export default App
