import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AptEntity } from '../entities/apt.entity';
import { Repository } from 'typeorm';
import { AptDealEntity } from '../entities/apt-deal.entity';
import { AptPageInput, RangePageInput } from '../common/dtos/input-value.dto';
import { getSkip } from '../common/common.function';

@Injectable()
export class AptService {
  constructor(
    @InjectRepository(AptEntity)
    private readonly aptRepo: Repository<AptEntity>,
    @InjectRepository(AptDealEntity)
    private readonly aptDealRepo: Repository<AptDealEntity>,
  ) {}

  async getAptSimple() {
    const result = await this.aptRepo.find();
    return result;
  }

  async getAllAptDeals({ page, limit, apt }: AptPageInput) {
    const { skip, take } = getSkip(page, limit);
    const [list, count] = await this.aptDealRepo.findAndCount({
      select: {
        id: true,
        dealDate: true,
        money: true,
        floor: true,
        dong: true,
        type: true,
        area: true,
        status: true,
        apt: {
          id: true,
          buildAt: true,
          address: true,
          name: true,
          people: true,
          group: true,
        },
      },
      relations: {
        apt: true,
      },
      where: {
        apt: {
          ...(apt && { id: apt }),
        },
      },
      skip,
      take,
      order: {
        dealDate: 'desc',
      },
    });

    return {
      list,
      count,
    };
  }
}
