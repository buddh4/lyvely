<script lang="ts" setup>
import MainContainer from '@/modules/ui/components/layout/MainContainer.vue';
import Tag from '@/modules/tag/components/Tag.vue';
import { useProfileStore } from "@/modules/user/store/profile.store";
import { computed, ref, Ref} from 'vue';
import Button from "@/modules/ui/components/button/Button.vue";
import Icon from "@/modules/ui/components/icon/Icon.vue";
import EditTagModal from "@/modules/tag/components/EditTagModal.vue";
import { useEditTagStore } from "@/modules/tag/stores/editTagStore";
import { ITag, EditTagDto } from "@lyvely/common";

const profileStore = useProfileStore();
const { setEditModel } = useEditTagStore();
const tags = computed(() => profileStore.profile?.tags || []);
const model = computed(() => useEditTagStore().model);

const setEditTag = (tag: ITag) => {
  setEditModel(tag.id, new EditTagDto(tag))
}

</script>

<template>
  <MainContainer id="activity-overview">
    <div class="border border-divide rounded">
      <div class="divide-y">
        <div class="prose py-2 px-3 ">
          <h4><Icon name="tags" class="mr-2" />Tags</h4>
        </div>

        <div v-for="tag in tags" :key="tag.id" class="flex py-4 px-3 bg-content items-center">
          <div class="align-middle">
            <Tag :tag="tag" class="px-3 py-2 text-sm" />
          </div>
          <div class="mr-auto"></div>
          <div class="align-middle">
            <Button @click="setEditTag(tag)"><Icon name="edit" /></Button>
            <Button><Icon name="archive" /></Button>
          </div>
        </div>

      </div>
    </div>
    <EditTagModal />
  </MainContainer>
</template>

<style scoped></style>
