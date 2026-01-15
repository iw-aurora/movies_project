import { useAuth } from '../../Context/AuthContext';

const ProfileHero = () => {
  const { user } = useAuth();

  return (
    <div className="relative w-full h-[350px] rounded-3xl overflow-hidden mb-8">
      {/* Background Cover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-black/80">
        <img
          src="https://picsum.photos/seed/cinema/1200/400"
          className="w-full h-full object-cover mix-blend-overlay opacity-50"
          alt="cover"
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="flex items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden shadow-2xl">
              <img
                src={user?.photoURL || 'https://picsum.photos/200'}
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            </div>
            <span className="absolute bottom-1 right-1 bg-red-600 text-[10px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
              PRO
            </span>
          </div>

          <div className="flex-1 pb-2">
            <h1 className="text-4xl font-black text-white mb-2">
              {user?.displayName || 'Alex Doe'}
            </h1>
            <div className="flex items-center gap-4 text-gray-300 text-sm font-medium">
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-calendar"></i>
                <span>Member since 2021</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Premium Plan</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-2">
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/10 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all">
              <i className="fa-solid fa-pen-to-square"></i>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
