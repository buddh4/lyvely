import { IArchivable, IArchiveModelClient } from '@lyvely/interface';

export interface IArchiveModelStoreOptions<TModel extends IArchivable, TID = string> {
  client: IArchiveModelClient<TID> | ((editModel: TModel) => IArchiveModelClient<TID>);
  onSubmitSuccess?: (model: TModel, val: boolean) => void;
  onSubmitError?: ((err: any) => void) | false;
}
export function useArchiveModel<TModel extends IArchivable, TID = string>(
  options: IArchiveModelStoreOptions<TModel, TID>,
) {
  async function archiveModel(modelId: TID, model: TModel) {
    return _handleUpdate(modelId, model, true);
  }

  async function restoreModel(modelId: TID, model: TModel) {
    return _handleUpdate(modelId, model, false);
  }

  async function _handleUpdate(modelId: TID, model: TModel, archive: boolean) {
    const result = archive
      ? await _getClient(model).archive(modelId)
      : await _getClient(model).restore(modelId);

    if (result === true) {
      model.archived = archive;
      if (typeof options.onSubmitSuccess === 'function') {
        options.onSubmitSuccess(model, result);
      }
    }

    return result;
  }

  function _getClient(m: TModel) {
    if (typeof options.client === 'function') {
      return options.client(m);
    }

    return options.client;
  }

  return {
    archiveModel,
    restoreModel,
  };
}
