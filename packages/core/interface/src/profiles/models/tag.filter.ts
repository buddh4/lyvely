import { escapeRegExp } from 'lodash';
import { TagModel } from './tag.model';

export interface ITagFilterOptions {
  archived?: boolean;
  idSelection?: string[];
  nameSelection?: string[];
  query?: string;
}

// TODO: Extend Abstract Filter
export class TagFilter {
  archived?: boolean;
  idSelection?: string[];
  nameSelection?: string[];
  query?: string;

  constructor(obj?: ITagFilterOptions) {
    Object.assign(this, obj);
  }

  isActive() {
    return (
      this.query?.length || this.nameSelection?.length || this.idSelection?.length || this.archived
    );
  }

  apply(tags?: TagModel[]) {
    if (!tags || !tags.length) {
      return [];
    }

    return (
      tags?.filter((tag) => {
        if (this.query?.length && !tag.name.match(new RegExp(escapeRegExp(this.query), 'i'))) {
          return false;
        }

        if (this.archived === true && !tag.archived) {
          return false;
        }

        if (this.archived === false && tag.archived) {
          return false;
        }

        if (this.idSelection?.length && !this.idSelection.includes(tag.id)) {
          return false;
        }

        if (this.nameSelection?.length && !this.nameSelection.includes(tag.name)) {
          return false;
        }

        return true;
      }) || []
    );
  }
}
