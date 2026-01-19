import { useState, useEffect, useRef, useCallback } from 'react';
import { Play } from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { saveWatchProgress, getMovieProgress } from '../../firebase/HistoryService';

const VidPlayer = ({ trailerUrl, movie, backdropUrl }) => {
  const { user } = useAuth();
  const [isStarted, setIsStarted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0); // Estimated duration (or passed prop)
  const [readyToSeek, setReadyToSeek] = useState(false);
  const playerRef = useRef(null);
  const lastSavedTimeRef = useRef(0);
  // Interval ref for auto-saving if we can get time (Mocking for basic iframe)
  const intervalRef = useRef(null);

  // Load progress
  useEffect(() => {
    if (isStarted && user && movie?.id) {
      const loadProgress = async () => {
         const savedData = await getMovieProgress(user.uid, movie.id);
         if (savedData?.progress) {
             setPlayed(savedData.progress);
             setReadyToSeek(true);
             // NOTE: With a basic iframe, we can't programmatically seek easily without the YouTube Player API wrapper.
             // This logic is prepared for when we re-enable a smarter player.
             console.log("Found progress:", savedData.progress);
         }
      };
      loadProgress();
    }
  }, [isStarted, user, movie]);

  useEffect(() => {
    // Basic iframe cleanup on unmount
    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSaveProgress = useCallback(async (currentProgress, totalDuration) => {
    if (!user || !movie || !currentProgress) return;
    await saveWatchProgress(user.uid, movie, currentProgress, totalDuration);
  }, [user, movie]);

  // Handle manual "mark as watched" or simple time tracking if we upgrade later
  // For now, we just render the iframe.

  if (!movie) return null;

  return (
    <div className="relative group aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-blue-500/20">
      {!isStarted ? (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={() => setIsStarted(true)}
        >
          <img
            src={backdropUrl || "https://images.unsplash.com/photo-1489599849909-33c4e652c2a9?q=80&w=2670&auto=format&fit=crop"}
            alt="Backdrop"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 grayscale group-hover:grayscale-0"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 md:w-24 md:h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform hover:bg-blue-500 group-hover:shadow-blue-500/60">
              <Play fill="white" className="text-white ml-1" size={36} />
            </button>
          </div>
          <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-2">
            <span className="text-blue-500 font-black text-xs uppercase tracking-[0.3em]">Now Playing</span>
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{movie.title || movie.name}</h2>
          </div>
        </div>
      ) : (
        <iframe
          ref={playerRef}
          src={`${trailerUrl || 'https://www.youtube.com/embed/AQsZqe4HW-8'}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
          title="MoonPlay Video Player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
      <div className={`absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] rounded-3xl ${isStarted ? 'hidden' : ''}`} />
    </div>
  );
};

export default VidPlayer;
