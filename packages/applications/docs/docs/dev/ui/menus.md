# Menus

In this section, we explore how to register dynamic menu entries using the `@lyvely/ui` package.

## Implementing a menu

You can create menus by using the `useMenu` or `useProfileMenu` composables. In the following example, we create
a dropdown menu with the ID `MY_MENU_ID`.

```html title=packages/web/src/components/menus/MyMenu.vue
<script lang="ts" setup>
  import {useProfileMenu} from "@lyvely/web";
  import { MY_MENU_ID } from '@/my.constants';
  
  const { enabledMenuEntries } = useProfileMenu(MY_MENU_ID);
</script>

<template>
  <ly-dropdown>
    <ly-dropdown-link
      v-for="entry in enabledMenuEntries"
      :key="entry.id"
      :icon="entry.icon"
      :label="entry.text" 
      :route="entry.route"
      @click="entry.click"/>
  </ly-dropdown>
</template>
```

#### Menu Context

Some menus may provide additional context to their menu entries. For example, a content dropdown may provide a content
model as context. You can achieve this by using the `context` argument of the `useProfileMenu` function:

```typescript
const { enabledMenuEntries } = useProfileMenu(MY_MENU_ID, props.content);
```

## Registering Menu Entries

You can register menu entries to a menu using the `registerMenuEntries` and `registerMenuEntry` functions. This typically
occurs within a modules `init` function.

**Simple Menu Entry Registration:**

The following example demonstrates simple menu entry registration within the `init` function of a module:

```typescript
export default () => {
  return {
    id: MY_MODULE_ID,
    init: () => {
      registerMenuEntry(MY_MENU_ID, {
        id: 'my-module',
        icon: 'my-icon',
        moduleId: MY_MODULE_ID,
        to: { name: 'MyModule' },
        sortOrder: 2000,
        text: 'my-module.labels.main_nav',
      });
    }
  }
}
```

**Registering a Reactive Menu Entry:**

If your menu entry contains conditional values that depend on reactive state, you need to wrap the result in a function
instead of providing a plain object, as shown below:

```typescript
export default () => {
  return {
    id: MY_MODULE_ID,
    init: () => {
      registerMenuEntry(MY_MENU_ID, () => ({
        id: 'my-module',
        icon: myModuleStore().someCondition() ? 'icon-a' : 'icon-b',
        moduleId: MY_MODULE_ID,
        to: { name: 'MyModule' },
        sortOrder: 2000,
        text: 'my-module.labels.main_nav',
      }));
    }
  }
}
```

**Registering Menu Entry with a Condition:**

You can add a condition to your menu entry, which determines whether the menu entry will be rendered or not. In most cases, you want
your condition to be reactive, so we wrap the menu entry in a function:

```typescript
export default () => {
  return {
    id: MY_MODULE_ID,
    init: () => {
      registerMenuEntry(MY_MENU_ID, () => ({
        // Other options
        condition: useMyModuleStore().showMenuEntry()
      }))
    }
  }
}
```

**Registering Menu Entry with a Feature Switch:**

When using the `useProfileMenu` composable, you can easily register menu entries that are bound to a feature switch by
using the `features` property, which can be defined as a string or an array of strings:

```typescript
export default () => {
  return {
    id: MY_MODULE_ID,
    init: () => {
      registerMenuEntry(MY_MENU_ID, () => ({
        // Other options
        features: MyModuleFeature.id,
      }))
    }
  }
}
```

:::info
The menu entry feature switch is reactive by default, even without using a function.
:::

