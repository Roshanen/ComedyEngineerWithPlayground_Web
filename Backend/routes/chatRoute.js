import express from 'express';
import { Chat } from '../models/chatModel.js';

const router = express.Router();

const isChatOwner = (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
  
    Chat.findById(id)
      .then((chat) => {
        if (!chat) {
          return res.status(404).json({ message: 'Chat not found.' });
        }
        if (chat.participants.includes(userId)) {
          next();
        } else {
          return res.status(403).json({ message: 'You do not have permission to perform this action.' });
        }
      })
      .catch((error) => {
        console.error(error.message);
        return res.status(500).json({ message: 'Error checking chat ownership.' });
      });
  };

router.post('/', async (req, res) => {
  try {
    const { content, sender, receiver } = req.body;
    if (!content || !sender || !receiver) {
      return res.status(400).json({ message: 'Content, sender, and receiver are required.' });
    }

    const newChat = new Chat({ content, sender, receiver });
    await newChat.save();

    return res.status(201).json(newChat);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error creating a chat.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find({});
    return res.status(200).json(chats);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error fetching chats.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }
    return res.status(200).json(chat);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error fetching the chat.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }
    return res.status(200).json(chat);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error updating the chat.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }
    return res.status(200).json({ message: 'Chat deleted successfully.' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error deleting the chat.' });
  }
});
// ส่วน message
router.post('/:id/send', isChatOwner, async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.id);
  
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found.' });
      }
  
      const { sender, content, file, image } = req.body;
      const message = { sender, content, file, image };
      chat.messages.push(message);
      await chat.save();
  
      return res.status(201).json({ message: 'Message sent successfully.' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Error sending a message.' });
    }
  });

  router.delete('/:id/message/:messageId', isChatOwner, async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.id);
  
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found.' });
      }
  
      const message = chat.messages.id(req.params.messageId);
  
      if (!message) {
        return res.status(404).json({ message: 'Message not found.' });
      }
  
      message.remove();
      await chat.save();
  
      return res.status(200).json({ message: 'Message deleted successfully.' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Error deleting a message.' });
    }
  });
// ส่วน group
  router.post('/group/create', async (req, res) => {
    try {
      const { participants, isGroup } = req.body;
  
      if (!participants || participants.length < 2) {
        return res.status(400).json({ message: 'Group chat requires at least two participants.' });
      }
  
      const newChat = new Chat({ participants, isGroup: true });
      await newChat.save();
  
      return res.status(201).json(newChat);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Error creating a group chat.' });
    }
  });

  router.delete('/group/:id', isChatOwner, async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.id);
  
      if (!chat || !chat.isGroup) {
        return res.status(404).json({ message: 'Group chat not found.' });
      }
  
      await chat.remove();
  
      return res.status(200).json({ message: 'Group chat deleted successfully.' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Error deleting a group chat.' });
    }
  });

  router.post('/group/:id/add-member', isChatOwner, async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.id);
  
      if (!chat || !chat.isGroup) {
        return res.status(404).json({ message: 'Group chat not found.' });
      }
  
      const { memberId } = req.body;
      chat.participants.push(memberId);
      await chat.save();
  
      return res.status(200).json({ message: 'Member added to the group chat.' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Error adding a member to the group chat.' });
    }
  });

  router.delete('/group/:id/remove-member/:memberId', isChatOwner, async (req, res) => {
    try {
      const chat = await Chat.findById(req.params.id);
  
      if (!chat || !chat.isGroup) {
        return res.status(404).json({ message: 'Group chat not found.' });
      }
  
      const { memberId } = req.params;
  
      chat.participants = chat.participants.filter((participant) => participant.toString() !== memberId);
      await chat.save();
  
      return res.status(200).json({ message: 'Member removed from the group chat.' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: 'Error removing a member from the group chat.' });
    }
  });

export default router;
