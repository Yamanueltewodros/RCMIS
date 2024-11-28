const User = require("../models/User");
const bcrypt = require("bcrypt");

// Add a new user
// when used as an API endpoint, this function is used to create a new admin.
async function signupUser(req) {

    try {
        const defaultPassword = "password123";
        const {
            name,
            fatherName,
            grandfatherName,
            phoneNumber,
            role,
            dateOfBirth,
            gender,
            address,
        } = req.body;

        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const newUser = new User({
            name,
            fatherName,
            grandfatherName,
            phoneNumber,
            password: hashedPassword,
            role,
            dateOfBirth,
            gender,
            address,
        });

        const savedUser = await newUser.save();
        return savedUser;
    } catch (error) {
        console.error("Error in signupUser:", error);
        throw error;
    }
}

// API endpoint - Remove Admin user
async function removeAdmin(req, res) {
    try{
        removeUser(req.params.id);
    }
    catch (error) {
        console.log(error);
        console.log("Internal server error");
        res.status(400).json({
            error: "Unable to remove admin. Please try again later.",
        });
    }
};


// Remove a user
async function removeUser(id) {
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.findByIdAndDelete(id);
    }
    catch (error) {
        console.log(error);
        console.log("Internal server error");
        res.status(400).json({
            error: "Unable to remove user. Please try again later.",
        });
    }
}   

// API - Reset Password
async function resetPassword(req, res) {
    try {
        const { id, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findByIdAndUpdate(id, { password: hashedPassword });
    }
    catch (error) {
        console.log(error);
        console.log("Internal server error");
        res.status(400).json({
            error: "Unable to reset password. Please try again later.",
        });
    }
}

// TODO: send a code to user's phone number
// TODO: verify the code and reset the password

module.exports = { signupUser, removeUser, removeAdmin, resetPassword };
