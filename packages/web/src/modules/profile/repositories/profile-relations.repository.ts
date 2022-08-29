import repository from "@/repository";
import { UserToProfileRelationDto } from "@lyvely/common";


const resource = "profile-relations";

export default {
  async getRelations() {
    return repository.get<UserToProfileRelationDto[]>(`${resource}`);
  },
};
