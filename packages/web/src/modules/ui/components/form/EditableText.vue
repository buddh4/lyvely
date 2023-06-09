<template>
  <div class="cursor-pointer">
    <div v-if="!isEdit" class="flex gap-2 justify-between" @click="edit">
      <div class="flex-grow">
        <template v-if="inputValue?.length">
          {{ inputValue }}
        </template>
        <template v-else-if="placeholder?.length">
          <span class="text-dimmed">{{ placeholder }}</span>
        </template>
      </div>
      <div class="flex flex-col justify-end">
        <a class="text-secondary text-xs">{{ $t('common.edit') }}</a>
      </div>
    </div>
    <div v-else class="flex flex-col gap-1">
      <div class="flex-grow">
        <textarea
          :id="inputId"
          ref="input"
          v-model="editValue"
          :placeholder="placeholder"
          :aria-describedby="ariaDescribedby"
          :rows="rows"
          :disabled="disabled"
          :readonly="readonly"
          :class="inputClass"
          :maxlength="maxlength"
          @keydown.ctrl="save"></textarea>
      </div>
      <div class="flex gap-1 justify-end">
        <ly-button class="secondary text-xs" @click="cancel">{{ $t('common.cancel') }}</ly-button>
        <ly-button class="primary text-xs" @click="submit">{{ $t('common.submit') }}</ly-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  IBaseInputProps,
  useBaseInputProps,
  useBaseInputSetup,
} from '@/modules/ui/components/form/BaseInput';
import { ref, SetupContext } from 'vue';

// TODO (accessibility): Make this component accessible!

export default {
  props: {
    ...useBaseInputProps(),
    maxlength: { type: Number, default: undefined },
    rows: { rows: Number, default: undefined },
  },
  emits: ['change', 'update:modelValue'],
  setup(props: IBaseInputProps, context: SetupContext) {
    return {
      isEdit: ref(false),
      editValue: ref(''),
      ...useBaseInputSetup<string>(props, context),
    };
  },
  mounted() {
    if (this.autofocus) this.$refs.input.focus();
  },
  methods: {
    edit() {
      this.isEdit = true;
      this.editValue = this.modelValue;
      setTimeout(() => {
        this.$refs.input.focus();
      });
    },
    save(evt: KeyboardEvent) {
      if (evt.key === 's') {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        this.submit();
      }
    },
    submit() {
      this.inputValue = this.editValue;
      this.isEdit = false;
    },
    cancel() {
      this.isEdit = false;
    },
  },
};
</script>

<style scoped></style>
