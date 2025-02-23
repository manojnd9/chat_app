import { error } from 'console';
import { prisma } from '../prisma';

interface MsgSchema {
  senderId: number;
  receiverId: number;
  content: string;
}

export async function store_message(params: MsgSchema) {
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
