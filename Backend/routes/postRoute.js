import express from 'express';
import { Post } from '../models/postModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { content, like, owner, privacy, picture, file } = req.body;
    if (!content || !owner) {
      return res.status(400).json({ message: 'Content and owner are required.' });
    }

    const newPost = new Post({ content, like, owner, privacy, picture, file });
    await newPost.save();

    return res.status(201).json(newPost);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error creating a post.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error fetching posts.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error fetching the post.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error updating the post.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    return res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Error deleting the post.' });
  }
});

export default router;