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
      <div className="relative z-10 w-full max-w-md bg-zinc-900/90 backdrop-blur-2xl border border-white/10 p-5 md:p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-5 md:mb-7">
          <h1 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-400 text-[13px] md:text-sm max-w-[280px] mx-auto leading-relaxed">
            Get unlimited access to thousands of movies, TV shows, and exclusive content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          {/* Username */}
          <div className="flex flex-col gap-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Username</label>
            <div className="relative group">
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Choose a username"
                className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              />
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="name@example.com"
                className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Password</label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Create a strong password"
                className="w-full bg-zinc-800/50 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password checklist */}
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] md:text-[12px]">
              {[
                [hasUpper, '1 Upper Case'],
                [hasLower, '1 Lower Case'],
                [hasNumber, '1 Number'],
                [hasSpecial, '1 Special Char'],
                [hasMinLen, 'Min 8 Chars'],
              ].map(([ok, label], i) => {
                const isInitial = !password;
                let statusClass = 'bg-white/5 text-gray-600';
                let icon = <div className="w-1.5 h-1.5 rounded-full bg-current" />;

                if (!isInitial) {
                  if (ok) {
                    statusClass = 'bg-green-500/20 text-green-500';
                    icon = <Check size={10} />;
                  } else {
                    statusClass = 'bg-red-500/20 text-red-500';
                    icon = <X size={10} />;
                  }
                }

                return (
                  <li key={i} className={`flex items-center gap-2 transition-colors duration-300 ${!isInitial && ok ? 'text-green-400' : 'text-gray-500'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${statusClass}`}>
                      {icon}
                    </div>
                    <span className="truncate">{label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Confirm Password</label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                placeholder="Repeat your password"
                className={`w-full bg-zinc-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  !confirmPassword 
                    ? 'border-white/5 focus:ring-blue-500/50 focus:border-blue-500/50' 
                    : password === confirmPassword 
                      ? 'border-green-500/50 focus:ring-green-500/20' 
                      : 'border-red-500/50 focus:ring-red-500/20'
                }`}
              />
              {confirmPassword && (
                <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                  {password === confirmPassword ? <Check size={18} /> : <X size={18} />}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3">
              <p className="text-xs text-red-400 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors ml-1">
              Sign In
            </Link>
          </p>
          <Link to="/" className="md:hidden inline-flex items-center mt-6 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all duration-300 group">
            <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
