import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Introduce from './pages/Introduce'
import NotFound from './components/NotFound'

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
