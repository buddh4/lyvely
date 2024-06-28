export abstract class AbstractModelEvent<S, M> {
  constructor(
    public sender: S,
    public model: M,
    public modelName: string
  ) {}
}

export class ModelSaveEvent<S, M> extends AbstractModelEvent<S, M> {}
