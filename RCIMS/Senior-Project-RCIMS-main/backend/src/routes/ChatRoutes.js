const express = require("express");
const router = express.Router();

const {
    createChat,
    getChatDetails,
    getAllChatsOfUser,
    createMessage,
    getContactList
} = require("../controller/ChatController");

router.post("/create-chat", createChat);
router.get("/chat-details/:chatId/:userId", getChatDetails);
router.get("/user-chats/:userId", getAllChatsOfUser);
router.post("/create-message", createMessage);
router.get("/contact-list/:userId", getContactList);
module.exports = router;

