import User from '../api/models/user.model.js';

/**
 * Check if a registration number exists in the database.
 * @param {string} regnumber - The registration number to check.
 * @returns {Promise<boolean>} - Returns true if exists, false otherwise.
 */
const checkRegNumberExists = async (regnumber) => {
    try {
        const user = await User.findOne({ regnumber });
        return user !== null;
    } catch (error) {
        console.error('Error checking registration number:', error);
        throw new Error('Database error');
    }
};

export default { checkRegNumberExists };