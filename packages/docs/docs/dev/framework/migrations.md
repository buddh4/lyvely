# Migrations

Handling migrations in MongoDB offers various approaches, including traditional migration scripts and document 
versioning. At present, Lyvely exclusively employs document transformations during runtime within the DAO layer. 
This means developers are able to implement and register document transformations, which are then applied once 
documents are loaded within the data access layer of the application. The subsequent section describes the process 
of implementing and registering such document transformations.

:::note
In subsequent versions, we may introduce support for alternative methods of registering migrations, such as 
traditional migration scripts.
:::

## Document Transformation

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

### Document Versioning

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
