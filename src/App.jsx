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

function App() {
  return (
    <Routes>

      {/* ROOT */}
      <Route path="/" element={<RootLayout />}>
        {/* PUBLIC */}
        <Route index element={<Home />} />
        <Route path="introduce" element={<Introduce />} />
        <Route path="contact" element={<Contact />} />
        {/* PRIVATE */}
        <Route element={<PrivateRoute />}>
          <Route path="title/:id" element={<TitlePage />} />
          <Route path="watch/:id" element={<WatchPage />} />
        </Route>
      </Route>

      {/* AUTH */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      
      {/* USER PROFILE - Protected (with own Header) */}
      <Route element={<PrivateRoute />}>
        <Route path="/user" element={<User />} />
      </Route>
      
      {/* ADMIN - Protected */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<Admin />} />
      </Route>
      {/* 403 */}
      <Route path="/notallowed" element={<NotAllowed />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App
