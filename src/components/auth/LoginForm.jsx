import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ onLogin, loading, onGoogleSignIn, googleLoading, error, clearError, initialEmail }) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError && clearError();
    await onLogin(email.trim(), password);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 bg-black overflow-hidden">
      <div className="absolute inset-0 opacity-40">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 transform rotate-12 scale-125">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded overflow-hidden bg-gray-900 blur-[2px]"
            >
              <img
                src={`https://picsum.photos/seed/movie${i}/400/600`}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

      <div className="relative z-10 w-full max-w-md bg-black/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError && clearError(); }}
              placeholder="Enter your email"
              className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
            />
          </div>

          {/* password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError && clearError(); }}
                placeholder="Enter your password"
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={googleLoading}
          className="w-full bg-[#1a1e1e] border border-white/10 py-3 rounded-lg hover:bg-[#252525] disabled:opacity-50"
        >
          {googleLoading ? 'Continue with Google' : 'Continue with Google'}
        </button>

        <p className="mt-8 text-center text-sm text-gray-400">
          New to MoonPlay?{' '}
          <Link to="/auth/register" className="text-white font-bold hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
