---
sidebar_position: 1
---

# Content

The Content API is a fundamental part of Lyvely, empowering the creation of custom content types through a fine-tuned 
API and schema model. Details of this essential component will be explained in the following sections by implementing
a new poll content type, which we will integrate into our platform.

Similar to other Lyvely features, our new module will be divided into three packages: **api**, **interface**, and **web**.

## Content Interface

The interface package will enable the sharing of typesafe interfaces and models between the frontend and backend, allowing us to
reuse models, validation and even domain logic.

For custom content types, the Lyvely framework provides you with a template for creating and updating your custom content types in the
`@lyvely/interface` package. In the following sections we will create models and interfaces for a custom poll content type.

### Create Content Model

Let's start our Poll example by implementing model classes used for CRUD operations by extending
the base `CreateContentModel` class, which defines properties and validation rules required to create new poll instances
within our interface package.

```typescript title=polls/packages/interface/src/models/create-poll.model.ts
@Exclude()
export class CreatePollModel extends CreateContentModel<CreatePollModel> {
  @Expose()  
  @IsString()
  @MaxLength(200)
  title: string;

  @Expose()
  @IsString()
  @MaxLength(10_000)
  text: string;

  @Expose() 
  @IsDate()
  expiresAt: Date;
    
  @Expose()
  @IsBoolean()
  isAnonymous: boolean;

  @Expose()
  @Length(1, 1024, {each: true})
  @IsString({each: true})
  options: string[];
}
```

The `CreateContentModel` class comes with default support for the following fields:

- `tagNames`: Allows attaching tag names to a content instance.
- `parentId`: Used to specify the parent ID of a content instance. This field is typically populated by default when 
creating a content instance within a content-details discussion.

### Update Content Model

When handling updates, it's often preferred to allow partial updates. This approach enables us to modify
specific fields or parts of our document, reducing network traffic overhead, especially when updating only a single field. 
Therefore, the update model typically takes the form of a partial type derived from our `CreatePollModel` class as in the
following example:

```typescript title=polls/packages/interface/src/models/update-poll.model.ts
@Exclude()
export class UpdatePollModel extends PartialType(CreatePollModel) {
  constructor(model?: Partial<UpdateMessageModel>) {
    super(model, false);
  }
}
```

:::note
 When implementing your update model by extending the create-model, make sure that you do not carry over any default
 value initialization of your create-model logic.
:::

### Content Model

The `ContentModel` class acts as the base class for content type models in our frontend and interface layer. 
While this class mostly mirrors the structure of the backend schema, it may have some differences. 
For example, it uses string IDs instead of ObjectIds and may hold data specific to a single user while the 
schema type may contain data for multiple users. The details of the structure of a content type schema is discussed
in the [Content Type Schema](#content-type-schema) section.

Let's implement a content model for our Poll content type:

```typescript title=polls/packages/interface/src/models/poll.model.ts
/**
 * This model class represents a single, sortable poll option.
 */
export class PollOption extends BaseModel<PollOption> {
  text: string;
  sortOrder: number;
}

/**
 * This class stores the poll data.
 */
export class PollContentDataType extends ContentDataTypeModel {
  @Type(() => PollOption)
  @PropertyType([PollOption])
  options: PollOption[];
}

/**
 * This model stores a single user vote.
 */
export class PollVoteModel<TID = string> {
  // This will translate ObjectId fields into string fields in the transformer middleware of our controllers
  @TransformObjectId()
  uid?: TID;
  @TransformObjectId()
  optionId: TID;
}

/**
 * This model holds the state of a poll instance including votes.
 */
export class PollStateModel<TID = string> {
  @Type(() => PollStateModel)
  @PropertyType([PollStateModel])
  votes: PollVoteModel[];
}

/**
 * This model holds the configuration of a poll.
 */
export class PollConfigModel<TID = string> {
  isAnonymous: boolean;
  expiresAs: Date;
}

/**
 * This will be our base model for poll content, which we'l mainly use in the frontend and interfaces.
 */
@Expose()
export class PollModel<TID = string> extends ContentModel<TID, PollModel<TID>> implements IEditableModel<UpdatePollModel> {
  static contentType = 'Poll';

  type = PollModel.contentType;

  @PropertyType(PollContentDataType)
  content: PollContentDataType;

  @PropertyType(PollStateModel)
  state: PollStateModel<TID>;

  @PropertyType(PollConfigModel)
  config: PollConfigModel;

  toEditModel(): UpdatePollModel {
    return new UpdatePollModel({
      title: this.content.title,
      text: this.content.text,
      isAnonymous: this.config.isAnonymous,
      options: this.content.options
    });
  }
}
```

In this example we implemented the model classes for the poll content type.
Those classes are used within our frontend and interfaces and therefore contain validation and transformation
metadata about our models.

The `PollModel` implements the `IEditableModel` which requires the `toEditModel` function to be implemented. This is
used in the frontend by a composable responsible for updating content entries. 

The `@PropertyType` decorator is used when deserializing our models in the frontend.

:::info
In the example above we use generic types for our id fields. This is a good practice which enables us to use such
model classes as interfaces in our backend, which use ObjectIds instead of string ids.
:::

### Content Endpoints

To facilitate typesafe interfaces between the frontend and backend, Lyvely promotes the use of endpoint interfaces. 
An endpoint is defined within the interface package and can be implemented as follows:

```typescript title=polls/packages/interface/src/endpoints/poll.endpoint.ts
// This interface will be implemented by our frontend service
export interface IPollClient extends IContentTypeClient<PollModel, CreatePollModel> {}

// The endpoint interface will be implemented by our controller in the backend.
export type PollEndpoint = StrictEndpoint<IPollClient>;

// This ensures we use the same api path
export const ENDPOINT_POLLS = 'polls';
```


### Client Service

To request our backend API we first need to implement our poll repository and client:

```typescript title=polls/packages/interface/endpoints/polls.repository.ts
const api = useApi<IPollClient>(ENDPOINT_POLLS);

export default {
  create(model: CreateMessageModel) {
    return api.post<'create'>(model);
  },

  update(id: string, model: Partial<CreatePollModel>) {
    return api.put<'update'>(id, model);
  }
};
```

```typescript title=polls/packages/interface/endpoints/polls.client.ts
import { IPollClient, CreatePollModel, PollUpdateResponse } from 'lyvely-polls-interface';
import { useSingleton } from '@lyvely/common';
import repository from '../repositories';
import { unwrapAndTransformResponse, unwrapResponse } from '@lyvely/web';

export class PollsClient implements IPollClient {
    async create(model: CreatePollModel) {
        return unwrapAndTransformResponse(repository.create(model), PollUpdateResponse);
    }

    async update(id: string, model: Partial<CreatePollModel>) {
        return unwrapAndTransformResponse(repository.update(id, model), PollUpdateResponse);
    }
}

export const usePollsClient = useSingleton(() => new PollsService());

```

:::info
Please refer to the [Endpoints Section](endpoints.md) for further information about the use and implementation
of endpoints and endpoint interfaces.
:::

## Content API

This section covers the implementation of custom content types within the API layer. The API layer is responsible for 
managing access control and encompasses the majority of the business logic, encapsulated within service classes. 
Additionally, it provides an intermediary data access layer, facilitating communication between services and the database.

### Content Type Schema

A custom content type schema derives from the abstract `ContentType` class and comprises several nested schema elements, 
each serving a distinct purpose:

| Property    | Description                                                                                                                   |
|-------------|-------------------------------------------------------------------------------------------------------------------------------|
| `content`   | This section stores the actual content data representing the core content. By default it supports a `title` and `text` field. |
| `config`    | Contains content type-specific configurations. (optional)                                                                     |
| `state`     | This field is used to represent content type-specific state information. (optional)                                           |
| `meta`      | This section houses content metadata, such as author information and creation dates.                                          |
| `logs`      | Content logs store information related to specific activities associated with this content.                                   |

When creating custom content types, it is highly advisable to extend these sub-schemas,
rather than modifying the main content type schema. This approach offers several benefits:

- **Uniform Schema Format**: Separating content data from configuration and metadata ensures a consistent content schema format.
  Most content types for example use the default content data fields `title` or `text`, which are commonly used in the frontend.
- **Ease of Duplication**: With this separation, you can easily duplicate, move or even transform content instances
  without needing intricate knowledge of the internal workings of a specific content type.
- **Versioning**: The provided content schema has been thoughtfully designed to potentially support versioning, enabling
  straightforward creation and reverting of content revisions when necessary.
- **Future Compatibility**: By avoiding direct modifications to the main content type schema, you minimize the risk of
  compatibility issues and interference with potential future changes or additions to the core content schema.

:::info

By following this recommended practice, you can design custom content types that seamlessly integrate with the
Lyvely platform while maintaining flexibility and ensuring compatibility with future updates.

:::

#### `ContentType.content`:

The nested schema of our **content** property encompasses the content data of a content type.
By default, this schema supports an optional `title` and `text` field.

More complex content types can extend this schema by implementing a custom schema derived from the main
`ContentDataType` schema class. For instance, let's consider our Poll content type:

```typescript title=polls/packages/api/src/schemas/poll.schema.ts
import {BaseDocument, ContentDataType, NestedSchema, ObjectIdProp, TObjectId} from "@lyvely/api";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {BaseModel} from "@lyvely/common";

/**
 * This class will represent a single poll option.
 */
@Schema()
export class PollOption extends BaseDocument<PollOption> {
    @Prop({required: true})
    text: string;

    @Prop({required: true})
    sortOrder: number;
}

export const PollOptionSchema = SchemaFactory.createForClass(PollOption);

/**
 * This will be our custom content data type. We use the @NestedSchema 
 * since we do not require a _id field for this schema. Besides the 
 * default properties `text` and `title` of `ContentDataTyp` we add an 
 * array of options.
 */
@NestedSchema()
export class PollContentData extends ContentDataType {
    @Prop({type: [PollOptionSchema], required: true})
    @PropertyType([PollOption])
    options: PollOption[];
}

export const PollContentDataSchema = SchemaFactory.createForClass(PollContentData);

/**
 * This class implements our main poll schema with our embedded poll data type schema.
 */
@Schema()
export class Poll extends ContentType<Poll> {
    @Prop({type: PollContentDataSchema, required: true})
    content: PollContentData;

    toModel(): PollModel {
        return new PollModel(this);
    }
}

export const PollSchema = SchemaFactory.createForClass(Poll);
```

In the previous example, we introduced our `PollContentData` schema, responsible for storing poll options.
This schema extends the base `ContentDataType` schema, which already includes fields for `title` and `text`.
If required we could overwrite those default fields and mark them as required.

:::tip

If you're uncertain about whether to place specific data in the `content` field of a particular content type, consider
this: Imagine you want to duplicate an instance of your content type. Ask yourself whether this data should be included
in the duplicated version. This can help you determine whether the `content` field is the right choice for storing that
data.

:::

#### `ContentType.config`:

Many content types offer support for various configurations. Take our Poll content type, for instance; we may wish to
enable the creation of anonymous polls and set an expiration date for a poll. In the following example we extend our
Poll schema with a custom configuration schema:


```typescript title=polls/packages/api/src/schemas/poll.schema.ts
/**
 * Our PollConfig schema supports anonymous polls and an expiration date for our poll.
 */
@NestedSchema()
export class PollConfig extends BaseModel<PollConfig> {
  @Prop()
  isAnonymous: boolean;
  
  @Prop()
  expiresAs: Date;
}

export const PollConfigSchema = SchemaFactory.createForClass(PollConfig);

@Schema()
export class Poll extends ContentType<Poll> {
  @Prop({type: PollContentDataSchema, required: true})
  content: PollContentData;

  // + Here we add our config schema to the main poll schema.
  @Prop({type: PollConfigSchema, required: true})
  @PropertyType(PollConfig)
  config: PollConfig;

  toModel(): PollModel {
    return new PollModel(this);
  }
}

export const PollSchema = SchemaFactory.createForClass(Poll);
```

#### `ContentType.state`:

Some content types may require the persistence of a specific state. For instance, our Poll content type needs to keep
track of user votes. To accommodate this, we will introduce a nested schema for our **state** field.

```typescript title=polls/packages/api/src/schemas/poll.schema.ts
/**
 * This will represent a single user vote.
 */
@NestedSchema()
export class PollVote extends BaseModel<PollVote> {
  @ObjectIdProp({required: true})
  optionId: TObjectId;

  @ObjectIdProp({required: true})
  userId: TObjectId;
}

export const PollVoteSchema = SchemaFactory.createForClass(PollVote);

/**
 * This class represents the state of a single poll instance including all user votes.
 */
@NestedSchema()
export class PollState extends BaseModel<PollState> {
  @Prop({type: [PollVoteSchema], required: true})
  @PropertyType([PollVote])
  votes: PollVotes[];
}

export const PollStateSchema = SchemaFactory.createForClass(PollState);

@Schema()
export class Poll extends ContentType<Poll> {
  @Prop({type: PollContentDataSchema, required: true})
  content: PollContentData;

  @Prop({type: PollConfigSchema, required: true})
  @PropertyType(PollConfig)
  config: PollConfig;

  // + Here we add our newly created state schema to the main poll schema.
  @Prop({type: PollStateSchema, required: true})
  @PropertyType(PollState)
  state: PollState;

  toModel(): PollModel {
    return new PollModel(this);
  }
}

export const PollSchema = SchemaFactory.createForClass(Poll);
```

:::info
The optional **state** property of a content type is typically reserved for data that frequently changes over time and is specific
to a particular content instance. This data is usually not a candidate for duplication or transformation,
unlike the **content** field.
:::

#### `ContentType.meta`:

The **meta** property within a content type encompasses metadata related to the content.
Unlike the properties discussed earlier, it is less frequently extended. The meta field is of type `ContentMetadata`
and includes the following data:

| Field         | Description                                                                                        |
|---------------|----------------------------------------------------------------------------------------------------|
| `createdBy`   | The user ID responsible for creating the content.                                                  |
| `createdAt`   | The date of creation of this content instance.                                                     |
| `createdAs`   | Potential future use to create content on behalf of a profile or organization. **(optional)**      |
| `updatedAt`   | The date of the last update.                                                                       |
| `updatedBy`   | The user ID responsible for the last update.                                                       |
| `parentId`    | If part of a sub-content discussion, contains the ID of the parent content.                        |
| `parentPath`  | Stores a path of string IDs of sub-content, enabling querying for sub-content of any level.        |
| `childCount`  | Stores the number of child entries without the need for extra count queries.                       |
| `mid`         | Used when this content is assigned to a milestone. **(optional)**                                  |
| `streamSort`  | A timestamp sort value used by the content stream.                                                 |
| `sortOrder`   | A timestamp sort value for content types, used for sorting within a dedicated view. **(optional)** |
| `visibility`  | Defines the profile role visibility level of this content entry.                                   |
| `archived`    | Indicates whether this content instance is archived. **(optional)**                                |
| `deleted`     | Indicates whether this content instance was deleted by a user. **(optional)**                      |
| `locked`      | Indicates whether this content instance is marked as locked. **(optional)**                        |


#### `ContentType.logs`:

At the time of writing, this concept is still in the conceptual phase. However, in the future, the **logs** field within
the content type schema could serve as a repository for event data associated with a content instance. This data might
potentially be incorporated into the content detail view once the feature is realized.

### Content Policies

**TBD**

:::info
Please refer to the [Policies Section](policies.md) for further information regarding the implementation and usage
of policies.
:::

### Content Type DAO

As explained in the Data Access Overview section, Lyvely employs the **Data Access Object (DAO) pattern** for database 
access. This pattern introduces a layer between your services and the database, responsible for abstracting complex and 
reusable queries from the service layer.

When dealing with `ContentType` entities, you can take advantage of a specialized base DAO class called `ContentTypeDao`. 
To use this class with your custom content types, follow the example below::

```typescript title=polls/packages/api/src/daos/polls.dao.ts
import {ContentTypeDao} from "@lyvely/api";
import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import { POLLS_MODULE_ID } from 'lyvely-polls-interface';

@Injectable()
export class PollsDao extends ContentTypeDao<Poll> {
  @InjectModel(Poll.name)
  protected model: Model<Poll>;

  // The constructor will be used for constructing model instances.
  getModelConstructor() {
    return Poll;
  }

  getModuleId(): string {
    return POLLS_MODULE_ID;
  }
}
```

:::tip

In most cases you should not use the `model` field directly, but rather use the built-in DAO functions for fetching and
updating documents.

:::

### Content Type Service

Similar to the DAO layer, the Content API offers a base content service designed for custom content types—the 
`ContentTypeService`. This abstract service class serves as a template for creating, querying, and updating content 
entries while adhering to default behaviors such as triggering certain events and logging. In the example below, we demonstrate 
how to extend and implement a content type service for our poll content.

```typescript title=polls/packages/api/src/services/polls.service.ts
@Injectable()
export class PollsService extends ContentTypeService<Poll, CreatePollModel> {
  @Inject()
  protected contentDao: PollsDao;

  protected logger = new Logger(PollsService.name);

  /**
   * A template function responsible to create an Poll instance from the given CreatePollModel.
   */
  protected async createInstance(
    profile: Profile,
    user: User,
    model: CreatePollModel,
  ): Promise<Poll> {
    const {text, title, isAnonymous} = model;
    const options = model.options.map((text, sortOrder) => new PollOption({text, sortOrder}));
    
    // Here we use the default constructor for content types.
    return new Poll(profile, user, {
      content: {text, title, options},
      config: {isAnonymous, expiresAt}
    })
  }

  /**
   * This template function is responsible for creating an update query from the given update model 
   * which internally will be used within a mongodb $set update.
   * Since our update is potentially partial, we only overwrite fields which are defined.
   */
  protected async createUpdate(
      profile: Profile, 
      user: User, 
      poll: Poll, 
      update: UpdatePollModel
  ): Promise<UpdateQuerySet<Poll>> {
    poll.applyContentUpdate({
      title: update.title ?? poll.content.title,
      text: update.text ?? poll.content.text,
    });

    poll.config.isAnonymous = update.isAnonymous ?? poll.config.isAnonymous;
    poll.config.expiresAt = update.expiresAt ?? task.config.expiresAt;

    return poll;
  }
}
```

:::tip

In the previous example, we return the whole poll document as update, it is also possible to return any kind of object which
can be used as mongodb `$set` update for performance optimization.

:::

### Content Type Controller

The base `ContentTypeController` class is used to implement our endpoint as in the following example:

```typescript title=polls/packages/api/src/controllers/polls.controller.ts
@ContentTypeController(ENDPOINT_POLLS, Poll)
@UseClassSerializer()
export class PollsController
  extends AbstractContentTypeController<Poll, CreatePollModel>
  implements PollsEndpoint
{
  @Inject()
  protected contentService: PollService;

  /**
   * The following type definitions are required for validation and transformation.
   */
  protected updateResponseType = ContentUpdateResponse<PollModel>;
  protected createModelType = CreatePollModel;
  protected updateModelType = UpdatePollModel;
}
```

### Content Type Module

The final step of our backend implementation, includes creating our module class and registering our newly created
content type as follows:

```typescript title=polls/packages/api/src/polls.module.ts
import { LyvelyModule } from '@lyvely/api';
import { PollsController } from './controllers';
import { PollsService } from './services';
import { PollsDao } from './daos';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentModule, getContentModelDefinition } from '@/content';
import { Poll, PollSchema } from './schemas';
import {POLLS_MODULE_ID} from "lyvely-polls-interface";

@LyvelyModule({
  id: POLLS_MODULE_ID,
  path: __dirname,
  name: 'Polls',
  imports: [
    ContentModule.registerContentType(Poll),
    MongooseModule.forFeature([
      getContentModelDefinition([{ name: Poll.name, schema: PollSchema }]),
    ]),
  ],
  controllers: [PollsController],
  providers: [PollsService, PollsDao],
})
export class PollsModule {}
```

:::info

`ContentModule.registerContentType` is responsible for adding the content type to a central registry containing all content
types.

:::

:::info

The `getContentModelDefinition` is a helper function for defining a content type discriminator schema. If required a
module can register multiple content types by adding other content types to the array.

:::

## Content Web

Currently, only our backend knows about the existence of the Poll content type. Let's integrate it into the frontend.

### Content CRUD Modal

Lyvely offers a convenient method for registering modals used in the creation and updating of content types. 
This functionality allows you to create various content types across different sections of your application, such as 
within the content-stream or dedicated content type views.

With this feature, you can seamlessly integrate and manage different content types in various parts of your application, 
enhancing the overall user experience and flexibility.

For the purpose of this documentation, we will walk through the implementation of such a modal. 
Please note that certain aspects have been simplified to facilitate understanding.

```html
<script lang="ts" setup>
import { CreatePollModel, PollModel, UpdatePollModel } from 'lyvely-polls-interface';
import { computed } from 'vue';
import { TagChooser, isTouchScreen, ContentEditModalEmits, useContentEditModal, ICreateContentInitOptions } from '@lyvely/web';
import { usePollService } from '../services';
import { LyModal, LyFormModel, LyTextField } from '@lyvely/ui';

interface IProps {
  modelValue: boolean;
  content?: PollModel;
  type: string;
  initOptions?: ICreateContentInitOptions;
}

const props = defineProps<IProps>();
const emit = defineEmits(ContentEditModalEmits);
const service = usePollService();

const { isCreate, showModal, model, validator, submit, status } = useContentEditModal<
    PollModel,
    CreatePollModel,
    UpdatePollModel
>(props, emit, { service });

const modalTitle = computed(() => {
  return isCreate.value ? `polls.create.title` : `polls.update.title`;
});
</script>

<template>
  <ly-modal v-model="showModal" :title="modalTitle" @submit="submit" @cancel="$emit('cancel')">
    <template #preHeader><slot name="navigation"></slot></template>
    <ly-form-model
      v-model="model"
      :validator="validator"
      :status="status"
      label-key="polls.fields">
      <fieldset>
        <ly-text-field property="title" :required="true"/>
        <ly-textarea property="text" />
        <ly-textarea property="options" />
      </fieldset>

      <fieldset>
        <tag-chooser v-model="model.tagNames" />
      </fieldset>
    </ly-form-model>
  </ly-modal>
</template>
```

:::info

The `navigation` slot is required to enable multi-content type CRUD modals. 
It serves as the space where a content type selection is dynamically injected.

:::

### Content Stream Entry

To create a custom stream view for our Poll content, we can implement and register a `ContentStreamEntry` component.

```html
<script lang="ts" setup>
import { PollModel } from 'lyvely-polls-interface';
import { ContentModel, ContentStreamEntry, IStream } from '@lyvely/web';
import { LyIcon } from '@lyvely/ui';

export interface IProps {
  model: PollModel;
  stream: IStream<PollModel>;
  index: number;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-stream-entry v-bind="props" :merge="true">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <router-link :to="{ name: 'Polls' }">
          <ly-icon name="polls" class="text-main" />
        </router-link>
      </div>
    </template>

    <template #default>
      <div>
        <div class="flex items-center gap-1">
          <span>{{ model.content.title }}</span>
        </div>
        
        <ly-markdown-view :md="model.content.text" />
        
        <!-- Add some poll options and/or results -->
        
      </div>
    </template>
  </content-stream-entry>
</template>
```

> The [Content Registration](#content-registration) section will describe how to register this component.

### Content Details View

Just like our stream entry, you can also create a custom content detail component as follows:

```html
<script lang="ts" setup>
import { PollModel } from 'lyvely-polls-interface';
import { ContentDetails } from '@lyvely/web';
import { LyIcon, LyMarkdownView } from '@lyvely/ui';

export interface IProps {
  model: PollModel;
}

const props = defineProps<IProps>();
</script>

<template>
  <content-details :model="model">
    <template #image>
      <div class="flex justify-center rounded-full border border-divide w-8 h-8 bg-main">
        <router-link :to="{ name: 'Polls' }">
          <ly-icon name="polls" class="text-main" />
        </router-link>
      </div>
    </template>
    <template #body>
      <ly-markdown-view :md="model.content.text" />
      <!-- Add some fancy poll options here -->
    </template>
    <template #footer>
      <!-- Here we could add some special poll features and buttons -->
    </template>
  </content-details>
</template>
```

> The [Content Registration](#content-registration) section will describe how to register this component.

### Content Registration

Finally, we need to register our content type and components:

```typescript
import { IModule, registerContentType } from '@lyvely/web';
import {
  PollModel,
  CreatePollModel,
  POLLS_MODULE_ID, 
  PollsFeature
} from 'lyvely-polls-interface';

export default () => {
  return {
    id: POLLS_MODULE_ID,
    init: () => {
      registerContentType({
        type: PollModel.contentType,
        moduleId: POLLS_MODULE_ID,
        name: 'polls.title',
        icon: 'polls',
        feature: PollsFeature.id,
        modelClass: PollsModel,
        interfaces: {
          create: {
            mode: 'modal',
            modelClass: CreatePollModel,
            component: () => import('./components/modals/EditPollModal.vue'),
          },
          edit: {
            mode: 'modal',
            component: () => import('./components/modals/EditPollModal.vue'),
          },
          stream: {
            details: () => import('./components/content-stream/PollDetails.vue'),
            entry: () => import('./components/content-stream/PollStreamEntry.vue'),
          },
        },
      });
    },
  } as IModule;
};
```


## Planned content features

A well-thought-out content schema and API opens the door to a range of extended interconnected features, including:

- **Additional Content Types**: Such as issues and events, expanding the variety of content your platform can handle.
- **Content Versioning**: The segregation of our schema into different fields lays the foundation for a future content 
versioning feature.
- **User Assignments**: This core content feature enables the assignment of any content type to a user.
- **Scheduling**: Adding an optional scheduling feature to all content types, facilitating the inclusion of any content within a calendar.
- **Content Duplication**: Allowing users to duplicate any kind of content for ease of use and replication.
- **Content Transformation**: Easily transforming content types, such as converting simple messages into tasks, issues, or events.

## Conclusion

Understanding content and content types in Lyvely is fundamental to harnessing its capabilities for creating custom 
content-driven applications. With a clear understanding of these concepts, you can effectively design and manage 
diverse content types within your project.






