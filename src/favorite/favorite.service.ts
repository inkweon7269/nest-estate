import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AptUserBridgeEntity } from '../entities/apt-user-bridge.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { AptPageInput, RangePageInput } from '../common/dtos/input-value.dto';
import { getSkip } from '../common/common.function';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(AptUserBridgeEntity)
    private readonly aptUserBridgeRepo: Repository<AptUserBridgeEntity>,
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

  async getAllFavorites({ page, limit, apt }: AptPageInput, user: UserEntity) {
    const { skip, take } = getSkip(page, limit);
    const [list, count] = await this.aptUserBridgeRepo.findAndCount({
      select: {
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
        userId: user.id,
      },
      skip,
      take,
      order: {
        createAt: 'desc',
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
