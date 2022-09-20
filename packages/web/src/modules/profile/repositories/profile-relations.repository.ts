import repository from "@/repository";
import { ProfileRelationInfo } from "@lyvely/common";


const resource = "profile-relations";

export default {
  async getRelations() {
    return repository.get<ProfileRelationInfo[]>(`${resource}`);
  },
};
