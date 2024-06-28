# Data Access Layer (DAL)

In this section, we explore Lyvely's Data Access Layer (DAL), which acts as an abstraction layer between your services 
and the database. Lyvely utilizes MongoDB primarily with [@nestjs/mongoose](https://docs.nestjs.com/techniques/mongodb), 
implementing the Data Access Object (DAO) pattern. It is strongly recommended to utilize the DAO API described in this 
section instead of directly injecting a mongoose model into your service.

:::info
Lyvely uses Mongoose primarily for schema validation. DAOs handle and return instances of the schema class rather than 
raw mongoose documents, utilizing the [Query API](https://mongoosejs.com/docs/api/query.html) and 
the [`Query.lean()`](https://mongoosejs.com/docs/api/query.html#Query.prototype.lean()) function.
:::

## Models & Schema

Database model classes are used to define the schema documents. For model definition and registration Lyvely uses the 
[@nestjs/mongoose](https://docs.nestjs.com/techniques/mongodb) module, which supports decorator based schema definitions.

Schema properties can be defined by using the `@Prop` decorator. The following example illustrates a very simple database
document model class:

```typescript
import type { TObjectId } from "@lyvely/api";

@Schema()
export class MyModel {
  @Prop()
  name: string;

  // Those fields will usually be set by mongoose when peristing a document
  _id: TObjectId;
  id: string;
}

export const MyModelSchema = SchemaFactory.createForClass(MyModel);
```

### Nested Schemas

In order to embed schemas, you can define the `type` property option or use the `@NestedSchema` decorator as in the 
following examples. In the examples above, we also utilize the `@PropertyType` utility described in the [Models Guide](./models.md) 
to ensure type safety. Without this utility, a query result will only include the raw data of a nested property instead 
of actual class instances.

```typescript
import type { TObjectId } from "@lyvely/api";

@Schema()
export class MySubModel {
  @Prop()
  text: string;

  // Those fields will usually be set by mongoose when peristing a document
  _id: TObjectId;
  id: string;
}

export const MySubModelSchema = SchemaFactory.createForClass(MySubModel);

@Schema()
export class MyModel {
  @Prop()
  name: string;

  // Here we define a property with an array of sub documents
  @Prop({ type: MySubModelSchema })
  sub: MySubModel;

  // Here we define a property with an array of sub documents
  @Prop({ type: [MySubModelSchema] })
  @PropertyType([MySubModel])
  subArr: MySubModel[];

  // Those fields will usually be set by mongoose when peristing a document
  _id: TObjectId;
  id: string;
}

export const MyModelSchema = SchemaFactory.createForClass(MyModel);
```

A sub schema often does not require a `_id` and `id` field. For this purpose we can utilize the `@NestedSchema` decorator
of the `@lyvely/api` package:

```typescript
import type { TObjectId, NestedSchema } from "@lyvely/api";
import { PropertyType } from "./property-type.decorator";

@NestedSchema()
export class MySubModel {
  @Prop()
  text: string;
}

export const MySubModelSchema = SchemaFactory.createForClass(MySubModel);

@Schema()
export class MyModel {
  @Prop()
  name: string;

  @Prop({type: MySubModelSchema})
  @PropertyType(MySubModel)
  sub: MySubModel;

  // Those fields will usually be set by mongoose when peristing a document
  _id: TObjectId;
  id: string;
}

export const MyModelSchema = SchemaFactory.createForClass(MyModel);
```

:::tip
Feel free to use the `BaseModel` and `@PropertyType` decorator utilities described in the [Models Guide](./models.md) 
when implementing database model classes to assure type safety and consistency.
:::

### `@ObjectIdProp`

In order to define relations between documents, it is common to link a related document by 
its [ObjectId](https://www.mongodb.com/docs/manual/reference/bson-types/#objectid). Lyvely provides two helper 
decorators that simplify the schema definition of such links:

```typescript
import type { TObjectId } from "@lyvely/api";
import { ObjectIdProp } from "./object-id-prop.decorator";

@Schema()
export class MyModel {
  // Here we define a required ObjectId, which links to another document
  @ObjectIdProp({ required: true })
  sub: TObjectId;

  // Here we define an array of object ids with an empty array as default
  @ObjectIdArrayProp({ default: () => [] })
  subArr: TObjectId[];
  
  //...
}
```

## Data Access Helpers

### `DocumentIdentity`

The `DocumentIdentity` type is heavily used in the Data Access Layer and supports the identification of an object by:

- String id
- ObjectId
- Model instance with _id field

The `DocumentIdentity` is often accepted as a parameter for data access functions, which expect a document id in 
combination with the `assureObjectId` or `assureStringId` helper function of the `@lyvely/api` package.

### `assureObjectId`

The `assureObjectId` helper function can be used to transform a `DocumentIdentity` to an actual `ObjectId` instance. If
an incorrect or empty id is provided, this functions throws an `IntegrityException` by default. For cases in which you may
want to accept an empty (`null` or `undefined`) id, you can set the second argument to `true`:

```typescript
import { assureObjectId } from "@lyvely/api";

// Throws an error
assureObjectId('not an objectid');

// Throws an error
assureObjectId(null);

// Returns undefined
assureObjectId(null, true);

// Returns an ObjectId instance
assureObjectId('542c2b97bac0595474108b48');

// Returns the _id of myModel
assureObjectId(myModel);

// Returns the _id of myModel
assureObjectId(myModel._id);
```
This helper is commonly used in queries or when setting document relations. Similarly, the `assureStringId` function 
transforms a `DocumentIdentity` to a string id.


## Data Access Object (DAO)

The DAO pattern involves dedicated classes that abstract data access logic of a specific collection. Lyvely 
includes an `AbstractDao` class, serving as a base class for all data access objects, offering convenient functions 
for data access and manipulation.

A DAO is responsible for:

- Accessing documents
- Document manipulation
- Managing transactions
- Managing transformations
- Managing DAO related events
- Multi-Tenancy data isolation

### `AbstractDao`

In the following example, we implement a simple DAO class that includes a helper method `updateFieldA` for updating a
specific field of the document by utilizing the `updateOneSetById` function.

```typescript title=daos/polls.dao
import { AbstractDao, Dao, DocumentIdentity } from "@lyvely/api";

@Dao(MyModel)
export class MyDao extends AbstractDao<MyModel> {
  updateFieldA(identity: DocumentIdentity<MyModel>, fieldA: string) {
    return this.updateOneSetById(identity, { fieldA });
  }
}
```

The `AbstractDao` base class provides the following data access functions:

| Function                      | Description                                                                                              |
|-------------------------------|----------------------------------------------------------------------------------------------------------|
| `findById`                    | Finds a single document by `DocumentIdentity`.                                                           |
| `findByIdAndFilter`           | Finds a single document by `DocumentIdentity` and a filter.                                              |
| `findAllByIds`                | Finds multiple documents by `DocumentIdentity`.                                                          |
| `findAll`                     | Finds multiple documents by filter.                                                                      |
| `findOne`                     | Finds a single documents by filter.                                                                      |
| `findOneAndSetById`           | Finds and updates a single document by `DocumentIdentity` and `$set` query.                              |
| `findOneAndUpdateById`        | Finds and updates a single document by `DocumentIdentity`.                                               |
| `findOneAndUpdateSetByFilter` | Finds and updates a single document by `DocumentIdentity` and `$set` and filter query.                   |
| `findOneAndUpdateByFilter`    | Finds and updates a single document by `DocumentIdentity` and filter query.                              |
| `upsert`                      | Similar to `findOneAndUpdate` but with `upsert` flag, which creates a new document if it does not exist. |
| `updateOneSetById`            | Updates a signle document by `DocumentIdentity` and `$set` query.                                        |
| `updateOneUnsetById`          | Updates a signle document by `DocumentIdentity` and `$unset` query.                                      |
| `updateOneById`               | Updates a signle document by `DocumentIdentity`.                                                         |
| `updateOneByFilter`           | Updates a signle document by `DocumentIdentity` and additional filter query.                             |
| `updateBulk`                  | Used for bulk document updates.                                                                          |
| `updateSetBulk`               | Used for bulk document `$set` updates.                                                                   |
| `reload`                      | Used for reloading a document by `DocumentIdentitiy`.                                                    |
| `deleteManyByIds`             | Delete many documents by id.                                                                             |
| `deleteMany`                  | Delete many documents by filter.                                                                         |
| `deleteOne`                   | Delete a single document by filter.                                                                      |
| `deleteById`                  | Delete a single document by `DocumentIdentity`.                                                          |
| `aggregate`                   | Runs an aggregation pipeline.                                                                            |

### Multi-Tenancy

Lyvely supports the following levels of data isolation:

| Isolation | Description                                         |
|-----------|-----------------------------------------------------|
| `none`    | No active data isolation.                           |
| `profile` | Only specific organizations are isolated (default). |
| `strict`  | Most collections are isolated.                      |

Each DAO is configured with a specific isolation level based on the requirements of its collection. For example, a 
collection that should only be isolated when the platform's isolation level is set to `strict` can be defined as follows:

```typescript
@Dao({ isolation: TenancyIsolation.Strict })
export class MyDao extends AbstractDao<MyModel> {
  //...
}
```

A good example of a collection with strict isolation requirements is the `user` collection. The `user` collection is not 
directly related to any profile and should remain in the main database if the isolation level is set to `profile` or `none`, 
and only be isolated if the isolation level is  `strict`.

In contrast, the `content` collection is a good example of a collection with a `profile` isolation level. Documents in 
this collection are directly related to a single profile/organization and should be isolated if the isolation level is 
set to `profile` or `strict`.

Only a few collections require an isolation level of `none`. An example of such a collection could be a global tenancy 
collection managing the relationship between subdomains and tenancy IDs. This collection always needs to be part of the 
main database since it is used to identify tenants.

:::note
Multi tenancy support is currently experimental.
:::

## Migrations

Handling migrations in MongoDB offers various approaches, including traditional migration scripts and document
versioning. At present, Lyvely exclusively employs document transformations during runtime within the DAO layer.
This means developers are able to implement and register document transformations, which are then applied once
documents are loaded within the data access layer of the application. The subsequent section describes the process
of implementing and registering such document transformations.

:::note
In subsequent versions, we may introduce support for alternative methods of registering migrations, such as
traditional migration scripts.
:::

### Transformation

Document transformations serve to convert older versions of documents into newer versions. This is achieved by
registering transformation objects with the relevant DAO of a collection.

Transformations adhere to the `IDocumentTransformation` interface, as demonstrated in the following example:

```typescript title=schemas/transformations/test-document-type.transformation
import type { IDocumentTransformation } from "@lyvely/api";

class TestDocumentTypeTransformation implements IDocumentTransformation<TestDocument> {
  getId(): string {
    return TestDocumentTypeTransformation.name;
  }
  
  condition(doc: LeanDoc<TestDocument>) {
    return ['TypeA', 'TypeB'].includes(doc.type);
  }
  
  transform(doc: LeanDoc<TestDocument>): LeanDoc<TestDocument> {
    const type = { TypeA: 'a', TypeB: 'b' }[doc.type] || doc.type;
    return { ...doc, type };
  }
}
```
In the previous example, we created a simple transformation, designed to convert documents using an old `type`
format. To register this transformation within our DAO, follow these steps:

```typescript
import { AbstractDao } from "@lyvely/api";

export class TestDocumentDao extends AbstractDao<TestDocument> {
  //...
  constructor() {
    super();
    this.registerTransformations(new TestDocumentTypeTransformation());
  }

}
```

Each DAO instance includes a `transformer` property responsible for testing and applying registered transformations
specific to that data access object. This transformer is invoked each time a document is loaded, such as through
`findOne` or `findAll`. If the `condition` test for a document succeeds, the document undergoes transformation via the
`transform` function and is subsequently persisted (in the case of `findAll`, this occurs via a `bulkWrite` operation).

:::note
Transformations are executed prior to instantiating the related model class, allowing for the transformation of
discriminator types.
:::

### Versioning

To ensure type safety and accommodate changes in document structure, it's advisable to maintain multiple versions of
your documents. This can be accomplished by introducing a `version` property to your schema and retaining copies of
old document version schema classes.

The following example demonstrates the implementation of document versioning for our `TestDocument` collection:

```typescript title=schemas/test-document-v1.schema
@Schema()
export class TestDocumentV0 {
  @Property()
  oldField: string;
  
  version?: string;
}
```

```typescript title=schemas/test-document.schema
@Schema()
export class TestDocument {
  @Property()
  newField: string;
  
  @Property({ type: Number })
  version = 1;
  
  constructor(newField: string) {
    this.newField = newField;
  }
}
```

```typescript title=schemas/test-document.versions;
export type TestDocumentVersions = TestDocument | TestDocumentV1;
```

```typescript title=schema/transformations/test-document-v1.transformation
import type { IDocumentTransformation } from "@lyvely/api";

class TestDocumentV1Transformation implements IDocumentTransformation<TestDocumentVersions, TestDocument, TestDocumentV0> {
  getId(): string {
    return TestDocumentV1Transformation.name;
  }
  
  condition(doc: LeanDoc<TestDocumentVersions>) {
    return !doc.version;
  }
  
  transform(doc: LeanDoc<TestDocumentV0>): LeanDoc<TestDocument> {
    return new TestDocument(doc.oldField);
  }
}
```

```typescript title=daos/test-document.dao
import {AbstractDao} from "@lyvely/api";

export class TestDocumentDao extends AbstractDao<TestDocument, TestDocumentVersions> {
  //...
  constructor() {
    super();
    this.registerTransformations(new TestDocumentV1Transformation());
  }

}
```

### Discriminator Transformation

For collections utilizing discriminators, specialized transformers and transformations are provided to facilitate the
creation of discriminator-specific transformations. Consider the following example:

```typescript title=schemas/transformations/my-type-v2.transformation
export abstract class MyTypeV2Transformation extends DocumentTypeTransformation<MyTypeVersions, MyType, MyTypeV2> {
  // The documenType is just a static field containing the discriminator type value for this type.
  discriminator = MyType.documentType;
  
  getId(): string {
    return MyTypeV2Transformation.name;
  }
  
  typedCondition(doc: LeanDoc<MyTypeVersions>): boolean {
    // The check against the discriminator type is implicit, so we do not have to care about it.
    return doc.version === 1;
  }
  
  transform(doc: MyTypeV2): MyType {
   // Some transformation logic... 
  }
}
```

In the previous example, we implemented a transformation for the discriminator type `MyType`, incorporating a
type-specific condition within the `typedCondition` evaluation. This transformation exclusively targets documents
sharing the same discriminator as specified in the `discriminator` property, and meeting our type-specific condition.

:::note
`DocumentTypeTransformation` represents a specialized form of `DiscriminatorTransformation` specifically designed for
collections using the `type` field as the discriminator. If your collection uses a different field for discriminator
purposes, extend the `DiscriminatorTransformation` instead.
:::

If your collection anticipates numerous discriminator types with a multitude of migrations, we aim to optimize the
process by avoiding the need to test each document against every available transformation. This optimization is achieved
by incorporating the `DocumentTypeTransformer` into your DAO:

```typescript title=daos/my-type.dao
import {AbstractDao} from "@lyvely/api";

export class MyGenericTypeDao extends AbstractDao<MyGenericType> {
  override transformer = new DocumentTypeTransformer<MyGenericType>();
  //...
}
```

:::note
`DocumentTypeTransformer` represents a specialized form of `DiscriminatorDocumentTransformer` specifically designed for
collections using the `type` field as the discriminator. If your collection uses a different field for discriminator
purposes, extend the `DiscriminatorDocumentTransformer` instead.
:::
