import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { JobService } from './job.service';
import { JobDto, JobEditDto } from './dto';

@Controller('jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get()
  getAllJobs(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('pos') pos?: string,
    @Query('lang') lang?: string,
  ) {
    return this.jobService.getAllJobs(pos, lang, skip);
  }

  @UseGuards(JwtGuard)
  @Post()
  createJob(@GetUser('id') userId: number, @Body() dto: JobDto) {
    return this.jobService.createJob(userId, dto);
  }

  @UseGuards(JwtGuard)
  @Get('my')
  getMyJobs(@GetUser('id') userId: number) {
    return this.jobService.getMyJobs(userId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteJob(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) jobId: number,
  ) {
    return this.jobService.deleteJob(userId, jobId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateJob(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) jobId: number,
    @Body() dto: JobEditDto,
  ) {
    return this.jobService.updateJob(userId, jobId, dto);
  }

  @Get(':id')
  getJobById(@Param('id', ParseIntPipe) id: number) {
    return this.jobService.getJobById(id);
  }
}
