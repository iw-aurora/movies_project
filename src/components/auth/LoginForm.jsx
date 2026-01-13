import { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-black overflow-hidden">
      {/* Background posters */}
      <div className="absolute inset-0 opacity-40">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 transform rotate-12 scale-125">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded shadow-2xl overflow-hidden bg-gray-900 filter blur-[2px]">
              <img
                src={`https://picsum.photos/seed/movie${i}/400/600`}
                alt="Movie backdrop"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none"></div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Email or Username</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-semibold text-white">Password</label>
              <button type="button" className="text-xs text-gray-400 hover:text-white">Forgot password?</button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="remember" className="w-4 h-4 accent-[#E50914] bg-transparent rounded border-white/20" />
            <label htmlFor="remember" className="text-sm text-gray-400">Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#E50914] hover:bg-[#ff1f2d] text-white font-bold py-3 rounded-lg transition-colors duration-200 active:scale-95 transform"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0c0c0c] px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social login */}
        <button className="w-full bg-[#1a1a1a] border border-white/10 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#252525] transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Google</span>
        </button>

        <p className="mt-8 text-center text-sm text-gray-400">
          New to MoonPlay? <Link to="/auth/register" className="text-white font-bold hover:underline">Sign up now</Link>
        </p>
      </div>

    </div>
  );
};

export default LoginForm;
