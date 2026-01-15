import { useState } from 'react';
import { User as UserIcon, Mail, Eye, EyeOff, Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../firebase/AuthService';
import Swal, { swalSuccess } from '../../lib/swal';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /* ===== Password rules (live) ===== */
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasMinLen = password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (!(hasUpper && hasLower && hasNumber && hasSpecial && hasMinLen)) {
      setError('Mật khẩu chưa đáp ứng đầy đủ yêu cầu');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, username);

      const timer = 3000;
      let navigated = false;

      // Fallback đề phòng SweetAlert bị treo
      const fallback = setTimeout(() => {
        if (!navigated) {
          try { Swal.close(); } catch {}
          document
            .querySelectorAll('.swal2-container, .swal2-backdrop')
            .forEach(el => el.remove());

          try {
            document.body.classList.remove('swal2-shown', 'swal2-height-auto');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          } catch {}

          navigate('/auth/login', { replace: true, state: { email } });
          navigated = true;
        }
      }, timer + 200);

      await swalSuccess({
        title: 'Đăng ký thành công',
        text: 'Bạn sẽ được chuyển tới trang đăng nhập',
        timer,
      });

      // Cleanup SweetAlert
      try { Swal.close(); } catch {}
      document
        .querySelectorAll('.swal2-container, .swal2-backdrop')
        .forEach(el => el.remove());

      try {
        document.body.classList.remove('swal2-shown', 'swal2-height-auto');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      } catch {}

      clearTimeout(fallback);

      if (!navigated) {
        navigate('/auth/login', { replace: true, state: { email } });
        navigated = true;
      }

    } catch (err) {
      const code = err?.code;
      if (code === 'auth/email-already-in-use') {
        setError('Email này đã được sử dụng');
      } else if (code === 'auth/invalid-email') {
        setError('Email không hợp lệ');
      } else {
        setError('Đăng ký thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-black overflow-hidden">
      {/* Background posters */}
      <div className="absolute inset-0 opacity-40">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 transform rotate-12 scale-125">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded overflow-hidden bg-gray-900 blur-[2px]"
            >
              <img
                src={`https://picsum.photos/seed/register${i}/400/600`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">
            Join and enjoy unlimited movies, TV shows
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Enter your username"
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              />
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="Enter your email"
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter your password"
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password checklist */}
            <ul className="mt-2 space-y-1 text-sm">
              {[
                [hasUpper, 'Ít nhất 1 chữ hoa'],
                [hasLower, 'Ít nhất 1 chữ thường'],
                [hasNumber, 'Ít nhất 1 chữ số'],
                [hasSpecial, 'Ít nhất 1 ký tự đặc biệt'],
                [hasMinLen, 'Tối thiểu 8 ký tự'],
              ].map(([ok, label], i) => (
                <li key={i} className="flex items-center gap-2 text-gray-400">
                  {ok ? <Check size={14} className="text-green-400" /> : <X size={14} className="text-red-400" />}
                  <span className={ok ? 'text-green-300' : ''}>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
              placeholder="Confirm your password"
              className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
            />
          </div>

          {error && (
            <div className="text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50914] hover:bg-[#ff1f2d] text-white font-bold py-3 rounded-lg transition active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-white font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
