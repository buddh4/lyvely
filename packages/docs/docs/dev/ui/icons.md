# Icons

The @`@lyvely/ui` package offers a versatile `LyIcon` component for rendering icons, along with a convenient method 
for registering new icons or entire icon libraries, as explained further in this section.

## Using Icons

By default, Lyvely provides an SVG-based icon library that can be integrated into your templates:

```html
<ly-icon name="stop" />
```

As of the current version, the following icons are available:

- `play` 
- `google`
- `github`
- `facebook`
- `guest`
- `plus`
- `stream`
- `stop`
- `close`
- `pause`
- `account`
- `help`
- `external_link`
- `refresh`
- `camera`
- `send`
- `email`
- `profile`
- `security`
- `open`
- `lyvely`
- `drag`
- `dropdown`
- `activity`
- `journal`
- `statistics`
- `menu`
- `score`
- `mail_add`
- `star`
- `back`
- `today`
- `error_network`
- `warning`
- `error`
- `error_outline`
- `info`
- `success`
- `edit`
- `archive`
- `restore`
- `filter`
- `logout`
- `tags`
- `search`
- `light-mode`
- `bell`
- `dark-mode`
- `settings`
- `users`
- `user`
- `invite`
- `envelope-open`
- `delete`
- `group`
- `private`
- `envelop`
- `language`
- `eye`
- `eye-slash`
- `caret-up`
- `caret-right`
- `caret-down`
- `caret-left`
- `arrow-left`
- `arrow-right`
- `arrow-up`
- `arrow-down`
- `task`
- `check`
- `loop`
- `target`
- `paper-plane`

## Register SVG Icons

Your module can register additional icons using the `registerSvgIcon` method, as demonstrated below:

```typescript
import { registerSvgIcon } from "@lyvely/ui";

registerSvgIcon('my-module-fire', {
  name: 'fire',
  viewBox: '0 0 32 32',
  paths: [
    'M10.031 32c-2.133-4.438-0.997-6.981 0.642-9.376 1.795-2.624 2.258-5.221 2.258-5.221s1.411 1.834 0.847 4.703c2.493-2.775 2.963-7.196 2.587-8.889 5.635 3.938 8.043 12.464 4.798 18.783 17.262-9.767 4.294-24.38 2.036-26.027 0.753 1.646 0.895 4.433-0.625 5.785-2.573-9.759-8.937-11.759-8.937-11.759 0.753 5.033-2.728 10.536-6.084 14.648-0.118-2.007-0.243-3.392-1.298-5.312-0.237 3.646-3.023 6.617-3.777 10.27-1.022 4.946 0.765 8.568 7.555 12.394z'
  ],
})
```

:::note
To prevent conflicts, it is advisable to prefix your icons with your module's name.
:::

## Register an Icon Library

Alternatively, you can register an entire icon library with the registerIconLibrary method:

```typescript
import { registerIconLibrary } from "@lyvely/ui";

registerIconLibrary({
  id: 'my-module',
  component: MyModuleIcon,
  getBindings(props: IconProps) {
    // map props if requried or just return given props
  }
})
```

You can then use icons from this library in your templates as shown below:

```html
<ly-icon lib="my-module" name="my-icon" />
```

:::tip
The `LyIcon` component offers a `lib-bindings` attribute, allowing you to bind library-specific attributes to your custom 
icon component. Presently, these custom bindings should be managed within the `getBindings` function of the icon library.
:::

This approach provides a convenient way to manage and use custom icons and icon libraries within your module.