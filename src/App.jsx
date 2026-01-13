import { Routes, Route } from 'react-router-dom'
import Introduce from './pages/Introduce'
import NotFound from './NotFound'
import Home from './pages/Home'
import RootLayout from './components/layout/RootLayout'
import TitlePage from './pages/TitlePage'
import AuthLayout from './components/layout/AuthLayout'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<RootLayout/>}>
          <Route path="" element={<Home/>} />
          <Route path="introduce" element={<Introduce/>} />
          <Route path="title/:id" element={<TitlePage />} />
          {/* 
          <Route path="watch/:id" element={<WatchPage />} /> */}
        </Route>
        <Route path='/auth/' element={<AuthLayout/>}>
          <Route path="login" element={<LoginPage/>} />
          <Route path="register" element={<RegisterPage/>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

    </>
  )
}

export default App
