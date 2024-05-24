<script setup lang="ts">
import { t } from '@/i18n';
import { type IContentPermission, IProfilePermission } from '@lyvely/interface';
import { computed } from 'vue';
import { useProfilePermissionsStore } from '@/profiles/stores';

interface IProps {
  permission: IProfilePermission | IContentPermission;
}

const props = defineProps<IProps>();

const profilePermissionStore = useProfilePermissionsStore();

const { getPermissionOptions, getActiveRole, setActiveRole } = profilePermissionStore;

defineEmits(['toggle', 'select-module-id']);

const activeRole = computed({
  get: () => getActiveRole(props.permission),
  set: (value: string) => setActiveRole(props.permission, value),
});

const padding = 'py-1 md:py-4';
</script>

<template>
  <tr :class="'border-divide border-b last:border-0'">
    <th scope="row" class="w-auto">
      <div :class="['border-divide', padding]">
        <div class="flex items-center">
          {{ t(permission.name) }}
        </div>
        <ly-dimmed v-if="permission.description" class="text-xs" :text="permission.description" />
      </div>
    </th>
    <td :class="['hidden w-auto whitespace-nowrap md:table-cell', padding]">
      <ly-badge
        class="bg-secondary dark:text-inverted"
        :text="{ plain: permission.moduleId }"
        @click="$emit('select-module-id', permission.moduleId)" />
    </td>
    <td :class="['w-auto whitespace-nowrap', padding]">
      <div class="flex items-center">
        <ly-select
          v-model="activeRole"
          input-class="text-xs md:text-sm"
          :options="getPermissionOptions(permission)" />
      </div>
    </td>
  </tr>
</template>

<style scoped></style>
