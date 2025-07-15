import React from 'react'
import Navbar from './components/interview/Navbar'
import Hero from './components/interview/Hero'
import Join from './components/interview/Join'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Create from './components/interview/Create'
import JoinSession from './components/interview/JoinSession'
import VideoCall from './components/video/VideoCall'
const App = () => {
  return (

    <div>
      <Navbar/>
      {/* <Hero/> */}
      <Join/>
        <Routes>
          {/* <Route path='/' element={</>}/> */}
          <Route path='/create' element={<Create/>}/>
          <Route path='/join' element={<JoinSession/>}/>
          {/* <Route path='/interview' element={<Interview/>}/> */}
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/video/:roomId' element ={<VideoCall/>}/>
        </Routes>
      
      
    </div>
  )
}

export default App
