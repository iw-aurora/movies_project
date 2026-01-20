import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../firebase/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import MoviesCard from '../home/MoviesCard';
import { Loader2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserList = ({ compact = false, onViewAllClick }) => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMovies([]);
      setLoading(false);
      return;
    }

    // Identify if we should limit at query level or client level. 
    // Since we want realtime updates, fetching all and slicing client side is fine for "my list" 
    // (usually < 100 items), but query limit is better for scale. 
    // However, keeping consistent with existing logic (fetching all) and just slicing for display.
    const q = query(
        collection(db, 'users', user.uid, 'my_list'),
        orderBy('addedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMovies(list);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching my list:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const displayMovies = compact ? movies.slice(0, 5) : movies;

  if (loading) {
      return (
          <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
      );
  }

  if (!user) return null;

  if (movies.length === 0) {
      return (
        <section className="mb-12">
            <h2 className="text-xl font-bold text-white tracking-tight mb-6">
                Danh sách yêu thích
            </h2>
            <div className="flex flex-col items-center justify-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-white/10 transition-colors">
                <Heart size={48} className="text-zinc-700 mb-4 group-hover:text-red-500/50 transition-colors" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Danh sách trống</p>
                <Link to="/" className="mt-4 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-white transition-colors">
                    Khám phá phim ngay
                </Link>
            </div>
        </section>
      );
  }

  return (
    <section className={compact ? "" : "mb-12"}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Danh sách yêu thích
        </h2>
        
        {compact && onViewAllClick ? (
            <button 
                onClick={onViewAllClick}
                className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 group"
            >
                <span>Xem tất cả ({movies.length})</span>
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </button>
        ) : (
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                {movies.length} Phim
            </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayMovies.map((movie) => (
          <div key={movie.id}>
             <MoviesCard movie={movie} layout="POSTER" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserList;
