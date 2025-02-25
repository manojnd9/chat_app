/**
 * Since authentication and add/create user functionality is not there in front-end,
 * and backend has been written to validate users in database before joining the chat-room
 * or sending/getting messages, providing a hacky fix to create some seed users when
 * backend is created for first time and database is empty. This will align with the
 * front-end fix of three hard-coded users.
 */
import { prisma } from '../prisma';

export async function seed_users() {
    try {
        const users_count = await prisma.user.count();
        if (users_count === 0) {
            console.log('No users found. Creating default users...');
            await prisma.user.createMany({
                data: [
                    { id: 1, username: 'User 1' },
                    { id: 2, username: 'User 2' },
                    { id: 3, username: 'User 3' },
                ],
            });
            console.log('Default users created!');
        } else {
            console.log('Users already exist. Skipping user creation.');
        }
    } catch (e) {
        console.error('Error seeding users:', e);
    }
}
