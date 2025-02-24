import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

// Create a message in db
interface MsgSendRequest {
    senderId: number;
    receiverId: number;
    content: string;
}

router.post('/', async (req: Request<{}, {}, MsgSendRequest>, res: Response) => {
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
});

// Get messages of a user from db
interface UserInfo {
    senderId: string;
    receiverId: string;
}
router.get('/getmessages', async (req: Request<UserInfo>, res: Response): Promise<any> => {
    try {
        const { senderId, receiverId } = req.query;
        // Validate sender id and receiver id
        const sender = await prisma.user.findUnique({ where: { id: Number(senderId) } });
        const receiver = await prisma.user.findUnique({
            where: { id: Number(receiverId) },
        });

        if (!sender || !receiver) {
            return res.status(400).json({ error: 'senderId and receiverId are required' });
        }
        // Fetch messages where sender & receiver match in either ways
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: Number(senderId), receiverId: Number(receiverId) },
                    { senderId: Number(receiverId), receiverId: Number(senderId) },
                ],
            },
            orderBy: { createdAt: 'asc' }, // Oldest first
        });

        res.json(messages);
    } catch (e) {
        console.error('Error fetching messages:', e);
        res.status(400).json({ error: 'Internal server error' });
    }
});

export default router;
