import { Routes, Route } from 'react-router-dom'
import './App.css'
import BlogTitles from './pages/BlogTitles'
import Community from './pages/Community'
import Dashboard from './pages/Dashboard'
import GenerateImages from './pages/GenerateImages'
import Home from './pages/Home'
import Layout from './pages/Layout'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import WriteArticle from './pages/WriteArticle'
import { Toaster } from 'react-hot-toast'

function App() {
  
  return (
    <>
    <Toaster />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />}/>
          <Route path='write-article' element={<WriteArticle/>}/>
          <Route path='blog-titles' element={<BlogTitles/>}/>
          <Route path='generate-images' element={<GenerateImages/>}/>
          <Route path='remove-background' element={<RemoveBackground/>}/> 
          <Route path='remove-object' element={<RemoveObject/>}/>
          <Route path='community' element={<Community/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
