export abstract class BaseModel<T> {
    constructor(obj?: Partial<T>) {
        if(!obj) return;

        Object.assign(this, obj);

        if('afterInit' in this) {
            (<this & { afterInit: (() => void)}> this).afterInit();
        }
    }
}