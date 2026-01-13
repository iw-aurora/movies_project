import { useState } from 'react';
import { User as UserIcon, Mail, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
const RegisterForm = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && email) {
      onSignup({ username, email });
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
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#E50914] hover:bg-[#ff1f2d] text-white font-bold py-3 rounded-lg transition-all duration-200 active:scale-95 transform"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black/80 px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link to="/auth/login" className="text-white font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
