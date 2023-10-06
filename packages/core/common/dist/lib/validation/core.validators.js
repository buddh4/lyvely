var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { registerDecorator, ValidatorConstraint, } from 'class-validator';
export function Match(property, validationOptions) {
    return (object, propertyName) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        });
    };
}
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
MatchConstraint = __decorate([
    ValidatorConstraint({ name: 'match' })
], MatchConstraint);
export { MatchConstraint };
export function NotMatch(property, validationOptions) {
    return (object, propertyName) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: NotMatchConstraint,
        });
    };
}
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
NotMatchConstraint = __decorate([
    ValidatorConstraint({ name: 'notMatch' })
], NotMatchConstraint);
export { NotMatchConstraint };
export function Lte(property, validationOptions) {
    return (object, propertyName) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: LteConstraint,
        });
    };
}
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
LteConstraint = __decorate([
    ValidatorConstraint({ name: 'lte' })
], LteConstraint);
export { LteConstraint };
export function Gte(property, validationOptions) {
    return (object, propertyName) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: GteConstraint,
        });
    };
}
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
GteConstraint = __decorate([
    ValidatorConstraint({ name: 'gte' })
], GteConstraint);
export { GteConstraint };
export const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;
export function isValidObjectId(identity) {
    return !!identity && OBJECT_ID_REGEX.test(identity);
}
export function ObjectId(validationOptions) {
    return (object, propertyName) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: ObjectIdConstraint,
        });
    };
}
let ObjectIdConstraint = class ObjectIdConstraint {
    validate(value) {
        return isValidObjectId(value);
    }
    defaultMessage(args) {
        return `${args.property} must be a valid object id`;
    }
};
ObjectIdConstraint = __decorate([
    ValidatorConstraint({ name: 'ObjectId' })
], ObjectIdConstraint);
export { ObjectIdConstraint };
//# sourceMappingURL=core.validators.js.map