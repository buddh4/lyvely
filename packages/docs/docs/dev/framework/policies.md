# Policies

Through the use of Policies, you can establish configurable rules to govern your platform. Much like Permissions, 
Policies serve as a means of access control, allowing you to restrict access to specific features or endpoints. However,
while Permissions primarily focus on determining whether a user has permission for certain actions, Policies can perform
more intricate checks, including interactions with other services or server configurations.

To illustrate, consider the example of write access to content documents. This access cannot rely solely on permission 
checks. For instance, content should be writable by its author, but not if it is locked or archived. Some content types
may also define specific rules for writing or deleting content—all of which can
be addressed using Policies.

Policies are globally accessible and can be integrated into your services or used in conjunction with 
controller guards.

It's worth noting that Policies are mainly employed in the backend. If there's a need to access certain policies 
in the frontend, your module should provide access either through API endpoints or by injecting policies into the 
application or profile configuration.

## `IPolicy` Interface

All policy classes implement the base  `IPolicy` interface, which consists of the following:

```typescript
export interface IPolicy<C> {
  verify(context: C): Promise<boolean>;
}
```

## Implement a Custom Policy

A policy typically requires specific context information to verify an access rule. This context may include properties 
such as the user, profile, or a content instance.

Consider the following simplified policy that manages access to closing a poll. This policy will only grant access 
to the author of a poll and implements the `IContentPolicy`, which requires the context to contain an optional user, 
a profile, and a content instance within its context.

```typescript title=api/src/policies/close-poll.policy.ts
export class ClosePollPolicy implements IContentPolicy<Poll> {
    async verify(context: ProfileContentContext): Promise<boolean> {
        if (!context.user) return false;
        return context.content._id.equals(context.user._id);
    }
}
```

:::info
When injecting dependencies into your policy, it's advisable to utilize the 
[NestJS ModuleRef](https://docs.nestjs.com/fundamentals/module-ref) mechanism. This is recommended since 
your policy will be part of a global policy module rather than the module where it is defined. 
Using `ModuleRef` ensures that dependencies can be correctly resolved within the NestJS application context.
:::

## Export a Policy

To make your policy globally available and configurable, you need to export it within your module as follows:

```typescript title=api/src/polls.module.ts
@LyvelyModule({
    id: POLLS_MODULE_ID,
    path: __dirname,
    policies: [ClosePollPolicy]
})
class PollsModule {}
```

## Inject a Policy

We can now manually inject and verify the policy as follows:

```typescript
@Injectable()
export class PollsService {
    @InjectPolicy(ClosePollPolicy.name)
    private closePollPolicy: IContentPolicy<Poll>
    
    async canClosePoll(context: ProfileContext, content: MyContent): Promise<boolean> {
        const { user, profile } = context;
        return this.contentWritePolicy.verify({ user, profile, content })
    }
}
```

## Policy Guards

Policies can also be employed in the controller layer through the `@Policies` decorator, which accepts one or multiple 
policies. To ensure this functionality works as intended, it's important to have the correct controller context set, 
as illustrated in the table below:

| Policy                | Context                     | Controller                           | Description                                             |
|-----------------------|-----------------------------|--------------------------------------|---------------------------------------------------------|
| `IOptionalUserPolicy` | `IOptionalUserContext`      | any                                  | Any endpoint supporting visitor access                  |
| `IUserPolicy`         | `IUserContext`              | any user only endpoint | Any endpoint requiring user authentication              |
| `IProfilePolicy`      | `IProfileContext`           | `@ProfileController`                 | Any profile endpoint supporting visitor access          |
| `IProfileUserPolicy`  | `IProfileUserContext`       | `@ProfileController`                 | Any profile endpoint requiring user authentication      |
| `IContentPolicy`  | `ProfileContentContext`     | `@ContentTypeController`             | Any content type endpoint supporting visitor access     |
| `IContentUserPolicy`  | `ProfileContentUserContext` | `@ContentTypeController`             | Any content type endpoint requiring user authentication |

These Policy Guards allow you to control access to various controllers based on the specified policies and their 
associated contexts.

In the following example, we utilize the `ClosePollPolicy` at the controller function level to protect the `closePoll` 
endpoint. This approach is effective because the `@ContentTypeController` is responsible for establishing the required 
request context.

```typescript
@ContentTypeController(API_POLLS, Poll)
export class PollsController {
    constructor(private pollsService: PollsService) {}
    
    @Policies(ClosePollPolicy)
    @Post(PollsEndpoints.close(':cid'))
    closePoll(request: ProfileContentRequest<Poll>) {
        const { context } = request;
        this.pollsService.close(context);
    }
}
```

:::note
When using a `IContentUserPolicy` instead of `IContentPolicy`, we would need an additional guard like
`@Visibility(VisibilityLevel.User)` or `@Visibility(VisibilityLevel.Member)` in order to assure an user instance
is present in our policy context.
:::
