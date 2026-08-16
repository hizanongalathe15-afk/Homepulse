import { Prisma } from '@prisma/client';

type Role = Prisma.Enums.UserRole;
const x: Role = "ADMIN";
