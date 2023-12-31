import express from 'express';
import { User } from '../models/userModel.js';

const router = express.Router();

router.post('/', async (request, response) => {
  try {
    if (
      !request.body.studentId ||
      !request.body.email ||
      !request.body.password ||
      !request.body.firstName ||
      !request.body.lastName
    ) {
      return response.status(400).send({
        message: 'Send all required fields: studentId, email, password, firstName, lastName',
      });
    }
    const newUser = {
      studentId: request.body.studentId,
      email: request.body.email,
      password: request.body.password,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
    };

    const user = await User.create(newUser);

    return response.status(201).send(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get('/', async (request, response) => {
  try {
    const users = await User.find({});

    return response.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const user = await User.findById(id);

    return response.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.put('/:id', async (request, response) => {
  try {
    if (
      !request.body.studentId ||
      !request.body.email ||
      !request.body.password ||
      !request.body.firstName ||
      !request.body.lastName
    ) {
      return response.status(400).send({
        message: 'Send all required fields: studentId, email, password, firstName, lastName',
      });
    }

    const { id } = request.params;

    const result = await User.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'USer not found' });
    }

    return response.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await User.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'User not found' });
    }

    return response.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;