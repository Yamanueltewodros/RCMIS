const jwt = require("jsonwebtoken");
const secretKey = require("../configuration/jwtConfig");

function generateToken(user) {
    const payload = {
        id: user._id,
        // name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
    };
    return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

function generateRefreshToken(user) {
    const payload = {
        id: user._id,
        // name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
    };
    return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

function verifyToken(token) {
    return jwt.verify(token, secretKey);
}

module.exports = {
    generateToken,
    verifyToken,
    generateRefreshToken,
};
