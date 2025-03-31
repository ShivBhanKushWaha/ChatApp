import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId,io } from "../SocketIO/server.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params; // receiver ID
    const senderId = req.user._id; // logged-in sender's ID

    // Find the conversation between sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // Create the new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (!conversation) {
      // Create a new conversation if it doesn't exist
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id], // Add the new message's ID
      });
    } else {
      // If conversation exists, push the message ID to the conversation
      conversation.messages.push(newMessage._id);
    }

    // Save both the conversation and the message
    await Promise.all([conversation.save(), newMessage.save()]); // run parallel

    // socket server ke pas send krne ke liye 
    const receiverSocketId = getReceiverSocketId(receiverId);

    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage);
    }

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.log("Error in sending message", error); // Fixed console log
    res.status(500).json({ Message: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatuser } = req.params; // receiver ID
    const senderId = req.user._id; // logged-in sender's ID

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatuser] },
    }).populate("messages");

    if(!conversation){
      return res.status(201).json([]);
    }
    const messages = conversation.messages;
    res.status(201).json(messages)
  } catch (error) {
    console.log("Error in getting the message", error);
    res.status(500).json({ Message: "Internal server error" });
  }
};
