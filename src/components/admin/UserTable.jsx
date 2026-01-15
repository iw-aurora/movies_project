const UserTable = ({
  users,
  onSelectUser,
  selectedUserId,
  quickSearch,
  onQuickSearchChange
}) => {
  return (
    <div className="mt-10 bg-zinc-900/20 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between bg-zinc-900/40 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            Thống kê người dùng
          </h2>
        </div>

        <div className="flex flex-1 max-w-md relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            placeholder="Tìm nhanh theo tên, email"
            value={quickSearch}
            onChange={(e) => onQuickSearchChange(e.target.value)}
            className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950/30">
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em]">
                Người dùng
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em]">
                Email
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em]">
                Mật khẩu
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em]">
                Trạng thái
              </th>
              <th className="px-8 py-5" />
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center opacity-20">
                    <svg
                      className="w-16 h-16 mb-4 text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z"
                      />
                    </svg>
                    <p className="text-lg font-bold italic tracking-tighter text-zinc-400">
                      Không có dữ liệu phù hợp
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className={`group transition-all duration-300 cursor-pointer ${
                    selectedUserId === user.id
                      ? 'bg-indigo-500/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {/* User */}
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      {(user.photoURL || user.avater || user.avatar) ? (
                         <img src={user.photoURL || user.avater || user.avatar} alt="avatar" className="w-10 h-10 rounded-xl object-cover border border-white/5" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-sm font-bold text-zinc-400">
                            {(user.username || user.displayName || 'NA').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">
                          {user.username || user.displayName || 'No Name'}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {user.fullName || user.role}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-8 py-6 text-xs text-zinc-300">
                    {user.email}
                  </td>

                  {/* Password */}
                  <td className="px-8 py-6 text-xs text-zinc-500 font-mono">
                    {user.password || user.pass || '***'}
                  </td>

                  {/* Status */}
                  <td className="px-8 py-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        user.status === 'locked'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}
                    >
                      {user.status === 'locked' ? 'Đã khóa' : 'Khả dụng'}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectUser(user);
                        }}
                        className="w-8 h-8 rounded-lg bg-zinc-800/50 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-indigo-600 transition-all"
                      >
                        ✎
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
