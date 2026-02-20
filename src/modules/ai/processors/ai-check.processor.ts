import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Work } from '../entities/work.entity';
import axios from 'axios';
import { WorkStatus } from '../../../common/enums/work-status.enum';

@Processor('ai-safety')
export class AiSafetyProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Work)
    private readonly workRepository: Repository<Work>,
  ) {
    super();
  }

  async process(job: Job) {
    const { workId, imageUrl } = job.data;

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/v1/check-safety',
        { image_url: imageUrl },
      );

      if (response.data.is_safe) {
        await this.workRepository.update(workId, {
          is_safe: true,
          status: WorkStatus.APPROVED,
        });
      } else {
        await this.workRepository.update(workId, {
          is_safe: false,
          status: WorkStatus.REJECTED,
        });
      }
    } catch (err) {
      console.error('AI Worker error:', err);
      throw err; // 🔥 재시도 가능하게
    }
  }
}
