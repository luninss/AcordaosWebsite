var User = require('../models/users')
var bcrypt = require('bcrypt')



// Hashing function
const hashPassword = async (password) => {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}


module.exports.login = async (id, password) => {
    try {
        // Retrieve the user by their ID
        const user = await User.findOne({ username: id });
            if (!user) {
                throw new Error('User not found');
            }
            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, user.hashedPassword);
            return isMatch;
        }
        catch (error) {
            return error;
        }
    }

module.exports.registar = async (u) => {
    try {
        // Hash the password before storing it
        const hashedPassword = await hashPassword(u.password);
        // Create a new user with the hashed password
        const user = new User({ username: u.username, password: hashedPassword, name: u.name, level: "Normal" });
        // Save the user to the database
        await user.save();
        return user;
    } catch (error) {
        return error;
    }
}

