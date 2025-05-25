import {
  AbstractDao,
  Dao,
  TObjectId,
  DocumentIdentity,
  IFetchQueryOptions,
  FilterQuery,
  assureObjectId,
  IBaseFetchQueryOptions,
} from '@/core';
import { File } from '../schemas';
import { FileTypeRegistry } from '../registries';
import { Inject } from '@nestjs/common';
import { TenancyIsolation } from '@/core/tenancy';

// TODO: Move profileShardDao to core/shardDao

interface FileShard {
  oid: TObjectId;
  pid: TObjectId;
}

/**
 * Represents a DAO (Data Access Object) for managing files.
 *
 * @extends AbstractDao<File>
 */
@Dao(File, { isolation: TenancyIsolation.Strict })
export class FileDao extends AbstractDao<File> {
  @Inject()
  protected override typeRegistry: FileTypeRegistry;

  async findAllByShardAndIds(
    shard: FileShard,
    ids: DocumentIdentity<File>[],
    options?: IFetchQueryOptions<File>
  ) {
    return this.findAllByShard(
      shard,
      { _id: { $in: ids.map((id) => this.assureDocumentId(id)) } },
      options
    );
  }

  async findAllByShard(
    shard: FileShard,
    filter?: FilterQuery<File>,
    options?: IFetchQueryOptions<File>
  ): Promise<File[]> {
    return this.findAll(applyShardQueryFilter(shard, filter), options);
  }

  async findOneByShard(
    shard: FileShard,
    filter: FilterQuery<File>,
    options?: IBaseFetchQueryOptions<File>
  ): Promise<File | null> {
    return this.findOne(applyShardQueryFilter(shard, filter), options);
  }

  async findOneByShardAndId(
    shard: FileShard,
    fileIdentity: DocumentIdentity<File>,
    options?: IBaseFetchQueryOptions<File>
  ): Promise<File | null> {
    return this.findOne(
      applyShardQueryFilter(shard, { _id: assureObjectId(fileIdentity) }),
      options
    );
  }
}

function applyShardQueryFilter(shard: FileShard, filter?: FilterQuery<any>) {
  filter = filter || {};
  if (shard.oid) {
    filter.oid = assureObjectId(shard.oid);
  } else {
    console.warn(new Error('Use of profile filter without given oid').stack);
  }
  filter.pid = assureObjectId(shard.pid);
  return filter;
}
