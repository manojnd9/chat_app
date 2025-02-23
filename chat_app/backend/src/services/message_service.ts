import { error } from 'console';
import { prisma } from '../prisma';

interface MsgSchema {
    senderId: number;
    receiverId: number;
    content: string;
}

export async function store_message(params: MsgSchema) {
    // Validate the input data
    const sender = await prisma.user.findUnique({
        where: { id: params.senderId },
    });
    const receiver = await prisma.user.findUnique({
        where: { id: params.receiverId },
    });
    if (!sender) {
        throw new Error(`Sender with ID ${params.senderId} does not exist`);
    }
    if (!receiver) {
        throw new Error(`Receiver with ID ${params.receiverId} does not exist`);
    }
    // Check the content
    if (!params.content.trim()) {
        throw new Error('Message cannot be empty!');
    }
    if (params.content.length > 500) {
        throw new Error('Message is too long (max 500 characters only!)');
    }
    try {
        const message = await prisma.message.create({
            data: {
                senderId: params.senderId,
                receiverId: params.receiverId,
                content: params.content,
            },
        });
        return message;
    } catch (e) {
        console.error('Error in storing messages!', e);
        throw error;
    }
}

export async function get_messages(senderId: number, receiverId: number) {
    try {
        // Validate sender id and receiver id
        const sender = await prisma.user.findUnique({ where: { id: senderId } });
        const receiver = await prisma.user.findUnique({
            where: { id: receiverId },
        });

        if (!sender || !receiver) {
            throw new Error('Sender or Receiver does not exist.');
        }

        // Fetch messages where sender & receiver match in either ways
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            },
            orderBy: { createdAt: 'asc' }, // Oldest first
        });

        return messages;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}
