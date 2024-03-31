<script lang="ts" setup>
import { useProfileStore } from '@/profiles/stores';
import { computed } from 'vue';
import { ProfileModel } from '@lyvely/interface';

export interface IProps {
  profile?: Pick<ProfileModel, 'id' | 'guid' | 'name' | 'avatar'>;
}

const props = defineProps<IProps>();

const profile = computed(() => props.profile || useProfileStore().profile);
</script>

<template>
  <ly-avatar v-if="profile" :avatar="profile.avatar" :name="profile.name" :guid="profile.guid" />
</template>

<style scoped></style>
