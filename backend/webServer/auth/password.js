import bcrypt from 'bcrypt';

export const createHashedPassword =
    async (password) => {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);// generates a unqiue salt

            const hashedPassword = await bcrypt.hash(password, salt);// uses that salt to encrypt the password

            return { hashedPassword, salt };
        } catch (error) {
            console.error('Error generating salt or hashing password:', error);
            throw error; // Handle the error as needed
        }
    };

export const comparePassword =
    async (password, hashedPassword) => {
        try {
            const match = await bcrypt.compare(password, hashedPassword);
            return match;
        } catch (error) {
            console.error('Error comparing password:', error);
            throw error; // Handle the error as needed
        }
    };