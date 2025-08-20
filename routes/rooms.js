import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Room from '../models/Room.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const id = uuidv4();
    await Room.create({ roomId: id });
    res.json({ roomId: id, link: `/chat/${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

export default router;
