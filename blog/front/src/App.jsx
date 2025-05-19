import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import{BrowserRouter,Routes,Route} from 'react-router-dom'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Home from './Home'
import Editor from './Editor'

function App() {
 

  return (
   <BrowserRouter>
   <Routes>
    <Route  path='/' element={<SignUp/>}/>
    <Route  path='/signin' element={<SignIn/>}/>
    <Route  path='/home' element={<Home/>}/>
    <Route path='/editor' element={<Editor />} />
    <Route  path='/editor/:id' element={<Editor/>}/>
    
   </Routes>
   
   
    </BrowserRouter>
  )
  
}

export default App
