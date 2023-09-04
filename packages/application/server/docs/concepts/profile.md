Profile -* Membership *- User
Profile -* Role *- Membership
Role -* Permissions

Example Permission:

content.read
content.create
content.update
content.write = [update, create]
content.delete
content.* = [read, write, delete, ...]
content.manage = [*]

content.task.read
...
