// pages/NotAllowed.jsx
import { Link, useLocation } from "react-router-dom"

const NotAllowed = () => {
  const location = useLocation();
  const role = location.state?.role;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold mb-4">403</h1>
      <p className="text-lg mb-6">
        Bạn không có quyền truy cập trang này.
        {role && <span className="block text-sm text-gray-500 mt-2">Current Role: {String(role)}</span>}
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-black text-white rounded hover:opacity-80"
      >
        Về trang chủ
      </Link>
    </div>
  )
}

export default NotAllowed
