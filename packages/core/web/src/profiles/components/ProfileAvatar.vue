<script lang="ts" setup>
import { useProfileStore } from '@/profiles/stores';
import { computed } from 'vue';
import { ProfileModel } from '@lyvely/interface';

export interface IProps {
  profile?: Pick<ProfileModel, 'id' | 'guid' | 'name' | 'avatar'>;
  border?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  border: true,
});

const profile = computed(() => props.profile || useProfileStore().profile);
</script>

<template>
  <ly-avatar
    v-if="profile"
    :avatar="profile.avatar"
    :name="profile.name"
    :guid="profile.guid"
    :border="border" />
</template>

<style scoped></style>
