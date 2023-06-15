"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDao = exports.defaultFetchOptions = void 0;
const db_utils_1 = require("./db.utils");
const common_1 = require("@nestjs/common");
const dao_events_1 = require("./dao.events");
const event_emitter_1 = require("@nestjs/event-emitter");
const lodash_1 = require("lodash");
exports.defaultFetchOptions = {
    pagination: {
        page: 1,
        limit: 100,
    },
};
class AbstractDao {
    constructor() {
        this.logger = new common_1.Logger(this.constructor.name);
    }
    createEventName(event) {
        const type = this.getModelType() ? `${this.getModelType()}.` : '';
        return `model.${type}${this.getModelName().toLowerCase()}.${event}`;
    }
    getModelType() {
        return null;
    }
    getModelName() {
        return this.getModel().modelName;
    }
    constructModel(lean) {
        return lean ? (0, db_utils_1.createBaseEntityInstance)(this.getModelConstructor(lean), lean) : null;
    }
    constructModels(leanArr) {
        return leanArr?.map((lean) => this.constructModel(lean)) || [];
    }
    emit(event, data) {
        return this.eventEmitter.emit(this.createEventName(event), data);
    }
    async save(entityData, options) {
        await this.beforeSave(entityData);
        this.emit('save.pre', new dao_events_1.ModelSaveEvent(this, entityData, this.getModelName()));
        const entityModel = this.getModel(options);
        const result = await new entityModel(entityData).save(options);
        const model = this.constructModel(result.toObject({ virtuals: true, aliases: true, getters: true }));
        entityData._id = model._id;
        entityData.id = model.id;
        this.emit(`save.post`, new dao_events_1.ModelSaveEvent(this, model, this.getModelName()));
        return await this.afterSave(model);
    }
    async saveMany(entityDataArr, options) {
        for (const entityData of entityDataArr) {
            await this.beforeSave(entityData);
            this.emit('save.pre', new dao_events_1.ModelSaveEvent(this, entityData, this.getModelName()));
        }
        const rawModels = await this.getModel(options).insertMany(entityDataArr, {
            lean: true,
            ...options,
        });
        const result = [];
        for (const rawModel of rawModels) {
            const model = this.constructModel(rawModel);
            this.emit(`save.post`, new dao_events_1.ModelSaveEvent(this, model, this.getModelName()));
            result.push(await this.afterSave(model));
        }
        return result;
    }
    async beforeSave(toCreate) {
        return Promise.resolve(toCreate);
    }
    async afterSave(created) {
        return Promise.resolve(created);
    }
    async findById(identity, options) {
        return this.constructModel(await this.getModel(options)
            .findById(this.assureEntityId(identity), options?.projection, options)
            .lean());
    }
    async findByIdAndFilter(identity, filter, options) {
        filter ||= {};
        filter._id = this.assureEntityId(identity);
        return this.findOne(filter, options);
    }
    async findAllByIds(ids, options) {
        return this.findAll({ _id: { $in: ids.map((id) => this.assureEntityId(id)) } }, options);
    }
    async findAll(filter, options) {
        options ??= {};
        const query = this.getModel(options).find(filter, options?.projection, options);
        const fetchFilter = this.getFetchQueryFilter(options);
        if (fetchFilter) {
            query.where(fetchFilter);
        }
        return this.constructModels(await this.applyFetchQueryOptions(query, options).lean());
    }
    assureEntityId(identity) {
        return (0, db_utils_1.assureObjectId)(identity, false);
    }
    async findOne(filter, options) {
        return this.constructModel(await this.getModel(options).findOne(filter, options?.projection, options).lean());
    }
    async upsert(filter, update, options = {}) {
        options.new = options.new ?? true;
        return this.constructModel(await this.getModel(options)
            .findOneAndUpdate(filter, update, { upsert: true, ...options })
            .lean());
    }
    getFetchQueryFilter(options) {
        const { excludeIds } = options;
        if (!excludeIds) {
            return null;
        }
        return {
            _id: Array.isArray(excludeIds)
                ? { $nin: excludeIds.map((identity) => this.assureEntityId(identity)) }
                : { $ne: this.assureEntityId(excludeIds) },
        };
    }
    applyFetchQueryOptions(query, options) {
        const { sort, pagination } = options;
        if (sort) {
            query.sort(sort);
        }
        if (pagination) {
            query.limit(pagination.limit);
            query.skip((pagination.page - 1) * pagination.limit);
        }
        return query;
    }
    async findOneAndSetById(id, updateSet, options) {
        return this.findOneAndUpdateById(id, { $set: updateSet }, options);
    }
    async findOneAndUpdateById(id, update, options) {
        return this.findOneAndUpdateByFilter(id, update, {}, options);
    }
    async findOneAndUpdateSetByFilter(id, update, filter, options) {
        return this.findOneAndUpdateByFilter(id, { $set: update }, filter, options);
    }
    async findOneAndUpdateByFilter(id, update, filter, options) {
        if (!(await this.beforeUpdate(id, update)))
            return null;
        options = options || {};
        if (typeof options.new === 'undefined') {
            options.new = true;
        }
        filter = filter || {};
        filter._id = this.assureEntityId(id);
        const data = await this.getModel(options)
            .findOneAndUpdate(filter, (0, lodash_1.cloneDeep)(update), options)
            .lean();
        if (!data) {
            return null;
        }
        if (!options || options.apply !== false) {
            (0, db_utils_1.applyUpdateTo)(id, update);
        }
        return this.constructModel(data);
    }
    async updateOneSetById(id, updateSet, options) {
        return this.updateOneById(id, { $set: updateSet }, options);
    }
    async updateOneUnsetById(id, updateUnset, options) {
        return this.updateOneById(id, { $unset: updateUnset }, options);
    }
    async updateOneById(id, update, options) {
        return this.updateOneByFilter(id, update, {}, options);
    }
    async updateOneByFilter(identity, update, filter, options) {
        const clonedUpdate = (0, lodash_1.cloneDeep)(update);
        if (!(await this.beforeUpdate(identity, clonedUpdate)))
            return false;
        filter = filter || {};
        filter._id = this.assureEntityId(identity);
        const query = this.getModel(options).updateOne(filter, clonedUpdate, options);
        const modifiedCount = (await query.exec()).modifiedCount;
        if (modifiedCount && (!options || options.apply !== false)) {
            (0, db_utils_1.applyUpdateTo)(identity, update);
        }
        return !!modifiedCount;
    }
    getModel(options) {
        let model = this.model;
        if (options?.discriminator) {
            const discirminator = model.discriminators?.[options.discriminator] ||
                model.discriminators?.[this.model.modelName + '.' + options.discriminator];
            model = discirminator || model;
        }
        if (!model && options?.discriminator) {
            this.logger.warn('Invalid discriminator value: ' + options.discriminator);
        }
        return model || this.model;
    }
    async beforeUpdate(id, update) {
        return Promise.resolve(true);
    }
    async updateSetBulk(updates, options) {
        await this.getModel(options).bulkWrite(updates.map((update) => ({
            updateOne: {
                filter: { _id: this.assureEntityId(update.id) },
                update: { $set: update.update },
            },
        })), options);
    }
    async reload(id) {
        return this.findById(id);
    }
    async deleteManyByIds(ids, options) {
        return this.deleteMany({ _id: { $in: ids.map((id) => this.assureEntityId(id)) } }, options);
    }
    async deleteMany(filter, options) {
        return (await this.getModel(options).deleteMany(filter, options)).deletedCount;
    }
    async deleteOne(filter, options) {
        return (await this.getModel(options).deleteOne(filter, options)).deletedCount === 1;
    }
}
exports.AbstractDao = AbstractDao;
__decorate([
    (0, common_1.Inject)(),
    __metadata("design:type", event_emitter_1.EventEmitter2)
], AbstractDao.prototype, "eventEmitter", void 0);
