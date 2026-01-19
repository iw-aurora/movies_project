import { db } from './firebaseConfig';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    limit,
    serverTimestamp
} from 'firebase/firestore';

const HISTORY_COLLECTION = 'watch_history';

/**
 * Save user watch progress
 * Uses top-level collection for better accessibility/rules
 */
export const saveWatchProgress = async (userId, movie, progress, duration, episode = null) => {
    if (!userId || !movie?.id) return;

    const percentage = duration > 0 ? (progress / duration) * 100 : 0;
    const isFinished = percentage >= 95;

    // Use a predictable ID: userId_movieId
    const docId = `${userId}_${movie.id}`;
    const historyRef = doc(db, HISTORY_COLLECTION, docId);

    try {
        if (isFinished) {
            await deleteDoc(historyRef);
        } else {
            const data = {
                userId, // Needed for querying
                movieId: movie.id.toString(),
                title: movie.title || movie.name,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                progress,
                duration,
                percentage,
                lastWatched: serverTimestamp(),
                type: movie.type || (movie.title ? 'movie' : 'tv'),
            };

            if (episode) {
                data.episode = episode;
            }

            await setDoc(historyRef, data, { merge: true });
        }
    } catch (error) {
        console.error("Error saving watch progress:", error);
    }
};

/**
 * Get user's watch history
 */
export const getWatchHistory = async (userId) => {
    if (!userId) return [];

    try {
        const q = query(
            collection(db, HISTORY_COLLECTION),
            where('userId', '==', userId),
            limit(20)
        );

        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return history.sort((a, b) => {
            const timeA = a.lastWatched?.toDate?.() || 0;
            const timeB = b.lastWatched?.toDate?.() || 0;
            return timeB - timeA;
        });
    } catch (error) {
        console.error("Error fetching watch history:", error);
        return [];
    }
};

/**
 * Get specific movie progress
 */
export const getMovieProgress = async (userId, movieId) => {
    if (!userId || !movieId) return null;
    try {
        const docId = `${userId}_${movieId}`;
        const docRef = doc(db, HISTORY_COLLECTION, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error("Error fetching movie progress:", error);
        return null;
    }
};
