import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AptUserBridgeEntity } from '../entities/apt-user-bridge.entity';
import { Between, In, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { AptPageInput } from '../common/dtos/input-value.dto';
import { getSkip } from '../common/common.function';
import { AptDealEntity } from '../entities/apt-deal.entity';
import { AptEntity } from '../entities/apt.entity';
import { DealStatus } from '../crawling/crawling-status.enum';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(AptUserBridgeEntity)
    private readonly aptUserBridgeRepo: Repository<AptUserBridgeEntity>,
    @InjectRepository(AptEntity)
    private readonly aptRepo: Repository<AptEntity>,
    @InjectRepository(AptDealEntity)
    private readonly aptDealRepo: Repository<AptDealEntity>,
  ) {
  }

  async getFavoriteSimple(user: UserEntity) {
    const result = await this.aptUserBridgeRepo.find({
      relations: {
        apt: true,
      },
      where: {
        userId: user.id,
      },
    });

    return result.map((item) => {
      return {
        label: item.apt.name,
        value: item.aptId,
      };
    });
  }

  async getAllFavorites(
    { page, limit, ids, status, startDate, endDate }: AptPageInput,
    user: UserEntity,
  ) {
    const { skip, take } = getSkip(page, limit);

    const idsArr = ids ? ids.split(',') : null;
    const [list, count] = await this.aptDealRepo.findAndCount({
      relations: {
        apt: {
          aptUserBridges: true,
        },
      },
      where: {
        ...(status && { status: status }),
        ...(startDate &&
          endDate && {
            dealDate: Between(new Date(startDate), new Date(endDate)),
          }),
        apt: {
          ...(idsArr && { id: In(idsArr) }),
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

  async getAllChartFavorites(
    { page, limit, ids, status, startDate, endDate }: AptPageInput,
    user: UserEntity,
  ) {
    const idsArr = ids ? ids.split(',') : null;

    const found = await this.aptRepo.find({
      select: {
        id: true,
        buildAt: true,
        address: true,
        name: true,
        people: true,
        group: true,
        deals: {
          dealDate: true,
          money: true,
          floor: true,
          dong: true,
          type: true,
          area: true,
          status: true,
        },
        aptUserBridges: {
          createAt: false,
          userId: false,
          aptId: false,
        },
      },
      relations: {
        deals: true,
        aptUserBridges: true,
      },
      where: {
        deals: {
          ...(startDate &&
            endDate && {
              dealDate: Between(new Date(startDate), new Date(endDate)),
            }),
        },
        aptUserBridges: {
          userId: user.id,
          ...(idsArr && { aptId: In(idsArr) }),
        },
      },
      order: {
        deals: {
          dealDate: 'DESC',
        },
      },
    });

    return found.map((item) => {
      const { id, buildAt, address, name, people, group, deals } = item;
      return {
        id,
        buildAt,
        address,
        name,
        people,
        group,
        areas: _.uniqBy(
          deals
            .map((item) => ({ label: item.area, value: item.area }))
            .sort((a, b) => a.value - b.value),
          (e) => {
            return e.value;
          },
        ),
        deals: deals.map((jtem) => {
          if (jtem) {
            return {
              ...jtem,
              dealDate: dayjs(jtem.dealDate).format('YYYY-MM-DD'),
            };
          }

          return [];
        }),

        /*
        deals: deals
          .sort((a, b) =>
            dayjs(a.dealDate).isAfter(dayjs(b.dealDate)) ? -1 : 1,
          )
          .map((jtem) => {
            if (jtem) {
              return {
                ...jtem,
                dealDate: dayjs(jtem.dealDate).format('YYYY-MM-DD'),
              };
            }

            return [];
          }),
        rentDeals: deals
          .filter((jtem) => jtem.status === DealStatus.RENT)
          .sort((a, b) =>
            dayjs(a.dealDate).isAfter(dayjs(b.dealDate)) ? 1 : -1,
          )
          .map((jtem) => {
            if (jtem) {
              return {
                ...jtem,
                dealDate: dayjs(jtem.dealDate).format('YYYY-MM-DD'),
              };
            }

            return [];
          }),
        buyDeals: deals
          .filter((jtem) => jtem.status === DealStatus.BUY)
          .sort((a, b) =>
            dayjs(a.dealDate).isAfter(dayjs(b.dealDate)) ? 1 : -1,
          )
          .map((jtem) => {
            if (jtem) {
              return {
                ...jtem,
                dealDate: dayjs(jtem.dealDate).format('YYYY-MM-DD'),
              };
            }

            return [];
          }),*/
      };
    });
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
