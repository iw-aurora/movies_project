import React from 'react';
import ProfileHero from '../components/user/ProfileHero';
import ContinueWatching from '../components/user/ContinueWatching';
import UserList from '../components/user/UserList';
import UserComment from '../components/user/UserComment';
import ChangePass from '../components/user/ChangePass';
import Header from '../components/admin/Header';
import Footer from '../components/home/Footer';

const User = () => {
  const tabs = ['Overview', 'Favorites', 'Watch History', 'Reviews', 'Settings'];
  const [activeTab, setActiveTab] = React.useState('Overview');

  return (
    <>
        <Header/>
        <main className="pt-24 pb-12 px-8 max-w-7xl mx-auto">
        <ProfileHero onEditProfileClick={() => setActiveTab('Settings')} />

        <nav className="flex items-center gap-8 border-b border-white/10 mb-10 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
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
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 space-y-10">
                        <ContinueWatching onViewAllClick={() => setActiveTab('Watch History')} />
                        <UserList />
                    </div>
                    <div className="lg:w-80 shrink-0 space-y-10">
                        <UserComment 
                            isFullView={false} 
                            onViewAllClick={() => setActiveTab('Reviews')}
                        />
                         <div className="h-[420px]">   
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
                <div className="max-w-3xl">
                    <UserComment isFullView={true} />
                </div>
            )}

            {activeTab === 'Settings' && (
                <div className="max-w-2xl">
                    <ChangePass compact={false} />
                </div>
            )}
        </div>
        </main>
        <Footer/>
    </>
  );
};

export default User;
