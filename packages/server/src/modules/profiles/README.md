# Profiles Module

## Policies

### Static Policies

The following policies are not configurable.

#### User Profile

 - PRO_PO01: user can only create a user profile if he does not own a profile with the same name
 - PRO_PO02: A user can only add a user profile to an organization if the organization does not already have any profile with same name
 - PRO_PO03: A user can only add a user profile to an organization if the name does not equal the organization name

#### Group Profile

 - PRO_PO04: A user can only create a group profile if he does not own a profile with the same name
 - PRO_PO05: A user can only add a group profile to an organization if the organization does not already have any profile with same name
 - PRO_PO06: A user can only add a group profile to an organization if the name does not equal the organization name

#### Organization

 - PRO_PO07: A user can only create an organization if there is no other organization with the same name globally
 - PRO_PO08: A user can only create an organization if he does not already own a profile with the same name
