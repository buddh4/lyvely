<script lang="ts" setup>
import { HTMLAttributes, computed, onMounted, ref, toRefs, watch } from 'vue';

export interface IProps {
  modelValue: string;
  secureLength?: number;
  cssClass?: HTMLAttributes['class'];
  userInputs?: Array<string>;
}

const props = withDefaults(defineProps<IProps>(), {
  secureLength: 7,
  cssClass: '',
  userInputs: () => [],
});

const emit = defineEmits([
  'input',
  'blur',
  'focus',
  'score',
  'hide',
  'show',
  'update:modelValue',
  'feedback',
]);

const password = ref<string | null>(null);
let zxcvbn: (pw: string, inputs?: string[]) => any;

onMounted(async () => {
  const zxcvbnModule = (await import('zxcvbn')) as {
    default: (pw: string, inputs?: string[]) => any;
  };
  zxcvbn = zxcvbnModule.default;
});

const passwordStrength = computed(() =>
  password.value
    ? zxcvbn(password.value!, props.userInputs.length >= 1 ? props.userInputs : undefined).score
    : null,
);

const { modelValue } = toRefs(props);

watch(modelValue, (newValue) => {
  emit('update:modelValue', newValue);
  password.value = newValue;
  emit('feedback', zxcvbn(newValue).feedback);
});
</script>

<template>
  <div class="Password">
    <div :class="['Password__strength-meter', cssClass]">
      <div class="Password__strength-meter--fill" :data-score="passwordStrength"></div>
    </div>
  </div>
</template>

<style lang="scss">
[v-cloak] {
  display: none;
}

.Password {
  max-width: 400px;
  margin: 0 auto;
}

.Password__group {
  position: relative;
}

.Password__strength-meter {
  position: relative;
  height: 3px;
  background: #ddd;
  border-radius: 3px;
}

.Password__strength-meter:before,
.Password__strength-meter:after {
  content: '';
  height: inherit;
  background: transparent;
  display: block;
  border-color: #fff;
  border-style: solid;
  border-width: 0 5px 0 5px;
  position: absolute;
  width: 20%;
  z-index: 10;
}

.Password__strength-meter:before {
  left: 20%;
}

.Password__strength-meter:after {
  right: 20%;
}

.Password__strength-meter--fill {
  background: transparent;
  height: inherit;
  position: absolute;
  width: 0;
  border-radius: inherit;
  transition:
    width 0.5s ease-in-out,
    background 0.25s;
}

.Password__strength-meter--fill[data-score='0'] {
  background: darkred;
  width: 20%;
}

.Password__strength-meter--fill[data-score='1'] {
  background: orangered;
  width: 40%;
}

.Password__strength-meter--fill[data-score='2'] {
  background: orange;
  width: 60%;
}

.Password__strength-meter--fill[data-score='3'] {
  background: yellowgreen;
  width: 80%;
}

.Password__strength-meter--fill[data-score='4'] {
  background: green;
  width: 100%;
}

.Password__field {
  background-color: #f1f1f1;
  border: 1px solid #f1f1f1;
  border-radius: 2px;
  box-sizing: border-box;
  font-size: 14px;
  padding: 13px;
  width: 100%;
}

.Password__field--disabled {
  background-color: #f6f6f6;
  border: 1px solid #f6f6f6;
}

.Password__icons {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.Password__toggle {
  line-height: 1.1;
  margin-right: 13px;
}

.Password__badge {
  position: relative;
  color: white;
  border-radius: 6px;
  padding: 3px;
  width: 30px;
  height: 15px;
  font-size: 14px;
  line-height: 1.1;
  margin-right: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.Password__badge--error {
  background: red;
}

.Password__badge--success {
  background: #1bbf1b;
}

.btn-clean {
  appearance: none;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  color: #777777;
  padding: 0;

  svg {
    fill: currentColor;
  }

  &:hover,
  &:focus {
    color: #404b69;
  }
}
</style>
