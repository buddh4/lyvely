<script lang="ts" setup>
import Modal from "@/modules/ui/components/modal/Modal.vue";
import { computed, ref, Ref, toRefs } from 'vue';
import { storeToRefs } from 'pinia';
import { Sketch } from '@ckpack/vue-color'
import { onClickOutside } from '@vueuse/core'
import TextInput from "@/modules/ui/components/form/TextInput.vue";
import Button from "@/modules/ui/components/button/Button.vue";
import { useEditTagStore } from "@/modules/tag/stores/editTagStore";
import Checkbox from "@/modules/ui/components/form/Checkbox.vue";
import Textarea from "@/modules/ui/components/form/Textarea.vue";

const tagEditStore = useEditTagStore();

const showModal = computed({
  get: () => tagEditStore.isActive,
  set: (value) => !value ? tagEditStore.reset() : undefined
});

const showColorPicker = ref(false);
const colorInput = ref(null) as Ref<HTMLElement | null>;
const colorPicker = ref(null) as Ref<HTMLElement | null>;

const colorStyle = computed(() => ({'background-color': tagEditStore.model?.color, width: '20px', height: '20px'}));
const colorPickerStyle = ref({top: '0', left: '0'});


function clickColorBox(evt: { clientX: number, clientY: number }) {
  showColorPicker.value = true;
  colorPickerStyle.value.top = colorInput.value!.offsetTop + 2 + colorInput.value!.offsetHeight + 'px'
  colorPickerStyle.value.left = colorInput.value!.offsetLeft + 'px'
}

function submit() {
  tagEditStore.submit();
}

onClickOutside(colorPicker, () => showColorPicker.value = false);
const {model} = toRefs(tagEditStore);

const color = computed({
  get: () => model.value!.color,
  set: (val: any) => model.value!.color = val.hex
})

const { modalTitle} = tagEditStore;
const { validator } = storeToRefs(tagEditStore);
</script>

<template>
  <Modal v-model="showModal" :title="modalTitle" @submit="submit">
      <div>
        <div
          ref="colorInput"
          class="flex w-32 space-x-2 mb-2 p-2 cursor-pointer rounded-md border border-divide shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          @click="clickColorBox">
          <div class="inline-block rounded" :style="colorStyle">&nbsp;</div>
          <div>{{ color }}</div>
        </div>

        <TextInput
            v-model="model.name"
            label="tags.fields.name"
            :error="validator.getError('name')"/>

        <Textarea
            v-model="model.description"
            label="tags.fields.description"
            :error="validator.getError('description')"/>

        <Checkbox
          v-model="model.includeOnFilter"
          label="tags.fields.includeOnFilter"
          help-text="tags.help.includeOnFilter" />
      </div>

      <div v-if="showColorPicker"  ref="colorPicker" class="absolute z-50 rounded bg-highlight" :style="colorPickerStyle">
        <Sketch v-model="color" :disable-alpha="true"/>
        <Button class="primary px-1 py-0.5 m-1 float-right" text="common.close" @click="showColorPicker = false"/>
      </div>

  </Modal>
</template>

<style scoped>
</style>
