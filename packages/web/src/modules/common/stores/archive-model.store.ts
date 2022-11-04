import { AxiosResponse } from 'axios';
import { IArchivable } from '@lyvely/common';

interface IArchiveModelRepository<TID = string> {
  archive: (id: TID) => Promise<AxiosResponse<boolean>>;
  unArchive: (id: TID) => Promise<AxiosResponse<boolean>>;
}

export interface IArchiveModelStoreOptions<TModel extends IArchivable, TID = string> {
  repository: IArchiveModelRepository<TID> | ((editModel: TModel) => IArchiveModelRepository<TID>);
  onSubmitSuccess?: (model: TModel, val: boolean) => void;
  onSubmitError?: ((err: any) => void) | false;
}
export function useArchiveModelStore<TModel extends IArchivable, TID = string>(
  options: IArchiveModelStoreOptions<TModel, TID>,
) {
  async function archiveModel(modelId: TID, model: TModel) {
    return _handleUpdate(modelId, model, true);
  }

  async function unArchiveModel(modelId: TID, model: TModel) {
    return _handleUpdate(modelId, model, false);
  }

  async function _handleUpdate(modelId: TID, model: TModel, archive: boolean) {
    const { data } = archive
      ? await _getRepository(model).archive(modelId)
      : await _getRepository(model).unArchive(modelId);

    if (data === true) {
      model.archived = archive;
      if (typeof options.onSubmitSuccess === 'function') {
        options.onSubmitSuccess(model, data);
      }
    }

    return data;
  }

  function _getRepository(m: TModel) {
    if (typeof options.repository === 'function') {
      return options.repository(m);
    }

    return options.repository;
  }

  return {
    archiveModel,
    unArchiveModel,
  };
}
