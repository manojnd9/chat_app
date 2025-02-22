import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

// Create a message in db
interface MsgSendRequest {
  senderId: number;
  receiverId: number;
  content: string;
}

router.post(
  '/',
  async (req: Request<{}, {}, MsgSendRequest>, res: Response) => {
    // unpack
    const { senderId, receiverId, content } = req.body;

    try {
      const message = await prisma.message.create({
        data: { senderId, receiverId, content },
      });
      res.status(201).json(message);
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: 'Invalid senderId or receiverId' });
    }
  }
);

// Get messages of a user from db
interface UserInfo {
  user_id: string;
}
router.get('/:user_id', async (req: Request<UserInfo>, res: Response) => {
  const u_id = parseInt(req.params.user_id);
  if (isNaN(u_id)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: u_id }, { receiverId: u_id }],
    },
    orderBy: { createdAt: 'asc' },
  });

  res.json(messages);
});

export default router;
