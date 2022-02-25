export abstract class AbstractModelEvent<S , M> {
  constructor(public sender: S,  public model: M, public modelName: string) {}
}

export class ModelCreateEvent<S, M> extends AbstractModelEvent<S, M>{}