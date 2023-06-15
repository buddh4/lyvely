export declare abstract class AbstractModelEvent<S, M> {
    sender: S;
    model: M;
    modelName: string;
    constructor(sender: S, model: M, modelName: string);
}
export declare class ModelSaveEvent<S, M> extends AbstractModelEvent<S, M> {
}
