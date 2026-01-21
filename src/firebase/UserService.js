import { db } from "./firebaseConfig";
import { collection, onSnapshot, doc, updateDoc, setDoc, getDoc, query, where, getCountFromServer } from "firebase/firestore";

/**
 * Lấy thông tin profile người dùng
 * @param {string} userId - ID của user
 * @returns {Promise<Object|null>} - Dữ liệu user hoặc null
 */
export const getUserProfile = async (userId) => {
    const snap = await getDoc(doc(db, "users", userId));
    return snap.exists() ? snap.data() : null;
};

/**
 * Kiểm tra xem user có tồn tại không và trả về snapshot
 * @param {string} userId
 * @returns {Promise<DocumentSnapshot>}
 */
export const getUserSnapshot = async (userId) => {
    return await getDoc(doc(db, "users", userId));
};


/**
 * Lắng nghe thay đổi danh sách users theo thời gian thực
 * @param {Function} callback - Hàm gọi lại khi có dữ liệu mới
 * @param {Function} onError - Hàm xử lý lỗi
 * @returns {Function} - Hàm unsubscribe
 */
export const subscribeToUsers = (callback, onError) => {
    return onSnapshot(
        collection(db, "users"),
        (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(list);
        },
        (error) => {
            if (onError) onError(error);
        }
    );
};

/**
 * Cập nhật thông tin người dùng
 * @param {string} userId - ID của user
 * @param {Object} data - Dữ liệu cần cập nhật
 */
export const updateUser = async (userId, data) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, data);
};

/**
 * Thay đổi trạng thái khóa/mở khóa của người dùng
 * @param {string} userId - ID của user
 * @param {string} newStatus - Trạng thái mới ('active' hoặc 'locked')
 */
export const updateUserStatus = async (userId, newStatus) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { status: newStatus });
};

/**
 * Tạo profile người dùng mới trong Firestore
 * (Thường được gọi sau khi tạo Auth thành công)
 * @param {string} userId - UID từ Auth
 * @param {Object} userData - Dữ liệu người dùng
 */
export const createUserProfile = async (userId, userData) => {
    await setDoc(doc(db, "users", userId), userData);
};

// Import storage functions needed
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

/**
 * Upload avatar user lên Firebase Storage
 * @param {string} userId 
 * @param {File} file 
 * @returns {Promise<string>} Download URL
 */
export const uploadUserAvatar = async (userId, file) => {
    const storageRef = ref(storage, `avatars/${userId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
};

/**
 * Lấy thống kê hoạt động của người dùng
 * @param {string} userId 
 * @returns {Promise<Object>} { favorites, history, comments }
 */
export const getUserStats = async (userId) => {
    try {
        const favoritesColl = collection(db, 'users', userId, 'my_list');

        // Watch History is top-level collection
        const historyQuery = query(
            collection(db, 'watch_history'),
            where('userId', '==', userId)
        );

        const commentsQuery = query(
            collection(db, 'movie_comments'),
            where('userId', '==', userId)
        );

        const [favoritesSnap, historySnap, commentsSnap] = await Promise.all([
            getCountFromServer(favoritesColl),
            getCountFromServer(historyQuery),
            getCountFromServer(commentsQuery)
        ]);

        return {
            favorites: favoritesSnap.data().count,
            history: historySnap.data().count,
            comments: commentsSnap.data().count
        };
    } catch (e) {
        console.error("Error fetching stats:", e);
        return { favorites: 0, history: 0, comments: 0 };
    }
};

/**
 * Xóa tài khoản người dùng và tất cả dữ liệu liên quan
 * @param {string} userId - ID của user cần xóa
 * @returns {Promise<void>}
 */
export const deleteUserAccount = async (userId) => {
    const { deleteDoc, getDocs } = await import("firebase/firestore");

    try {
        // 1. Xóa favorites (my_list subcollection)
        const favoritesRef = collection(db, 'users', userId, 'my_list');
        const favoritesSnap = await getDocs(favoritesRef);
        const favoriteDeletes = favoritesSnap.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(favoriteDeletes);

        // 2. Xóa watch history
        const historyQuery = query(
            collection(db, 'watch_history'),
            where('userId', '==', userId)
        );
        const historySnap = await getDocs(historyQuery);
        const historyDeletes = historySnap.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(historyDeletes);

        // 3. Xóa comments
        const commentsQuery = query(
            collection(db, 'movie_comments'),
            where('userId', '==', userId)
        );
        const commentsSnap = await getDocs(commentsQuery);
        const commentDeletes = commentsSnap.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(commentDeletes);

        // 4. Xóa user document
        await deleteDoc(doc(db, 'users', userId));

        console.log(`Successfully deleted user ${userId} and all related data`);
    } catch (error) {
        console.error("Error deleting user account:", error);
        throw error;
    }
};
