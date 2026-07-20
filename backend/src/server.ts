import app from './app';
import prisma from './config/db';
import { hashPassword } from './utils/hash';

const PORT = process.env.PORT || 5000;

// Seed default admin account if not exists
const seedAdmin = async () => {
  try {
    const adminEmail = 'kabir@bd.com';
    const existing = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existing) {
      const passwordHash = await hashPassword('password123');
      await prisma.user.create({
        data: {
          name: 'Kabir Admin',
          email: adminEmail,
          passwordHash,
          role: 'ADMIN'
        }
      });
      console.log('[seed]: Default admin user (kabir@bd.com / password123) seeded successfully.');
    } else {
      console.log('[seed]: Admin user kabir@bd.com already exists.');
    }
  } catch (error) {
    console.error('[seed error]: Failed to seed default admin:', error);
  }
};

app.listen(PORT, async () => {
  console.log(`[server]: CareerTrack Lite Backend running on http://localhost:${PORT}`);
  await seedAdmin();
});
