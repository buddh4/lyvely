# Models

Model classes primarily find their use within the interface layer of a module, serving the purpose of defining Data 
Transfer Objects (DTOs) or domain models. To facilitate the creation and management of these model classes, 
the `@lyvely/common` package offers a set of utilities, which will be detailed in the upcoming sections.

## BaseModel & DocumentModel

The `BaseModel` class within the `@lyvely/common` package can be extended to create new model classes. 
It offers functionalities for initializing and transforming model instances. `BaseModel` classes often mirror
the structure of a backend document schema and can also serve as interfaces for such schema models, ensuring strict type safety.
In such instances, it is advisable to append the `Model` suffix to the class name to avoid naming conflicts.

A `DocumentModel` is a specialized type of model designed for mirroring database schema models. Similar to the
`BaseModel`, the `DocumentModel` supports the same features, but furthermore includes an `id` field that is automatically
set if the constructor argument contains an `_id` field, which is common in most schema models.

Some transformation rules mentioned in the following sections facilitate using a document schema object as a constructor 
argument of a model class, provided that the structures of both models are equivalent, except for the id type.

For example, let's consider a simplified version of the `UserModel` as an illustration:

```typescript
import {Exclude} from "class-transformer";
import {BaseModel, DocumentModel, PropertyType} from "@lyvely/common";

@Exclude()
export class UserContactModel<TID = string> extends BaseModel<UserContact<any>> {
    @Expose()
    name: string;

    @TransformObjectId()
    @Expose()
    uid: TID;
}

@Exclude()
export class UserModel<TID = string> extends DocumentModel<UserModel<any>> {
    @Expose()
    username: string;

    @Expose()
    status: UserStatus;

    @Expose()
    @PropertyType([UserContactModel])
    contacts: UserContactModel<TID>[];
}

@Exclude()
export class UsersResponse<TID = string> extends BaseModel<UserRepsonse<any>> {
    @PropertyType([UserModel])
    users: UserModel<TID>[];
}
```
- To control which fields are included when serializing or deserializing a model, you can use the `@Expose` and `@Exclude`
  decorators. In most scenarios, especially when dealing with models that may contain sensitive data, it is advisable to
  use `@Exclude` at the class level to exclude all fields by default and then explicitly `@Expose` the fields that are safe to
  transmit to the client or server.
- The `@PropertyType` decorator is used to specify the data type of a property for the purpose of auto-transformation,
  and it will be explored in greater depth in an upcoming section.
- The `@TransformObjectId` decorator will automatically transform `ObjectId` values to `string`.
  This is useful if our schema implements our model (beside the type of ids) we can simply use schema model instances as
  constructor argument when creating models.
- For transforming arrays of `ObjectIds` to string arrays use the `@TransformObjectIds` decorator.

In this example our backend schema implements the model properties as follows:

```typescript
export class User extends BaseDocument<User> implements PropertiesOf<UserModel<TObjectId>> {
    /** Implementation of User schema **/
}
```

Given the shared structure between the model and the document schema, along with our established transformations, 
we can now simply return our model as follows:

```typescript
@Controller('users')
export class UsersController {
    @Get()
    async getUsers(): Promise<UsersResponse> {
        const users = await this.userService.getUsers();
        return new UsersResponse({ users });
    }
}
```

### Constructor

The generic type of the `BaseModel` class specifies the type of the constructor argument. 
To create an instance of our `UserModel`, you can use the following approach:

```typescript
const user = new UserModel({
    username: 'someUser',
    contacts: [
        { name: user1.name, uid: user1._id },
        { name: user2.name, uid: user2._id },
    ]
});
```

The `UserModel` constructor automatically converts the plain contacts array into an array of `UserContactModel` instances,
based on the `@PropertyType` decorator while respecting our transformation rules.

### getDefaults

The `BaseModel` allows you to define a `getDefaults` function, which can be used to specify default values for a model. 
These defaults are automatically merged into the values provided to the model constructor, as demonstrated in the following example:

```typescript
@Exclude()
export class UserModel extends BaseModel<ProfileRelations> {
    @Expose()
    username: string;

    @Expose()
    status: UserStatus;

    @Expose()
    @Type(() => UserContactModel)
    @PropertyType([UserContactModel])
    contacts: UserContactModel[];

    getDefaults() {
        return {
            status: UserStatus.Active
        }
    }
}
```

If we now instantiate a new `UserModel` without specifying a `status` value in the constructor, the default status will be 
applied. Alternatively, for simple cases like this, we can simplify the process using a 
`@PropertyType(Number, { default: UserStatus.Active })` decorator to achieve the same result. Additionally, the 
`@PropertyType` decorator ensures that the value is correctly transformed to the specified type.

### afterInit

Similar to the `getDefaults` function, the `afterInit` function can be used to customize the instantiation of a model. 
This function is invoked at the very end of our constructor call.

```typescript
@Exclude()
export class UserModel extends BaseModel<ProfileRelations> {
    @Expose()
    username: string;

    @Expose()
    status: UserStatus;

    @Expose()
    @Type(() => UserContactModel)
    @PropertyType([UserContactModel])
    contacts: UserContactModel[];

    afterInit() {
        this.status ??= UserStatus.Active;
    }
}
```

### PropertyType

The `@PropertyType` decorator serves the purpose of specifying the type of a property, which will be automatically 
transformed within the model constructor or when utilizing the utility function `assignRawDataToAndInitProps` as well as
using `class-transformer` `instanceToPlain` or `plainToInstance`. This decorator supports the definition of nested 
types, as well as primitive or array types. You can also set `default` values or mark the property as `optional` using this decorator.

:::note

Some features as default value creation are not available when using `class-transformer` utilities.

:::

```typescript
import {PropertyType} from "@lyvely/common";

export class TestModel extends BaseModel<TestModel> {
    // Will default to 3
    @PropertyType(Number, { default: 3 })
    numberValue1: number;

    // Will default to 0
    @PropertyType(Number)
    numberValue2: number;

    // Will default to ['test']
    @PropertyType([String], { default: ['test'] })
    arrayValue1: string[];

    // Will default to ''
    @PropertyType([String])
    arrayValue2: string[];
    
    // Will default to default representaiton of SubModel
    @PropertyType(SubModel)
    nestedValue1?: SubModel;

    // Will default to undefined
    @PropertyType(SubModel, { optional: true })
    nestedValue2?: SubModel;

    // Works for dates also
    @PropertyType(Date, { default: new Date() })
    dateValue: Date;
}
```

:::info

Unless a property is explicitly marked as `optional`, it will either automatically create an instance of the 
specified type or use a type specific default value:

- `string`: `''`
- `number`: `0`
- `symbol`: `null`
- `boolean`: `false`
- `Array`: `[]`

:::

## Transformation & Validation

By default, the Lyvely controller layer validates incoming models using a global 
[ValidationPipe](https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe). Models can be 
annotated with [class-validator](https://github.com/typestack/class-validator) validation rules, which are 
utilized both in the frontend and backend.

:::warning

Automatic validation does not apply to generic types. If you intend to utilize generic types in a controller body 
argument, you will need to perform manual validation of the request body.

:::

In your controller, you can manually define a `ClassSerializerInterceptor` interceptor to enable automatic serialization 
and deserialization. To simplify this process, Lyvely offers the `@UseClassSerializer` utility decorator,
which can (and in most cases should) be applied to controller classes or controller functions.

:::info

For more information, please refer to the following resources:

- [class-validator](https://github.com/typestack/class-validator) for details on available validator rules.
- [class-transformer](https://github.com/typestack/class-transformer) for information about the serialization of models used in controllers.
- [NestJs - validation](https://docs.nestjs.com/techniques/validation) for a guide on how validation is managed in NestJs.
- [NestJs - serialization](https://docs.nestjs.com/techniques/serialization) for a guide of how serialization is handled in NestJs.

:::
