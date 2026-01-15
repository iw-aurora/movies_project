import { useState } from 'react';

/* ========== InputField ========== */
const InputField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  type = 'text',
  rightElement
}) => (
  <div className="flex flex-col space-y-2 relative">
    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em] px-1">
      {label}
    </label>

    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-zinc-900/40 border border-white/5 rounded-xl px-4 py-3 pr-14 text-sm text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 focus:bg-zinc-900/80 outline-none transition-all w-full placeholder:text-zinc-700 shadow-inner"
      />

      {rightElement && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

/* ========== ActionButton ========== */
const ActionButton = ({ children, onClick, variant = 'secondary', className = '', loading = false }) => {
  const variants = {
    primary:
      'bg-white text-zinc-950 hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
    secondary:
      'bg-zinc-800/50 text-zinc-300 border border-white/5 hover:bg-zinc-800 hover:text-white',
    ghost:
      'bg-transparent text-zinc-500 hover:text-white hover:bg-white/5'
  };

  return (
    <button
      onClick={loading ? null : onClick}
      disabled={loading}
      className={`${variants[variant]} text-[10px] font-extrabold uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-all active:scale-95 ${className} ${loading ? 'opacity-50 cursor-wait' : ''}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
            <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Đang xử lý...</span>
        </div>
      ) : children}
    </button>
  );
};

/* ========== UserForm ========== */
const UserForm = ({ formData, setFormData, onAction, isEditing, loading }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-white/5 p-8 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

        <InputField
          label="Tên đăng nhập"
          name="username"
          placeholder="moon_admin"
          value={formData.username || ''}
          onChange={handleChange}
        />

        <InputField
          label="Email"
          name="email"
          placeholder="admin@gmail.com"
          value={formData.email || ''}
          onChange={handleChange}
        />

        <InputField
          label="Mật khẩu"
          name="password"
          type="text"
          placeholder="••••••••"
          value={formData.password || ''}
          onChange={handleChange}
        />

      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <div className="flex gap-3">
          <ActionButton
            variant="primary"
            onClick={() => onAction(isEditing ? 'edit' : 'add')}
            loading={loading}
          >
            {isEditing ? 'Cập nhật tài khoản' : 'Tạo tài khoản mới'}
          </ActionButton>

          {isEditing && (
            <ActionButton variant="ghost" onClick={() => onAction('reset')}>
              Hủy
            </ActionButton>
          )}
        </div>

        {isEditing && (
          <ActionButton
            variant="secondary"
            className="border-indigo-500/30 text-indigo-400"
            onClick={() => onAction('lock')}
            loading={loading}
          >
            Mở / Khóa
          </ActionButton>
        )}
      </div>
    </div>
  );
};

export default UserForm;
