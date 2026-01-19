import { Routes, Route } from "react-router-dom"
import RootLayout from "./components/layout/RootLayout"
import AuthLayout from "./components/layout/AuthLayout"

import Home from "./pages/Home"
import Introduce from "./pages/Introduce"
import TitlePage from "./pages/TitlePage"
import LoginPage from "./pages/Login"
import RegisterPage from "./pages/Register"
import NotAllowed from "./pages/NotAllowed"
import NotFound from "./NotFound"
import Admin from "./pages/Admin"
import PrivateRoute from "./Routes/PrivateRoute"
import AdminRoute from "./Routes/AdminRoute"
import User from "./pages/User"
import Contact from "./pages/Contact"
import WatchPage from "./pages/WatchPage"
import MoviePage from "./pages/MoviePage"
import StorePage from "./pages/Storepage"
import SeriesPage from "./pages/SeriesPage"

function App() {
  return (
    <Routes>

      {/* ROOT */}
      <Route path="/" element={<RootLayout />}>
        {/* PUBLIC */}
        <Route index element={<Home />} />
        <Route path="introduce" element={<Introduce />} />
        {/* PRIVATE */}
        <Route element={<PrivateRoute />}>
          <Route path="title/:id" element={<TitlePage />} />
          <Route path="watch/:id" element={<WatchPage />} />
          <Route path="/user" element={<User />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="contact" element={<Contact />} />
          <Route path="movie" element={<MoviePage />} />
          <Route path="store" element={<StorePage />} />
          <Route path="series" element={<SeriesPage />} />
        </Route>
      </Route>

      {/* AUTH */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      
      {/* 403 */}
      <Route path="/notallowed" element={<NotAllowed />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App
