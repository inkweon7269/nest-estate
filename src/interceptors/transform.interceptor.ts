import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { calcListTotalCount } from '../common/common.function';

class ListType {
  data: any[];
  count: number;
}

class ListOutputValue {
  totalPage: number;
  totalResult: number;
  list: any[];
}

type Response<T> = {
  result: boolean;
  code: number;
  // data: T;
  data: T extends ListType ? ListOutputValue : T;
};

const NON_PAGINATION = 'NON_PAGENATION';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request: Request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((value) => {

        if (value instanceof Object && 'count' in value && 'list' in value) {
          const { list, count, ...restData } = value;

          // TODO, NEED : default value를 정할 것
          const limit = request.query['limit']
            ? request.query['limit']
            : NON_PAGINATION;
          const page = request.query['page'];
          const search = request.query['search'];

          return {
            result: true,
            code: 1000,
            data: {
              ...restData,
              list,
              ...(limit === NON_PAGINATION
                ? { totalResult: count, totalPage: 1 }
                : calcListTotalCount(count, Number(limit))),
              ...(search ? { search } : { search: null }),
              ...(page && { page }),
            } as ListOutputValue,
          };
        }

        return { result: true, code: 1000, data: value };
      }),
    );
  }
}
