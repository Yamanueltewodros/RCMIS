const Chat = require("../models/Chat");
const User = require("../models/User");
const Patient = require("../models/Patient");
const Professional = require("../models/Professional");
const createChat = async (req, res) => {
    try {
        const { senderID, receiverID } = req.body;
        // check if chat already exists
        const existingChat = await Chat.findOne({
            users: { $all: [senderID, receiverID] },
        });
        if (existingChat) {
            return res.status(200).json(existingChat);
        }
        const chat = new Chat({ users: [senderID, receiverID] });
        await chat.save();
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get chat details
const getChatDetails = async (req, res) => {
    try {
        const { chatId, userId } = req.params;
        const chat = await Chat.findById(chatId);
        
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const otherUserId = chat.users.find(id => id.toString() !== userId);
        const otherUser = await User.findById(otherUserId).select('name fatherName grandfatherName phoneNumber');

        const chatWithUserData = {
            ...chat.toObject(),
            otherUser: otherUser
        };

        res.status(200).json(chatWithUserData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get all chats of a user
const getAllChatsOfUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const chats = await Chat.find({ users: userId })
            .sort({ modifiedAt: -1 });

        const otherUserIds = chats.map((chat) => 
            chat.users.find((id) => id.toString() !== userId)
        );
        const otherUserData = await User.find({ _id: { $in: otherUserIds } });

        const chatsWithUserData = chats.map(chat => {
            const otherUserId = chat.users.find(id => id.toString() !== userId);
            const otherUser = otherUserData.find(user => user._id.toString() === otherUserId.toString());
            return {
                ...chat.toObject(),
                otherUser: otherUser
            };
        });

        res.status(200).json(chatsWithUserData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// create a new message
const createMessage = async (req, res) => {
    try{
        const {chatId, senderId, receiverID, content} = req.body
        
        // append the message to the chat
        const chat = await Chat.findById(chatId)
        chat.messages.push({sender:senderId, receiver:receiverID, content, isRead:false})
        await chat.save()
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getContactList = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        let contacts;

        if (user.role === "patient") {
            const patient = await Patient.findOne({ user: userId }).populate({
                path: 'assignedProfessionals',
                populate: {
                    path: 'user',
                    select: 'name fatherName grandfatherName phoneNumber'
                }
            });
            contacts = patient.assignedProfessionals;
        } else if (user.role === "professional") {
            const professional = await Professional.findOne({ user: userId });
            contacts = await Patient.find({ assignedProfessionals: professional._id }).populate({
                path: 'user',
                select: 'name fatherName grandfatherName phoneNumber'
            });
        } else {
            return res.status(400).json({ message: "Invalid user role" });
        }

        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createChat, getChatDetails, getAllChatsOfUser, createMessage, getContactList };
