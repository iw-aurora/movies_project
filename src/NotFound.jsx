import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white px-6">
      <h1 className="text-9xl font-black mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! Trang bạn tìm không tồn tại.</p>
      <Link 
        to="/" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
