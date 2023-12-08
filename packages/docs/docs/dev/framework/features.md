# Features

Lyvely offers a robust mechanism for defining and managing feature switches. Features are typically defined in the 
`Interface` layer of a module and can be utilized in both the `Web` and `API` layers to determine if specific features 
are enabled or disabled, either globally or on a per-profile basis. Modules have the capability to define multiple 
features and sub-features, granting fine-grained control over feature switches.

## Feature Definition

Features are described using the `IFeature` interface, which allows for the following properties:

| Property         | Description                                                                                                                              |
|------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| **id**             | A unique identifier, typically prefixed with the module ID and main feature ID in the case of sub-features.                              |
| **moduleId**         | The ID of the module to which the feature belongs.                                                                                       |
| **title**            | A translatable string title used in the feature settings.                                                                                |
| **description**      | A translatable string used as the feature's description in the feature settings.                                                         |
| **installable**      | Indicates whether this feature can be manually installed in the frontend.                                                                |
| **enabledByDefault** | Specifies whether this feature is enabled by default.                                                                                    |
| **configurable**     | Indicates whether this feature offers additional configuration settings.                                                                 |
| **global**           | Determines whether this feature is global or profile-specific.                                                                           |
| **dependencies**     | An optional array containing IDs of dependent features. A feature is only considered enabled if all dependent features are also enabled. |
| **categories**       | An optional array of categories used for filtering in the frontend (currently not in use).                                               |


#### Example:

In the following example, we define a profile-level feature switch for a "Polls" module, which will be enabled by default:

```typescript
export const PollsFeature = {
  id: 'polls',
  moduleId: POLLS_MODULE_ID,
  title: 'polls.feature.title',
  description: 'polls.feature.description',
  installable: true,
  configurable: false,
  enabledByDefault: true,
  global: false,
};
```

:::note
A feature will only show up in the frontend feature settings of a profile, if its either `installable` or `configurable`.
:::

## Feature Registration

To utilize feature switches in both the frontend and backend, you need to register your features first.

For frontend registration, follow this pattern:

```typescript
export default () => {
  return {
    id: POLLS_MODULE_ID,
    features: [PollsFeature],
    // Other options...
  }
}
```

For backend registration, use the following approach:

```typescript
@LyvelyModule({
  id: POLLS_MODULE_ID,
  path: __dirname,
  features: [PollsFeature],
  // Other Options...
})
export class MilestonesModule {}
```

Alternatively, you can manually register features like this:

```typescript
import { registerFeatures } from '@lyvely/interface';

registerFeatures(PollsFeature);
```

This ensures that your features are available for use throughout your application.

## Feature Switch

Now that we have registered our feature, we can use it in both the frontend and backend to control access to UI 
components or API endpoints.

### Feature Switches in the Frontend

#### `useProfileFeatureStore()`

To check if a feature is enabled on the currently active profile, you can use the `useProfileFeatureStore()`
function as follows:

```typescript
const isFeatureEnabled = computed(() => useProfileFeatureStore().isFeaturesEnabled(PollsFeature.id));
```

#### Feature Switch in Menus

When using the `useProfileMenu`  utility, the menu API includes automatic and reactive feature switches:

```typescript
import {registerMenuEntry} from "@lyvely/ui";

registerMenuEntry(MY_MENU, {
  id: 'my-menu-polls',
  features: PollsFeature.id,
  // Other Options...
})
```

```typescript
const { enabledMenuEntries } = useProfileMenu(MY_MENU);
```

:::tip
Please refer to the [Menus Guide](../ui/menus.md) for more information about menus.
:::

#### Feature Switch in Routes

You can restrict route access by defining the `meta.features` property of a route:

```typescript
export const pollsRoutes = [{
  name: 'Polls',
  path: 'polls',
  meta: {
    features: PollsFeature.id
    // Other options...
  },
  //...
}]
```

#### Feature Switches in Views and Components

To utilize reactive feature switches in your views and components, you can use the `useFeatures` composable:

```html
<script lang="ts" setup>
    const { isEnabled } = useFeatures(PollsFeature.id);
</script>
<template>
    <div v-if="isEnabled">
        <!-- Render polls feature component -->
    </div>
</template>
```

### Feature Switches in the Backend

#### Feature Switches for Controllers

In controllers, you can restrict access to certain endpoints by using the `@Features`  decorator at either the 
controller or controller endpoint level, as shown below:

```typescript
@Features(PollsFeature.id)
@ProfileController(API_POLLS)
class PollsController {}
```

#### ProfileFeaturesService

You can also manually check for feature switches using the `ProfileFeaturesService`:

```typescript
@Injectable()
export class PollsService {
  constructor(private profileFeaturesService: ProfileFeaturesService) {}
  
  doSomething() {
    if(this.profileFeaturesService.isEnabled(PollsModule.id)) {
      // Do something...
    }
  }
}
```

### Feature Configuration

A feature switch check consists of three stages. 

1. First, the settings (e.g., profile settings) are checked to determine 
if a feature is enabled or disabled. 
2. If there are no profile settings, the configuration is checked, which can be used 
to overwrite the default settings of a feature. 
3. If no configuration is present for a feature, the defaults are used to 
determine whether a feature is enabled.

:::tip
For more information, please refer to the [Server Configuration Guide](../../admin/intro/server-configuration.md#features).
:::
