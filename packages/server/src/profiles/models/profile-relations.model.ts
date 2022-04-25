import { BaseUserProfileRelationType, UserProfileRelation, Profile, Membership } from '../schemas';
import { User } from '../../users/schemas/users.schema';

export class UserProfileRelations {
  user?: User;
  profile: Profile;
  relations: UserProfileRelation[] = [];

  constructor(obj: Partial<UserProfileRelations>) {
    Object.assign(this, obj);
    this.relations = this.relations || [];
  }

  isGuest(): boolean {
    return !!!this.user;
  }

  isMember(): boolean {
    return !!this.getMembership();
  }

  hasRelation() {
    return !!this.relations.length;
  }

  getMembership(): Membership | undefined {
    const membership = this.getRelationOfType(BaseUserProfileRelationType.Membership);
    return membership ? new Membership(membership) : undefined;
  }

  getRelationOfType(type: string): UserProfileRelation|undefined {
    const relations = this.getAllRelationsOfType(type);
    return relations.length ? relations[0] : undefined;
  }

  getRelationByRole(role: string): UserProfileRelation|undefined {
    const relations = this.relations.filter(r => r.role === role);
    return relations.length ? relations[0] : undefined;
  }

  getAllRelationsOfType(type: string): UserProfileRelation[] {
    return this.relations.filter(r => r.type === type);
  }

}
