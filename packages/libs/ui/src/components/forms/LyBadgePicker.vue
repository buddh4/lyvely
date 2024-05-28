<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import LyFloatingInputLayout from './LyFloatingInputLayout.vue';
import { escapeRegExp, isArray, uniqueId } from 'lodash';
import { t, Translatable } from '@/i18n';
import LyModal from '@/components/dialogs/LyModal.vue';
import LyTextField from '@/components/forms/LyTextField.vue';
import LyBadge from '@/components/badges/LyBadge.vue';
import LyButton from '@/components/buttons/LyButton.vue';
import { getOwnNonNullableProperty } from '@lyvely/common';
import { AvatarData } from '@/interfaces';

type IPickerConfig = {
  key: string;
  value?: any;
  label?: string;
  color?: string;
  avatar?: AvatarData;
};
export type IPickerOptions = IPickerConfig | string;

export interface IProps {
  id?: string;
  modelValue: Array<string>;
  options: Array<IPickerOptions>;
  labels?: Record<string, string> | ((key: string) => string);
  add: boolean;
  multiple?: boolean;
  addTextKey?: string;
  label: Translatable;
}

const props = withDefaults(defineProps<IProps>(), {
  id: uniqueId('tag-picker'),
  labels: undefined,
  add: false,
  multiple: true,
  addTextKey: 'common.add_option',
});

const emit = defineEmits(['update:modelValue', 'update:visible']);

const query = ref('');
const visible = ref(false);
const picker = ref<HTMLElement>();

watch(visible, () => (query.value = ''));

const optionsToAdd = computed(
  () =>
    props.options.filter(
      (option: any) => !isSelected(getOptionKey(option)) && filterOption(option),
    ) || [],
);

function getOptionKey(option: IPickerOptions): string {
  return typeof option === 'string' ? option : option.key;
}

function getLabel(option: IPickerOptions): string {
  let result;

  const key = getOptionKey(option);

  if (typeof props.labels === 'function') {
    result = props.labels(key);
  } else if (props.labels) {
    result = props.labels[key];
  }

  if (typeof option !== 'object') return option;
  if (!result && option.label) result = option.label;
  if (!result && typeof option.value === 'string') result = option.value;
  if (!result) result = option.key;
  return result;
}

function filterOption(option?: IPickerOptions) {
  return (
    option && (!query.value || getLabel(option).match(new RegExp(escapeRegExp(query.value), 'i')))
  );
}

function getOption(key: string): IPickerOptions | undefined {
  return props.options.find((option: any) => getOptionKey(option) === key) || key;
}
const model = computed(() => (isArray(props.modelValue) ? props.modelValue : []));
const selection = computed(() => model.value.map(getOption));

const selectedOptions = computed(
  () =>
    model.value.map((key: string) => getOption(key)).filter(filterOption) as Array<IPickerOptions>,
);

function addSelection(option: IPickerOptions) {
  if (isSelected(option)) return;
  query.value = '';
  const newValue = props.multiple ? [...model.value, getOptionKey(option)] : [getOptionKey(option)];
  emit('update:modelValue', newValue);
  focusOption(option);
}

function removeSelection(option: IPickerOptions) {
  query.value = '';
  emit(
    'update:modelValue',
    model.value.filter((key: any) => getOptionKey(option) !== key),
  );
  focusOption(option);
}

function focusOption(option: IPickerOptions) {
  const optionKey = getOptionKey(option);
  nextTick(() => {
    const entry = picker.value?.querySelector(
      `[data-badge-selection="${optionKey}"]`,
    ) as HTMLElement;
    if (entry) entry.focus();
  });
}

function isSelected(option: IPickerOptions) {
  return model.value.includes(getOptionKey(option));
}

function isExistingOption(key: string) {
  return !!optionsToAdd.value.find((option: IPickerOptions) => getOptionKey(option) === key);
}

function focusFirst() {
  const entry = picker.value?.querySelector('[data-badge-selection]') as HTMLElement;
  if (entry) entry.focus();
}

function focusNext(evt: KeyboardEvent) {
  if (evt.target instanceof HTMLElement) {
    const next = evt.target.nextElementSibling as HTMLElement;
    if (next) next.focus();
    else document.querySelector<HTMLElement>('#badge-picker-search')?.focus();
  }
}

function focusPrev(evt: KeyboardEvent) {
  if (evt.target instanceof HTMLElement) {
    const prev = evt.target.previousElementSibling as HTMLElement;
    if (prev) prev.focus();
    else document.querySelector<HTMLElement>('#badge-picker-search')?.focus();
  }
}

const entryClass =
  'flex items-center gap-2 border-divide bg-main p-2 md:p-4 cursor-pointer p-2 md:p-4 focus:outline-none hover:bg-highlight focus:bg-highlight';

function getBadgeClass(option: IPickerOptions) {
  return [
    'mr-0.5 border',
    { 'border-transparent': !!getColor(option) },
    { 'bg-primary': !getColor(option) },
    { 'border-divide': !getColor(option) },
  ];
}

function getColor(options: IPickerOptions) {
  return getOwnNonNullableProperty<IPickerConfig>(options, 'color');
}

function getAvatar(options: IPickerOptions) {
  return getOwnNonNullableProperty<IPickerConfig>(options, 'avatar');
}

const showAddEntry = computed(
  () => props.add && query.value.length && !isExistingOption(query.value),
);
const showEmptyEntry = computed(() => !showAddEntry.value && !props.options.length);
</script>

<template>
  <ly-floating-input-layout
    :id="id"
    :data-id="id"
    tabindex="0"
    class="floating-input h-auto cursor-pointer"
    :label="label"
    @click="visible = true"
    @keyup.enter.prevent="visible = true">
    <div class="flex pt-2">
      <template v-for="option in selection" :key="getOptionKey(option!)">
        <ly-badge
          v-if="option"
          :text="{ plain: getLabel(option) }"
          :color="getColor(option)"
          :class="getBadgeClass(option)"
          :avatar="getAvatar(option)" />
      </template>
    </div>
  </ly-floating-input-layout>
  <ly-modal
    v-model="visible"
    :data-id="id + '-modal'"
    :title="label"
    :cancel-button="false"
    submit-button-text="common.select"
    submit-icon="check"
    @submit="visible = false">
    <div ref="picker" class="flex max-h-full flex-col">
      <div class="mb-2">
        <ly-text-field
          :id="id + '-search'"
          v-model="query"
          :data-id="id + '-search'"
          :autofocus="true"
          :placeholder="t('common.filter.search')"
          @keyup.down="focusFirst" />
      </div>

      <div
        class="scrollbar-thin flex flex-col divide-y overflow-auto rounded border border-divide md:max-h-96">
        <div
          v-for="option in selectedOptions"
          :key="getOptionKey(option)"
          :data-id="id + '-' + getOptionKey(option)"
          :data-badge-selection="getOptionKey(option)"
          :class="entryClass"
          tabindex="0"
          @click="removeSelection(option)"
          @keyup.enter.prevent.stop="removeSelection(option)"
          @keyup.down="focusNext"
          @keyup.up="focusPrev">
          <ly-button
            tabindex="-1"
            aria-hidden="true"
            class="flex h-5 w-5 items-center justify-center rounded-full border border-divide bg-main px-0 py-0 text-sm"
            ><span class="text-xs text-primary">x</span></ly-button
          >
          <ly-badge
            :text="{ plain: getLabel(option) }"
            :color="getColor(option)"
            :class="getBadgeClass(option)"
            :avatar="getAvatar(option)" />
        </div>

        <div
          v-for="option in optionsToAdd"
          :key="getOptionKey(option)"
          :data-badge-selection="getOptionKey(option)"
          :class="entryClass"
          tabindex="0"
          @click="addSelection(option)"
          @keyup.enter.prevent.stop="addSelection(option)"
          @keyup.down="focusNext"
          @keyup.up="focusPrev">
          <ly-badge
            :text="{ plain: getLabel(option) }"
            :color="getColor(option)"
            :class="getBadgeClass(option)"
            :avatar="getAvatar(option)" />
        </div>
        <div
          v-if="showAddEntry"
          data-badge-selection
          :class="[entryClass]"
          tabindex="0"
          @click="addSelection(query)"
          @keyup.enter.prevent.stop="addSelection(query)"
          @keyup.down="focusNext"
          @keyup.up="focusPrev">
          <i18n-t :keypath="addTextKey" tag="span" class="text-center text-sm text-dimmed">
            <template #option>
              <b>{{ query }}</b>
            </template>
          </i18n-t>
        </div>
        <div
          v-if="showEmptyEntry"
          data-badge-selection
          class="flex items-center gap-2 border-divide bg-main p-2 md:p-4">
          <span v-if="query">{{ t('common.empty_result_filter') }}</span>
          <span v-else>{{ t('common.empty_result') }}</span>
        </div>
      </div>
    </div>
  </ly-modal>
</template>

<style scoped>
[data-badge-selection]:last-of-type {
  @apply rounded-b;
}
</style>
