import { BACKEND_URL } from '../config';

/**
 * מקבלת נתיב תמונה ומחזירה את ה-URL המלא והתקין להצגה.
 * מטפלת במקרים של נתיב ריק, נתיב מקומי, או URL חיצוני מלא.
 * @param {string} imagePath - הנתיב כפי שהוא שמור במסד הנתונים.
 * @returns {string} - ה-URL המלא להצגה בתגית <img>.
 */
export const getImageUrl = (imagePath) => {
    // 1. אם אין נתיב כלל, החזר את תמונת ה-placeholder.
    if (!imagePath) {
        return '/images/placeholder.png';
    }

    // 2. אם הנתיב הוא כבר URL מלא, החזר אותו כפי שהוא.
    if (imagePath.startsWith('http')) {
        return imagePath;
    }

    // 3. אם הנתיב הוא של קובץ שהעלינו, הוסף לו את כתובת השרת.
    if (imagePath.startsWith('/uploads')) {
        return `${BACKEND_URL}${imagePath}`;
    }

    // 4. כמקרה ברירת מחדל (אם זה נתיב לא מזוהה), החזר placeholder.
    return '/images/placeholder.png';
};