import { escapeRegExp } from 'lodash';
import { TagModel } from './tag.model';

export interface TagFilterOptions {
  archived?: boolean;
  idSelection?: string[];
  nameSelection?: string[];
  query?: string;
}

export class TagFilter {
  archived?: boolean;
  idSelection?: string[];
  nameSelection?: string[];
  query?: string;

  constructor(obj?: TagFilterOptions) {
    Object.assign(this, obj);
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
