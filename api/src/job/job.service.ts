import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobDto, JobEditDto } from './dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async getAllJobs(pos: string, lang: string, skip: number) {
    if (pos && lang) {
      return await this.prisma.job.findMany({
        where: {
          tech: lang,
          position: pos,
        },
        skip: skip,
        take: 10,
      });
    } else if (pos) {
      return await this.prisma.job.findMany({
        where: {
          position: pos,
        },
        skip: skip,
        take: 10,
      });
    } else if (lang) {
      return await this.prisma.job.findMany({
        where: {
          tech: lang,
        },
        skip: skip,
        take: 10,
      });
    }

    return await this.prisma.job.findMany({
      skip: skip,
      take: 10,
    });
  }

  async getJobById(id: number) {
    try {
      return await this.prisma.job.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getMyJobs(userId: number) {
    try {
      return await this.prisma.job.findMany({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async createJob(userId: number, dto: JobDto) {
    try {
      const job = await this.prisma.job.create({
        data: {
          userId: userId,
          ...dto,
        },
      });

      return job;
    } catch (error) {
      throw error;
    }
  }

  async deleteJob(userId: number, jobId: number) {
    const job = await this.prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job || job.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.job.delete({
      where: {
        id: jobId,
      },
    });

    return 'Job has been deleted';
  }

  async updateJob(userId: number, jobId: number, dto: JobEditDto) {
    const job = await this.prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!job || job.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    const newjob = await this.prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        ...dto,
      },
    });

    return newjob;
  }
}
