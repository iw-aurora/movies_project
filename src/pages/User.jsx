import React from 'react';
import ProfileHero from '../components/user/ProfileHero';
import ContinueWatching from '../components/user/ContinueWatching';
import UserList from '../components/user/UserList';
import UserComment from '../components/user/UserComment';
import ChangePass from '../components/user/ChangePass';


const User = () => {
  const tabs = ['Overview', 'Favorites', 'Watch History', 'Reviews', 'Settings'];
  const [activeTab, setActiveTab] = React.useState('Overview');

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
            {activeTab === 'Overview' && (
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    <div className="flex-1 flex flex-col gap-10">
                        <ContinueWatching onViewAllClick={() => setActiveTab('Watch History')} />
                        <UserList compact={true} onViewAllClick={() => setActiveTab('Favorites')} />
                    </div>
                    <div className="lg:w-80 shrink-0 flex flex-col gap-10 sticky top-28">
                        <UserComment 
                            isFullView={false} 
                            onViewAllClick={() => setActiveTab('Reviews')}
                        />
                         <div>   
                            <ChangePass
                                compact={true}
                                onMoreClick={() => setActiveTab('Settings')}
                            />
                        </div>
                       
                    </div>
                </div>
            )}

            {activeTab === 'Favorites' && (
                <UserList />
            )}

            {activeTab === 'Watch History' && (
                <ContinueWatching />
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
