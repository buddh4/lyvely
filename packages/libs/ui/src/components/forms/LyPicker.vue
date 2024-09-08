<script lang="ts" setup generic="TPickerOption extends IPickerOption = IPickerOption">
import { computed, nextTick, type Ref, ref, watch } from 'vue';
import LyFloatingInputLayout from './LyFloatingInputLayout.vue';
import { escapeRegExp, uniqueId } from '@lyvely/common';
import { t, Translatable } from '@/i18n';
import LyModal from '@/components/dialogs/LyModal.vue';
import LyTextField from '@/components/forms/LyTextField.vue';
import LyBadge from '@/components/badges/LyBadge.vue';
import LyButton from '@/components/buttons/LyButton.vue';
import { IPickerOption } from './picker-option.interface';
import { escapeSelector } from '@/helpers';

/**
 * Used to fetch provider options. If no search argument is given the provider should return the initial value,
 * this always must include the modelValue options.
 */
type PickerOptionProvider =
  | ((search?: string) => Promise<TPickerOption[]> | TPickerOption[])
  | TPickerOption[];

type PickerSelection = TPickerOption | string;

const props = withDefaults(
  defineProps<{
    /** The id of the picker, if not provided a unique picker id is generated. **/
    id?: string;
    /** The modelValue to be populated. **/
    modelValue: Array<string>;
    /** The provider is used to fetch options. **/
    provider: PickerOptionProvider;
    /** The label used for the input as well as modal. **/
    label: Translatable;
    /** Sets the max allowed values. (default = 50). **/
    max?: number;
    /** Enable adding new options. **/
    add?: boolean;
    /** The text used for adding new items. **/
    addTextKey?: string;
  }>(),
  {
    id: uniqueId('tag-picker'),
    add: false,
    max: 100,
    addTextKey: 'common.add_option',
  }
);

const emit = defineEmits(['update:modelValue', 'update:visible']);

// The search query.
const query = ref<string | undefined>(undefined);
// Includes all currently available options.
const loadedOptions = ref<Map<string, TPickerOption>>(new Map()) as Ref<Map<string, TPickerOption>>;
// Determines whether the initial option were already loaded.
let initialOptionsLoaded = false;
let initialOptions: TPickerOption[] = [];
// Determines whether the picker modal is visible.
const visible = ref(false);
// The picker root
const picker = ref<HTMLElement>();
// Picker options available
const unselectedOptions = ref([]) as Ref<TPickerOption[]>;

async function resolveProviderQuery(query?: string): Promise<TPickerOption[]> {
  let result: TPickerOption[];
  if (Array.isArray(props.provider)) {
    result = !query?.length
      ? props.provider
      : props.provider.filter((option: TPickerOption) =>
          option.label.match(new RegExp(escapeRegExp(query), 'i'))
        );
  } else if (!query?.length && !initialOptionsLoaded) {
    initialOptions = result = await Promise.resolve(props.provider(query));
    initialOptionsLoaded = true;
  } else if (query?.length) {
    result = await Promise.resolve(props.provider(query));
  } else {
    return initialOptions;
  }

  result.forEach((option: TPickerOption) => loadedOptions.value.set(option.key, option));
  return result;
}

async function updateUnselectedOptions() {
  const queryResult = await resolveProviderQuery(query.value);
  unselectedOptions.value = queryResult.filter(isUnSelected);
}

watch(visible, resetQuery);
watch(query, updateUnselectedOptions, { immediate: true });

function getOption(key: string): PickerSelection | undefined {
  return loadedOptions.value.get(key) || key;
}

const selectedOptions = computed(
  () =>
    props.modelValue.map((key: string) => getOption(key)).filter(filterOption) as PickerSelection[]
);

function getKey(selection: PickerSelection) {
  return typeof selection === 'string' ? selection : selection.key;
}

function getLabel(selection: PickerSelection) {
  return typeof selection === 'string' ? selection : selection.label;
}

function getDescription(selection: PickerSelection) {
  if (typeof selection === 'string') return undefined;
  return selection.description ? { plain: selection.description } : undefined;
}

function getColor(options: PickerSelection) {
  return typeof options === 'string' ? undefined : options.color;
}

function getAvatar(options: PickerSelection) {
  return typeof options === 'string' ? undefined : options.avatar;
}

function getIcon(options: PickerSelection) {
  return typeof options === 'string' ? undefined : options.icon;
}

function getIconBindings(options: PickerSelection) {
  return typeof options === 'string' ? undefined : options.iconBindings;
}

function filterOption(option?: PickerSelection): boolean {
  if (!option) return false;
  if (!query.value?.length) return true;
  return new RegExp(escapeRegExp(query.value), 'i').test(getLabel(option));
}

function resetQuery() {
  query.value = undefined;
}

function addSelectedOption(option?: PickerSelection) {
  if (!option || isSelected(option)) return;
  resetQuery();
  const key = getKey(option);
  const newValue = props.max === 1 ? [key] : [...props.modelValue, key];
  newValue.splice(0, newValue.length - props.max);
  emit('update:modelValue', newValue);
  updateUnselectedOptions();
  focusOption(option);
}

function removeSelection(option: PickerSelection) {
  resetQuery();
  emit(
    'update:modelValue',
    props.modelValue.filter((key: any) => getKey(option) !== key)
  );
  updateUnselectedOptions();
  focusOption(option);
}

function focusOption(option: PickerSelection) {
  nextTick(() => {
    const entry = picker.value?.querySelector(
      `[data-badge-selection="${escapeSelector(getKey(option))}"]`
    ) as HTMLElement;
    if (entry) entry.focus();
  });
}

function isSelected(option: PickerSelection) {
  return props.modelValue.includes(getKey(option));
}

function isUnSelected(option: PickerSelection) {
  return !isSelected(option);
}

function isExistingOption(key: string) {
  return !!loadedOptions.value.get(key);
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

function getBadgeClass(option: PickerSelection) {
  const color = getColor(option);
  return [
    'mr-0.5 border',
    { 'border-transparent': !!color },
    { 'bg-primary border-divide': !color },
  ];
}

const showAddEntry = computed(
  () => props.add && query.value?.length && !isExistingOption(query.value)
);
const showEmptyEntry = computed(() => !showAddEntry.value && !loadedOptions.value.size);
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
      <template v-for="option in selectedOptions" :key="getKey(option)">
        <ly-badge
          v-if="option"
          :text="{ plain: getLabel(option) }"
          :description="getDescription(option)"
          :color="getColor(option)"
          :class="getBadgeClass(option)"
          :avatar="getAvatar(option)"
          :icon="getIcon(option)"
          :icon-bindings="getIconBindings(option)" />
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
          :key="getKey(option)"
          :data-id="id + '-' + getKey(option)"
          :data-badge-selection="getKey(option)"
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
          <slot name="selection">
            <ly-badge
              :text="{ plain: getLabel(option) }"
              :description="getDescription(option)"
              :color="getColor(option)"
              :class="getBadgeClass(option)"
              :avatar="getAvatar(option)"
              :icon="getIcon(option)"
              :icon-bindings="getIconBindings(option)" />
          </slot>
        </div>

        <div
          v-for="option in unselectedOptions"
          :key="getKey(option)"
          :data-badge-selection="getKey(option)"
          :class="entryClass"
          tabindex="0"
          @click="addSelectedOption(option)"
          @keyup.enter.prevent.stop="addSelectedOption(option)"
          @keyup.down="focusNext"
          @keyup.up="focusPrev">
          <slot name="option">
            <ly-badge
              :text="{ plain: getLabel(option) }"
              :description="getDescription(option)"
              :color="getColor(option)"
              :class="getBadgeClass(option)"
              :avatar="getAvatar(option)"
              :icon="getIcon(option)"
              :icon-bindings="getIconBindings(option)" />
          </slot>
        </div>
        <div
          v-if="showAddEntry"
          data-badge-selection
          :class="[entryClass]"
          tabindex="0"
          @click="addSelectedOption(query)"
          @keyup.enter.prevent.stop="addSelectedOption(query)"
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
