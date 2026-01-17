import { db } from "./firebaseConfig";
import { collection, onSnapshot, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

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
