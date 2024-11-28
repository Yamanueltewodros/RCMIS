const User = require("../models/User");
const bcrypt = require("bcrypt");

async function createAdminAccount() {
    try {
        const existingAdmin = await User.findOne({ phoneNumber: "0911223344" });
        if (existingAdmin) {
            console.log("Admin account already exists");
            return;
        } else {
            const newAdmin = new User({
                name: "Admin",
                fatherName: "Admin",
                grandfatherName: "Admin",
                phoneNumber: "0911223344",
                password: await bcrypt.hash("admin1234", 10),
                role: "admin",
                dateOfBirth: new Date(),
                gender: "male",
                address: "Admin Address",
            });
            await newAdmin.save();
            console.log("Admin account created successfully");
        }
    } catch (error) {
        console.error("Error creating admin account:", error);
    }
}

module.exports = {
    createAdminAccount,
};
