import { Routes, Route } from 'react-router-dom'
import Introduce from './pages/Introduce'
import NotFound from './components/NotFound'
import Home from './pages/Home'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/introduce" element={<Introduce/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </>
  )
}

export default App
