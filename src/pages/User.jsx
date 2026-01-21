import React from 'react';
import ProfileHero from '../components/user/ProfileHero';
import UserList from '../components/user/UserList';
import UserComment from '../components/user/UserComment';
import ChangePass from '../components/user/ChangePass';


const User = () => {
  const tabs = ['Favorites', 'Reviews', 'Settings'];
  const [activeTab, setActiveTab] = React.useState('Favorites');

  return (
    <>
        <main className="pt-24 pb-12 px-4 md:px-8 container mx-auto">
        <ProfileHero onEditProfileClick={() => setActiveTab('Settings')} />

        <nav className="flex items-center gap-4 md:gap-8 border-b border-white/10 mb-6 md:mb-10 overflow-x-auto no-scrollbar scroll-smooth">
            {tabs.map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 md:pb-4 text-xs md:text-sm font-bold transition-all relative whitespace-nowrap shrink-0 ${
                activeTab === tab
                    ? 'text-white'
                    : 'text-gray-500 hover:text-white'
                }`}
            >
                {tab}
                {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
            </button>
            ))}
        </nav>

        <div className="min-h-[500px]">


            {activeTab === 'Favorites' && (
                <UserList />
            )}



            {activeTab === 'Reviews' && (
                <div className="w-full">
                    <UserComment isFullView={true} />
                </div>
            )}

            {activeTab === 'Settings' && (
                <div className="w-full">
                    <ChangePass compact={false} />
                </div>
            )}
        </div>
        </main>
    </>
  );
};

export default User;
