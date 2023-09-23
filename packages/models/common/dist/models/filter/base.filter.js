"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = void 0;
const mitt_1 = require("mitt");
class Filter {
    constructor(options) {
        this.additions = [];
        this.emitter = (0, mitt_1.default)();
        if (options) {
            options = { ...options };
            this.additions = options.additions || this.additions;
            delete options.additions;
            this.setOptions(options);
        }
        else {
            this.reset();
        }
        this.additions = this.additions || [];
    }
    option(key) {
        return this.options[key];
    }
    setOption(key, value) {
        if (this.options[key] !== value) {
            this.setOptions({ [key]: value });
        }
    }
    getOptions() {
        return { ...this.options };
    }
    getOptionsWithStringValues() {
        const result = {};
        for (const option in this.options) {
            const value = this.options[option];
            if (value && typeof value === 'object' && 'toString' in value) {
                result[option] = value.toString();
            }
            else if (value) {
                result[option] = `${value}`;
            }
        }
        return result;
    }
    setOptions(update) {
        this.options = this.options || this.getDefaultOptions();
        const old = { ...this.options };
        let hasChanged = false;
        for (const key in update) {
            if (this.options[key] !== update[key]) {
                this.options[key] = update[key];
                hasChanged = true;
            }
        }
        if (hasChanged) {
            this.emitter.emit('update', {
                old: old,
                update: update,
            });
        }
    }
    filter(models) {
        return models.filter((model) => this.check(model));
    }
    check(model) {
        if (!this.runAdditions(model)) {
            return false;
        }
        return this.checkModel(model);
    }
    runAdditions(model) {
        let result = true;
        this.additions.forEach((addition) => {
            if (!addition(model, this)) {
                result = false;
            }
        });
        return result;
    }
    getDefaultOptions() {
        return {};
    }
    reset() {
        this.options = this.getDefaultOptions();
    }
    onUpdate(handler) {
        this.emitter.on('update', handler);
    }
    offUpdate(handler) {
        this.emitter.off('update', handler);
    }
}
exports.Filter = Filter;
