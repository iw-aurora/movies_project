import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { login, googleSignIn } from '../firebase/AuthService';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || '';
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(email, password);

      setError(null);
      // Redirect back to the original page (if any) or home
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      console.error('Login error', err);
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Email không hợp lệ');
          break;
        case 'auth/user-not-found':
          setError('Người dùng không tồn tại');
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Mật khẩu không đúng');
          break;
        default:
          setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError(null);

      await googleSignIn();

      setError(null);
      // Redirect back to the original page (if any) or home
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      console.error('Google sign-in error', err);

      if (err && (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request')) {
        // user cancelled - no alert
      } else if (err && (err.code === 'auth/popup-blocked' || err.code === 'popup/timeout')) {
        setError('Popup bị chặn hoặc hết thời gian. Vui lòng cho phép popup hoặc thử lại.');
      } else {
        setError(err?.message || 'Có lỗi khi đăng nhập bằng Google');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="bg-[#141414] min-h-screen text-white">
      <LoginForm
        onLogin={handleLogin}
        onGoogleSignIn={handleGoogleSignIn}
        loading={loading}
        googleLoading={googleLoading}
        error={error}
        clearError={() => setError(null)}
        initialEmail={initialEmail}
      />
    </div>
  );
};

export default LoginPage;
