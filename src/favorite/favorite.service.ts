import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AptUserBridgeEntity } from '../entities/apt-user-bridge.entity';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { AptPageInput } from '../common/dtos/input-value.dto';
import { getSkip } from '../common/common.function';
import { AptDealEntity } from '../entities/apt-deal.entity';
import { AptEntity } from '../entities/apt.entity';
import { DealStatus } from '../crawling/crawling-status.enum';
import { last } from 'rxjs';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(AptUserBridgeEntity)
    private readonly aptUserBridgeRepo: Repository<AptUserBridgeEntity>,
    @InjectRepository(AptEntity)
    private readonly aptRepo: Repository<AptEntity>,
    @InjectRepository(AptDealEntity)
    private readonly aptDealRepo: Repository<AptDealEntity>,
  ) {}

  async getFavoriteSimple(user: UserEntity) {
    const result = await this.aptUserBridgeRepo.find({
      relations: {
        apt: true,
      },
      where: {
        userId: user.id,
      },
    });

    return result;
  }

  async getAllFavorites({ page, limit, ids, status }: AptPageInput, user: UserEntity) {
    const { skip, take } = getSkip(page, limit);
    const [list, count] = await this.aptDealRepo.findAndCount({
      relations: {
        apt: {
          aptUserBridges: true,
        },
      },
      where: {
        ...(status && { status: status }),
        apt: {
          ...(ids.length && { id: In(ids) }),
          aptUserBridges: {
            userId: user.id,
          },
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

  async getFavoriteById(aptId: number, user: UserEntity) {
    const found = await this.aptUserBridgeRepo.findOne({
      where: {
        aptId,
        userId: user.id,
      },
    });

    return found;
  }

  async createFavorite(aptId: number, user: UserEntity) {
    const found = await this.getFavoriteById(aptId, user);

    if (found) {
      throw new ConflictException(`이미 등록된 즐겨찾기입니다.`);
    }

    const favorite = this.aptUserBridgeRepo.create({
      aptId,
      userId: user.id,
    });

    await this.aptUserBridgeRepo.save(favorite);

    return favorite;
  }

  async deleteFavorite(aptId: number, user: UserEntity) {
    const found = await this.getFavoriteById(aptId, user);

    if (!found) {
      throw new NotFoundException(`해당 즐겨찾기를 찾을 수 없습니다.`);
    }

    await this.aptUserBridgeRepo.delete({ aptId: found.aptId });
  }
}
