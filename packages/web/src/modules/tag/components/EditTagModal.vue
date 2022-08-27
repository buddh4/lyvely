<script lang="ts" setup>
import Modal from "@/modules/ui/components/modal/Modal.vue";
import { computed, ref, Ref, toRefs} from 'vue';
import { Sketch } from '@ckpack/vue-color'
import { onClickOutside } from '@vueuse/core'
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import Button from "@/modules/ui/components/button/Button.vue";
import { useEditTagStore } from "@/modules/tag/stores/editTagStore";

const tagEditStore = useEditTagStore();

const showModal = computed( {
  get: () => tagEditStore.isActive,
  set: (value) => !value ? tagEditStore.reset() : undefined
});

const showColorPicker = ref(false);
const colorPicker = ref(null) as Ref<HTMLElement|null>;

const colorStyle = computed(() => ({ 'background-color': tagEditStore.model?.color, width: '20px', height: '20px'}));
const colorPickerStyle = ref({ top: '0', left: '0' });

function clickColorBox(evt: { clientX: number, clientY: number }) {
  showColorPicker.value = true;
  colorPickerStyle.value.top = (evt.clientY + 5)+'px'
  colorPickerStyle.value.left = (evt.clientX + 5)+'px'
}

function submit() {
  tagEditStore.submit();
}

onClickOutside(colorPicker, () => showColorPicker.value = false);
const { model } = toRefs(tagEditStore);

const color = computed({
  get: () => model.value!.color,
  set: (val: any) => model.value!.color = val.hex
})

const { getError, modalTitle } = tagEditStore;
</script>

<template>
    <Modal v-model="showModal" :title="modalTitle" @submit="submit">
      <template #body>
        <div>
          <div class="flex w-32 space-x-2 mb-2 p-2 cursor-pointer rounded-md border border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" @click="clickColorBox">
            <div class="inline-block rounded" :style="colorStyle">&nbsp;</div>
            <div>{{ color }}</div>
          </div>

          <TextInput
              v-model="model.name"
              label="tags.fields.name"
              :error="getError('name')"/>
        </div>

      </template>
    </Modal>
    <div v-if="showColorPicker" ref="colorPicker" class="absolute z-50 rounded" :style="colorPickerStyle">
      <Sketch v-model="color" :disable-alpha="true" />
      <Button class="primary px-1 py-0.5 m-1 float-right" text="common.close" @click="showColorPicker = false" />
    </div>
</template>

<style scoped>
</style>
