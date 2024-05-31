# Models

Model classes primarily find their use within the interface layer of a module, serving the purpose of defining Data 
Transfer Objects (DTOs) or domain models. To facilitate the creation and management of these model classes, 
the `@lyvely/common` package offers a set of utilities, which will be detailed in the upcoming sections.

## `BaseModel.init`

The `BaseModel.init` function within the `@lyvely/common` package offers functionalities for initializing and transforming 
model instances. Model classes often mirror the structure of a backend document schema and can also serve as interfaces 
for such schema models, ensuring strict type safety. In such instances, it is advisable to append the `Model` 
suffix to the class name to avoid naming conflicts.

Some transformation rules mentioned in the following sections facilitate using a document schema object as a constructor 
argument of a model class, provided that the structures of both models are equivalent, except for the id type.

For example, let's consider a hypothetical `UserModel` as an illustration:

```typescript
import { Exclude } from "class-transformer";
import { BaseModel, PropertyType } from "@lyvely/common";

@Exclude()
export class UserContactModel<TID = string> {
    @Expose()
    name: string;

    @Expose()
    @TransformObjectId()
    uid: TID;
    
    constructor(data: StrictBaseModelData<UserContactModel<any>>) {
      BaseModel.init(this, data);
    }
}

@Exclude()
export class UserModel<TID = string> {

    @Expose()
    id: string;
  
    @Expose()
    username: string;

    @Expose()
    status: UserStatus;

    @Expose()
    @PropertyType([UserContactModel])
    contacts: UserContactModel<TID>[];

    constructor(data: StrictBaseModelData<UserModel<any>>) {
      BaseModel.init(this, data);
    }
}

@Exclude()
export class UsersResponse<TID = string> {
    @PropertyType([UserModel])
    users: UserModel<TID>[];

    constructor(data: StrictBaseModelData<UsersResponse<any>>) {
      BaseModel.init(this, data);
    }
}
```

- To control which fields are included when serializing or deserializing a model, you can use the `@Expose` and `@Exclude`
  decorators. In most scenarios, especially when dealing with models that may contain sensitive data, it is advisable to
  use `@Exclude` at the class level to exclude all fields by default and then explicitly `@Expose` the fields that are safe to
  transmit to the client or server.
- The `@PropertyType` decorator is used to specify the data type of a property for the purpose of auto-transformation,
  and will be explored in greater depth in an upcoming section.
- The `@TransformObjectId` decorator will automatically transform `ObjectId` values to `string`.
  This is useful if our schema implements our model (beside the type of ids) we can simply use schema model instances as
  constructor argument when creating models.
- For transforming arrays of `ObjectIds` to string arrays use the `@TransformObjectIds` decorator.

In this example our backend schema can implement the model properties as follows:

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

When extending a class using `BaseModel.init` in its constructor, you should call the parent constructor with `false`,
which is included in the `StrictBaseModelData` and `BaseModelData` types, and manually call `BaseModel.init` in the subclass.
This is required if the subclass adds or overwrites properties since ES2020 class fields do not support setting fields
of a subclass within the super constructor:

```typescript
import {BaseModel, type StrictBaseModelData} from "@lyvely/common";

class SuperUserModel<TID = string> extends UserModel<TID> {
  @Expose()
  extraField: string;

  constructor(data: StrictBaseModelData<any>) {
    super(false);
    BaseModel.init(this, data);
  }
}
```

:::tip 
You can control the strictness of your constructor by switching from `StrictBaseModelData` to `BaseModelData`, which will
also allow partial constructor data. Generally, it is advisable to use `StrictBaseModelData` and if required manually
use the `Omit` or `Optional` utility types to refine the constructor data object.
:::

:::warning
A model constructor will not respect `@Expose`, `@Exclude` and `@Transform` rules, those transformations rules are usually applied when using
the `@UseClassSerializer` interceptor in our controller or manually transforming a model with the `instanceToPlain` function.
:::

### getDefaults

The `BaseModel` utility allows you to define a `getDefaults` function, which can be used to specify default values for a model. 
These defaults are automatically merged into the values provided to the model constructor, as demonstrated in the following example:

```typescript
@Exclude()
export class UserModel<TID = string> {
    @Expose()
    username: string;

    @Expose()
    status: UserStatus;

    @Expose()
    @Type(() => UserContactModel)
    @PropertyType([UserContactModel])
    contacts: UserContactModel<TID>[];

    constructor(data: StrictBaseModelData<UserModel<any>>) {
      BaseModel.init(this, data);
    }

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
export class UserModel<TID = string> {
    @Expose()
    username: string;

    @Expose()
    status: UserStatus;

    @Expose()
    @Type(() => UserContactModel)
    @PropertyType([UserContactModel])
    contacts: UserContactModel<TID>[];

    constructor(data: StrictBaseModelData<UserModel<any>>) {
      BaseModel.init(this, data);
    }

    afterInit() {
        this.status ??= UserStatus.Active;
    }
}
```

### PropertyType

The `@PropertyType` decorator serves the purpose of specifying the property type, which will be automatically 
transformed within the model constructor or when utilizing the utility function `assignRawDataToAndInitProps` as well as
using `instanceToPlain` or `plainToInstance`. This decorator supports the definition of nested 
types, as well as primitive or array types. You can also set `default` values or mark the property as `optional` using this decorator.

```typescript
import {PropertyType} from "@lyvely/common";

export class TestModel {
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

    constructor(data: StrictBaseModelData<Optional<TestModel<any>, 'dateValue' | 'numberValue1' | 'arrayValue1'>>) {
      BaseModel.init(this, data);
    }
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
- `Class`: Call of class constructor
:::

## Transformation & Validation

By default, the Lyvely controller layer validates incoming models using a global 
[ValidationPipe](https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe). Models can be 
annotated with [class-validator](https://github.com/typestack/class-validator) validation rules, which are 
utilized both in the frontend and backend.

In your controller, you can manually define a `ClassSerializerInterceptor` interceptor to enable automatic serialization
and deserialization. To simplify this process, Lyvely offers the `@UseClassSerializer` utility decorator,
which can (and in most cases should) be applied to controller classes or controller functions.


```typescript
@Controller(API_USER_INVITATIONS)
@UseClassSerializer()
export class InvitationsController implements UserInvitationsEndpoint {
  constructor(private sendInviteService: SendInvitationsService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendInvitations(@Body() invites: InvitationRequest, @Req() req: UserRequest) {
    await this.sendInviteService.sendInvitations(req.user, invites);
  }
}
```

In the previous example the `InvitationRequest` model will be automatically transformed due to the `@UseClassSerializer`
decorator and validated due to the global validation pipeline.

:::warning
Automatic validation and transformation does not apply to generic types. If you intend to utilize generic types in a controller body 
argument, you will need to perform manual validation and transformation of the request body.
:::

:::info
For more information, please refer to the following resources:

- [class-validator](https://github.com/typestack/class-validator) for details on available validator rules.
- [class-transformer](https://github.com/typestack/class-transformer) for information about the serialization of models used in controllers.
- [NestJs - validation](https://docs.nestjs.com/techniques/validation) for a guide on how validation is managed in NestJs.
- [NestJs - serialization](https://docs.nestjs.com/techniques/serialization) for a guide of how serialization is handled in NestJs.
:::