import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { db } from '../../firebase/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import MoviesCard from '../home/MoviesCard';
import { Loader2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserList = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMovies([]);
      setLoading(false);
      return;
    }

    // Subscribe to the user's 'my_list' subcollection
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
            <div className="flex flex-col items-center justify-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl">
                <Heart size={48} className="text-zinc-700 mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Danh sách trống</p>
                <Link to="/" className="mt-4 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-white transition-colors">
                    Khám phá phim ngay
                </Link>
            </div>
        </section>
      );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Danh sách yêu thích
        </h2>
        <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
          {movies.length} Phim
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <div key={movie.id}>
             <MoviesCard movie={movie} layout="POSTER" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserList;
