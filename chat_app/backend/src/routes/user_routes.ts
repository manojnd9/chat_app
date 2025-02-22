import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

// Create new user
interface CreateUserRequest {
  username: string;
}

router.post(
  '/',
  async (
    req: Request<{}, {}, CreateUserRequest>,
    res: Response
  ): Promise<void> => {
    const { username } = req.body;
    try {
      const user = await prisma.user.create({
        data: { username },
      });
      res.status(201).json(user);
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: 'Username already exists' });
    }
  }
);

// Get user by user_id
interface UserParams {
  user_id: string;
}

router.get(
  '/:user_id',
  async (req: Request<UserParams>, res: Response): Promise<void> => {
    const u_id = parseInt(req.params.user_id);

    if (isNaN(u_id)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: u_id },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found!' });
      return;
    }

    res.json(user);
  }
);

export default router;
