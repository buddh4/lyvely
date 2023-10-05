<script lang="ts" setup>
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { computed } from 'vue';
import { ProfileModel } from '@lyvely/profiles-interface';

export interface IProps {
  profile?: Pick<ProfileModel, 'id' | 'guid' | 'name'>;
}

const props = defineProps<IProps>();

const profile = computed(() => props.profile || useProfileStore().profile);
</script>

<template>
  <ly-avatar v-if="profile" :name="profile.name" :guid="profile.guid" />
</template>

<style scoped></style>
