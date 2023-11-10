<script lang="ts" setup>
import { computed, ref, Ref, toRefs } from 'vue';
import { storeToRefs } from 'pinia';
import { Sketch } from '@ckpack/vue-color';
import { onClickOutside } from '@vueuse/core';
import { useEditTagStore } from '@/tags/stores/edit-tag.store';
import { isTouchScreen } from '@lyvely/ui';

const tagEditStore = useEditTagStore();

const showModal = computed({
  get: () => tagEditStore.isActive,
  set: (value) => (!value ? tagEditStore.reset() : undefined),
});

const showColorPicker = ref(false);
const colorInput = ref(null) as Ref<HTMLElement | null>;
const colorPicker = ref(null) as Ref<HTMLElement | null>;

const colorStyle = computed(() => ({
  'background-color': tagEditStore.model?.color,
  width: '20px',
  height: '20px',
}));
const colorPickerStyle = ref({ top: '0', left: '0' });

function clickColorBox() {
  showColorPicker.value = true;
  colorPickerStyle.value.top =
    colorInput.value!.offsetTop + 2 + colorInput.value!.offsetHeight + 'px';
  colorPickerStyle.value.left = colorInput.value!.offsetLeft + 'px';
}

function submit() {
  tagEditStore.submit();
}

onClickOutside(colorPicker, () => (showColorPicker.value = false));
const { model, isCreate } = toRefs(tagEditStore);

const color = computed({
  get: () => model.value!.color,
  set: (val: any) => (model.value!.color = val.hex),
});

const { modalTitle } = tagEditStore;
const { validator } = storeToRefs(tagEditStore);
</script>

<template>
  <ly-modal v-if="model && validator" v-model="showModal" :title="modalTitle" @submit="submit">
    <div>
      <div
        ref="colorInput"
        class="flex w-32 space-x-2 mb-2 p-2 cursor-pointer rounded-md border border-divide shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        @click="clickColorBox">
        <div class="inline-block rounded" :style="colorStyle">&nbsp;</div>
        <div>{{ color }}</div>
      </div>

      <ly-text-field
        v-model="model.name"
        :autofocus="isCreate || !isTouchScreen()"
        label="tags.fields.name"
        :error="validator.getError('name')" />

      <ly-textarea
        v-model="model.description"
        label="tags.fields.description"
        :error="validator.getError('description')" />

      <ly-checkbox
        v-model="model.includeOnFilter"
        label="tags.fields.includeOnFilter"
        help-text="tags.help.includeOnFilter" />
    </div>

    <div
      v-if="showColorPicker"
      ref="colorPicker"
      class="absolute z-50 rounded bg-highlight"
      :style="colorPickerStyle">
      <sketch v-model="color" :disable-alpha="true" />
      <ly-button
        class="primary px-1 py-0.5 m-1 float-right"
        text="common.close"
        @click="showColorPicker = false" />
    </div>
  </ly-modal>
</template>

<style scoped></style>
