import { prisma } from './prisma';

async function main() {
    const user = await prisma.user.create({
        data: {
            username: 'john doe',
        },
    });

    console.log('User Created: ', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
