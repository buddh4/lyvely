"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectIdConstraint = exports.ObjectId = exports.isValidObjectId = exports.OBJECT_ID_REGEX = exports.GteConstraint = exports.Gte = exports.LteConstraint = exports.Lte = exports.NotMatchConstraint = exports.NotMatch = exports.MatchConstraint = exports.Match = void 0;
const class_validator_1 = require("class-validator");
function Match(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        });
    };
}
exports.Match = Match;
let MatchConstraint = class MatchConstraint {
    validate(value, args) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = args.object[relatedPropertyName];
        return value === relatedValue;
    }
    defaultMessage(args) {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} and ${relatedPropertyName} do not match`;
    }
};
exports.MatchConstraint = MatchConstraint;
exports.MatchConstraint = MatchConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'match' })
], MatchConstraint);
function NotMatch(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: NotMatchConstraint,
        });
    };
}
exports.NotMatch = NotMatch;
let NotMatchConstraint = class NotMatchConstraint {
    validate(value, args) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = args.object[relatedPropertyName];
        return value !== relatedValue;
    }
    defaultMessage(args) {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} can not match with ${relatedPropertyName}`;
    }
};
exports.NotMatchConstraint = NotMatchConstraint;
exports.NotMatchConstraint = NotMatchConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'notMatch' })
], NotMatchConstraint);
function Lte(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: LteConstraint,
        });
    };
}
exports.Lte = Lte;
let LteConstraint = class LteConstraint {
    validate(value, args) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = args.object[relatedPropertyName];
        if (relatedValue === null || relatedValue === undefined) {
            return true;
        }
        else if (typeof relatedValue !== 'number') {
            return false;
        }
        return value <= relatedValue;
    }
    defaultMessage(args) {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} must be lower or equal ${relatedPropertyName}`;
    }
};
exports.LteConstraint = LteConstraint;
exports.LteConstraint = LteConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'lte' })
], LteConstraint);
function Gte(property, validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: GteConstraint,
        });
    };
}
exports.Gte = Gte;
let GteConstraint = class GteConstraint {
    validate(value, args) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = args.object[relatedPropertyName];
        if (relatedValue === null || relatedValue === undefined) {
            return true;
        }
        else if (typeof relatedValue !== 'number') {
            return false;
        }
        return value >= relatedValue;
    }
    defaultMessage(args) {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} must be lower or equal ${relatedPropertyName}`;
    }
};
exports.GteConstraint = GteConstraint;
exports.GteConstraint = GteConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'gte' })
], GteConstraint);
exports.OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;
function isValidObjectId(identity) {
    return !!identity && exports.OBJECT_ID_REGEX.test(identity);
}
exports.isValidObjectId = isValidObjectId;
function ObjectId(validationOptions) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: ObjectIdConstraint,
        });
    };
}
exports.ObjectId = ObjectId;
let ObjectIdConstraint = class ObjectIdConstraint {
    validate(value) {
        return isValidObjectId(value);
    }
    defaultMessage(args) {
        return `${args.property} must be a valid object id`;
    }
};
exports.ObjectIdConstraint = ObjectIdConstraint;
exports.ObjectIdConstraint = ObjectIdConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'ObjectId' })
], ObjectIdConstraint);
