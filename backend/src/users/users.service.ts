import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        role: Role.OWNER, // typically only manage owner accounts
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        business: {
          include: {
            landingPage: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async toggleStatus(id: string, isActive: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan.');
    }

    if (user.role === Role.SUPER_ADMIN) {
      throw new BadRequestException('Tidak diperkenankan mengubah status Super Admin.');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan.');
    }

    if (user.role === Role.SUPER_ADMIN) {
      throw new BadRequestException('Tidak diperkenankan menghapus akun Super Admin.');
    }

    await this.prisma.user.delete({ where: { id } });
    return {
      message: 'Akun user dan semua data bisnis terkait berhasil dihapus.',
    };
  }
}
