import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from '../src/config/logger.config';

const prisma = new PrismaClient();

async function main() {
  logger.info('Seeding database...');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@homepulse.com' },
    update: {},
    create: {
      email: 'admin@homepulse.com',
      phone: '+254700000001',
      firstName: 'Admin',
      lastName: 'User',
      password: await bcrypt.hash('ChangeMe123!', 12),
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
      city: 'Nairobi',
    },
  });

  const landlord = await prisma.user.upsert({
    where: { email: 'landlord@homepulse.com' },
    update: {},
    create: {
      email: 'landlord@homepulse.com',
      phone: '+254700000002',
      firstName: 'John',
      lastName: 'Landlord',
      password: await bcrypt.hash('ChangeMe123!', 12),
      role: 'LANDLORD',
      isVerified: true,
      isActive: true,
      city: 'Nairobi',
    },
  });

  const tenant = await prisma.user.upsert({
    where: { email: 'tenant@homepulse.com' },
    update: {},
    create: {
      email: 'tenant@homepulse.com',
      phone: '+254700000003',
      firstName: 'Jane',
      lastName: 'Tenant',
      password: await bcrypt.hash('ChangeMe123!', 12),
      role: 'TENANT',
      isVerified: true,
      isActive: true,
      city: 'Nairobi',
    },
  });

  await prisma.property.upsert({
    where: { id: 'seed-property-1' },
    update: {},
    create: {
      id: 'seed-property-1',
      title: 'Modern Apartment in Westlands',
      description: 'A beautiful 2-bedroom apartment with modern amenities.',
      type: 'APARTMENT',
      status: 'ACTIVE',
      price: 1200,
      currency: 'USD',
      city: 'Nairobi',
      neighborhood: 'Westlands',
      address: '123 Westlands Road',
      bedrooms: 2,
      bathrooms: 2,
      area: 120,
      images: ['https://example.com/image1.jpg'],
      amenities: ['WiFi', 'Parking', 'Gym'],
      latitude: -1.2666,
      longitude: 36.8086,
      landlordId: landlord.id,
      publishedAt: new Date(),
    },
  });

  await prisma.setting.upsert({
    where: { key: 'platform_fee_percentage' },
    update: {},
    create: {
      key: 'platform_fee_percentage',
      value: 2.5,
    },
  });

  await prisma.setting.upsert({
    where: { key: 'escrow_hold_days' },
    update: {},
    create: {
      key: 'escrow_hold_days',
      value: 14,
    },
  });

  logger.info('Database seeded successfully');
}

main()
  .catch((e) => {
    logger.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
