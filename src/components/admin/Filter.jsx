import { useState } from 'react';

const Filter = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [filters, setFilters] = useState(currentFilters);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        {/* <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-white tracking-tight">
            BỘ LỌC NÂNG CAO
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div> */}

        <div className="space-y-6">
          {/* Status Filter */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
              Trạng thái tài khoản
            </label>

            <div className="grid grid-cols-3 gap-2">
              {['all', 'active', 'locked'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilters({ ...filters, status: s })}
                  className={`py-2 px-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                    filters.status === s
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-zinc-800 border-white/5 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {s === 'all'
                    ? 'Tất cả'
                    : s === 'active'
                    ? 'Khả dụng'
                    : 'Bị khóa'}
                </button>
              ))}
            </div>
          </div>

          {/* Email Domain */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
              Tên miền Email
            </label>
            <input
              type="text"
              placeholder="Ví dụ: @fpt.edu.vn"
              value={filters.emailDomain}
              onChange={(e) =>
                setFilters({ ...filters, emailDomain: e.target.value })
              }
              className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 outline-none"
            />
          </div>

          {/* Phone Prefix */}
          {/* <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
              Đầu số điện thoại
            </label>
            <input
              type="text"
              placeholder="Ví dụ: 084"
              value={filters.phonePrefix}
              onChange={(e) =>
                setFilters({ ...filters, phonePrefix: e.target.value })
              }
              className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 outline-none"
            />
          </div> */}
        </div>

        {/* Actions
        <div className="mt-10 flex gap-3">
          <button
            onClick={() => {
              const defaultFilters = {
                status: 'all',
                emailDomain: '',
                phonePrefix: ''
              };
              setFilters(defaultFilters);
              onApply(defaultFilters);
              onClose();
            }}
            className="flex-1 py-3 bg-zinc-800 text-zinc-400 font-bold text-[11px] uppercase tracking-widest rounded-xl hover:text-white transition-all"
          >
            Xóa lọc
          </button>

          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="flex-[2] py-3 bg-white text-zinc-950 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
          >
            Áp dụng bộ lọc
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Filter;
