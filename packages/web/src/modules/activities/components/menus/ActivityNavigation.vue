<script lang="ts" setup></script>

<template>
  <ly-tab-menu>
    <ly-tab-menu-link aria-controls="calendar-plan" :to="{ name: 'Habits' }">
      <template #default="{ active }">
        <div class="flex gap-1 items-center justify-center">
          <ly-icon name="activity" class="h-3" />
          <span :class="!active ? 'hidden md:inline' : ''">
            {{ $t('activities.habits.title') }}
          </span>
        </div>
      </template>
    </ly-tab-menu-link>
    <ly-tab-menu-link aria-controls="calendar-plan" :to="{ name: 'Tasks' }">
      <template #default="{ active }">
        <div class="flex gap-1 items-center justify-center">
          <ly-icon name="task" />
          <span :class="!active ? 'hidden md:inline' : ''">
            {{ $t('activities.tasks.title') }}
          </span>
        </div>
      </template>
    </ly-tab-menu-link>
    <ly-tab-menu-link aria-controls="calendar-plan" :to="{ name: 'Milestones' }">
      <template #default="{ active }">
        <div class="flex gap-1 items-center justify-center">
          <ly-icon name="target" class="h-3" />
          <span :class="!active ? 'hidden md:inline' : ''">
            {{ $t('activities.milestones.title') }}
          </span>
        </div>
      </template>
    </ly-tab-menu-link>
  </ly-tab-menu>
</template>

<style lang="postcss"></style>
