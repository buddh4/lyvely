# Rules

Modules can intercept or overwrite certain business rules on your platform or implement own extendable business rules by
means of nests event api.

Beside the extendability of rules the rule API enables the implementation of such rules in separated classes, which should
reside in the `rules` directory of the owning (or overwriting) module. All important business rules of a module
can easily be overviewed and are easy to find and reusable.

**Example:**

```ts
@Injectiable()
class MyCanArchiveContentRule extends CanArchiveContentRule {
  @Inject()
  private myService: MyService;
  
  @OnEvent('content.rules.canArchive')
  handleRuleEvent(event: ContentRuleEvent) {
    if(myService.isSpecialUser(event.user)) {
      event.result = true;
    } else {
      super.handleRuleEvent(event);
    }
  }
}
```

> Note: If you overwrite a non-core module you should not extend the base rule class, 
> but rather access the original rule by `Event.originalRule`. Another approach would be injecting the original rule.

See [Nest Docs](https://docs.nestjs.com/techniques/events) for more information about event handling in nest.



## Open Issues

- How to handling competing rules