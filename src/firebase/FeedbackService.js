import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const sendFeedback = async (feedbackData) => {
    try {
        const docRef = await addDoc(collection(db, "feedbacks"), {
            ...feedbackData,
            createdAt: serverTimestamp(),
            status: 'pending' // pending, reviewed, etc.
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding feedback: ", error);
        return { success: false, error: error.message };
    }
};
