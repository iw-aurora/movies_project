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

  // Password requirement checks (live)
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
      setError('Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và tối thiểu 8 ký tự');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, username);

      const timer = 3000;
      let navigated = false;
      const fallback = setTimeout(() => {
        if (!navigated) {
          try { Swal.close(); } catch (e) {}
          document.querySelectorAll('.swal2-container, .swal2-backdrop').forEach((el) => el.remove());          // Restore any body styles/classes SweetAlert may have left (prevent scroll lock)
          try {
            document.body.classList.remove('swal2-shown', 'swal2-height-auto');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          } catch (e) {}          navigate('/auth/login', { replace: true, state: { email } });
          navigated = true;
        }
      }, timer + 200);

      await swalSuccess({ title: 'Đăng ký thành công', text: 'Bạn sẽ được chuyển tới trang đăng nhập', timer });

      try { Swal.close(); } catch (e) {}
      document.querySelectorAll('.swal2-container, .swal2-backdrop').forEach((el) => el.remove());
      // Restore body state in case SweetAlert left scroll disabled
      try {
        document.body.classList.remove('swal2-shown', 'swal2-height-auto');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      } catch (e) {}
      clearTimeout(fallback);
      if (!navigated) {
        navigate('/auth/login', { replace: true, state: { email } });
        navigated = true;
      }

    } catch (err) {
      console.error('Register error', err);
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
      <div className="absolute inset-0 opacity-30">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 transform rotate-12 scale-125">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded shadow-2xl overflow-hidden bg-gray-900 filter blur-[2px]">
              <img
                src={`https://picsum.photos/seed/register${i}/400/600`}
                alt="Movie backdrop"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none"></div>

      {/* Register card */}
      <div className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-gray-400 text-sm">Join and enjoy unlimited movies, TV shows, and more</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Username</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
                required
              />
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>

          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>

          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password requirements checklist */}
              <div className="mt-2 text-sm">
                <ul className="space-y-1">
                  <li className="flex items-center gap-2 text-gray-300">
                    {hasUpper ? <Check className="text-green-400" size={16} /> : <X className="text-red-400" size={16} />}
                    <span className={hasUpper ? 'text-green-300' : 'text-gray-400'}>Có ít nhất một chữ hoa (A-Z)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    {hasLower ? <Check className="text-green-400" size={16} /> : <X className="text-red-400" size={16} />}
                    <span className={hasLower ? 'text-green-300' : 'text-gray-400'}>Có ít nhất một chữ thường (a-z)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    {hasNumber ? <Check className="text-green-400" size={16} /> : <X className="text-red-400" size={16} />}
                    <span className={hasNumber ? 'text-green-300' : 'text-gray-400'}>Có ít nhất một chữ số (0-9)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    {hasSpecial ? <Check className="text-green-400" size={16} /> : <X className="text-red-400" size={16} />}
                    <span className={hasSpecial ? 'text-green-300' : 'text-gray-400'}>Có ít nhất một ký tự đặc biệt (ví dụ: !@#$%)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    {hasMinLen ? <Check className="text-green-400" size={16} /> : <X className="text-red-400" size={16} />}
                    <span className={hasMinLen ? 'text-green-300' : 'text-gray-400'}>Ít nhất 8 ký tự</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
                  required
                />
              </div>

            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="terms" className="w-4 h-4 accent-[#E50914] bg-transparent rounded border-white/20" required />
            <label htmlFor="terms" className="text-sm text-gray-400">
              I agree to the <span className="text-white hover:underline cursor-pointer">Terms of Service</span> and <span className="text-white hover:underline cursor-pointer">Privacy Policy</span>.
            </label>
          </div>

          {/* Inline error message */}
          {error && (
            <div className="text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#ff1f2d]'} bg-[#E50914] text-white font-bold py-3 rounded-lg transition-all duration-200 active:scale-95 transform`}
          >
            {loading ? 'Đang tạo...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/80 px-2 text-gray-400">Or continue with</span>
          </div>
        </div> */}

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link to="/auth/login" className="text-white font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
