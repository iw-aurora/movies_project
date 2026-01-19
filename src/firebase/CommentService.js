import { db } from './firebaseConfig';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    serverTimestamp,
    onSnapshot,
    updateDoc,
    deleteDoc,
    getDoc,
    doc
} from 'firebase/firestore';

const COMMENTS_COLLECTION = 'movie_comments';

/**
 * Add a new comment/review
 */
export const addComment = async (commentData) => {
    try {
        const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
            ...commentData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding comment:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get comments for a specific user
 */
/**
 * Get comments for a specific user
 * NOTE: Sorting and limiting done client-side to avoid Firestore Index requirements
 */
export const getUserComments = async (userId, limitCount = null) => {
    try {
        const q = query(
            collection(db, COMMENTS_COLLECTION),
            where('userId', '==', userId)
        );

        const querySnapshot = await getDocs(q);
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() });
        });

        // Client-side sort
        comments.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : Date.now());
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : Date.now());
            return timeB - timeA;
        });

        const finalData = limitCount ? comments.slice(0, limitCount) : comments;

        return { success: true, data: finalData };
    } catch (error) {
        console.error('Error getting user comments:', error);
        return { success: false, error: error.message, data: [] };
    }
};

/**
 * Get comments for a specific movie
 * NOTE: Sorting and limiting done client-side to avoid Firestore Index requirements
 */
export const getMovieComments = async (movieId, limitCount = null) => {
    try {
        const q = query(
            collection(db, COMMENTS_COLLECTION),
            where('movieId', '==', movieId)
        );

        const querySnapshot = await getDocs(q);
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() });
        });

        // Client-side sort
        comments.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : Date.now());
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : Date.now());
            return timeB - timeA;
        });

        const finalData = limitCount ? comments.slice(0, limitCount) : comments;

        return { success: true, data: finalData };
    } catch (error) {
        console.error('Error getting movie comments:', error);
        return { success: false, error: error.message, data: [] };
    }
};

/**
 * Subscribe to user comments (real-time)
 * NOTE: Sorting and limiting done client-side to avoid Firestore Index requirements
 */
export const subscribeToUserComments = (userId, callback, limitCount = null) => {
    try {
        const q = query(
            collection(db, COMMENTS_COLLECTION),
            where('userId', '==', userId)
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const comments = [];
            querySnapshot.forEach((doc) => {
                comments.push({ id: doc.id, ...doc.data() });
            });

            // Client-side sort
            comments.sort((a, b) => {
                const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : Date.now());
                const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : Date.now());
                return timeB - timeA;
            });

            const finalComments = limitCount ? comments.slice(0, limitCount) : comments;

            callback(finalComments);
        }, (error) => {
            console.error('Error in comment subscription:', error);
            callback([]);
        });

        return unsubscribe;
    } catch (error) {
        console.error('Error subscribing to comments:', error);
        return () => { };
    }
};

/**
 * Get all comments (for admin)
 */
export const getAllComments = async (limitCount = 100) => {
    try {
        const q = query(
            collection(db, COMMENTS_COLLECTION),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, data: comments };
    } catch (error) {
        console.error('Error getting all comments:', error);
        return { success: false, error: error.message, data: [] };
    }
};
/**
 * ADMIN: Subscribe to ALL comments real-time
 */
export const subscribeToComments = (callback) => {
    const q = query(
        collection(db, COMMENTS_COLLECTION),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const comments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Ensure createdAt follows a consistent format if needed
            createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : new Date().toISOString()
        }));
        callback(comments);
    }, (error) => {
        console.error("Error subscribing to comments:", error);
    });
};

/**
 * ADMIN: Soft delete (hide) or restore a comment
 */
export const softDeleteComment = async (commentId, isDeleted) => {
    try {
        const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
        await updateDoc(commentRef, {
            isDeleted: isDeleted
        });
        return { success: true };
    } catch (error) {
        console.error("Error updating comment status:", error);
        return { success: false, error: error.message };
    }
};

/**
 * ADMIN: Hard delete (Permanently remove) a comment
 */
export const hardDeleteComment = async (commentId) => {
    try {
        const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
        await deleteDoc(commentRef);
        return { success: true };
    } catch (error) {
        console.error("Error deleting comment:", error);
        return { success: false, error: error.message };
    }
};

/**
 * ADMIN: Extract unique movies from comment list
 */
export const getMoviesWithComments = (comments = []) => {
    const movieMap = new Map();

    comments.forEach(comment => {
        if (!comment.movieId) return;

        if (!movieMap.has(comment.movieId)) {
            movieMap.set(comment.movieId, {
                id: comment.movieId,
                title: comment.movieTitle || 'Unknown Movie',
                poster: comment.moviePoster || '',
                commentCount: 0
            });
        }

        const movie = movieMap.get(comment.movieId);

        // If we found a better title/poster in this comment, update the record
        if (movie.title === 'Unknown Movie' && comment.movieTitle) {
            movie.title = comment.movieTitle;
        }
        if (!movie.poster && comment.moviePoster) {
            movie.poster = comment.moviePoster;
        }

        movie.commentCount += 1;
    });

    // Only return movies that have a valid title
    return Array.from(movieMap.values()).filter(m => m.title !== 'Unknown Movie');
};
