<script lang="ts" setup>
import { ref } from "vue";
import MainContainer from "@/modules/ui/components/layout/MainContainer.vue";
import {
  DialogType,
  useGlobalDialogStore,
} from "@/modules/core/store/global.dialog.store";

let numberInput1 = 0,
  numberInput2 = 3,
  numberInput3 = 0,
  numberInput4 = 0,
  numberInput5 = 0,
  numberInput6 = 0,
  numberInput7 = 0,
  rangeInput1 = 0,
  rangeInput2 = 0,
  rangeInput3 = 0,
  rangeInput4 = 0,
  textInput1 = "",
  textInput2 = "",
  textInput3 = "",
  textInput4 = "",
  textareaInput1 = "",
  textareaInput2 = "",
  textareaInput3 = "",
  textareaInput4 = "",
  selectOptions = [
    { value: 0, label: "Option 1" },
    { value: 1, label: "Option 2" },
    { value: 2, label: "Option 3" },
    { value: 3, label: "Option 4" },
  ],
  selectValue1 = 0,
  selectValue2 = 0,
  selectValue3 = 0,
  colors = [
    "bg-pop",
    "bg-lyvely",
    "bg-primary",
    "bg-secondary",
    "bg-info",
    "bg-success",
    "bg-warning",
    "bg-danger",
  ];

function showAlert(text: string) {
  alert(text);
}

function showDialog(type: DialogType) {
  const globalDialogStore = useGlobalDialogStore();
  globalDialogStore.show(type, {
    title: `Title of ${type} dialog`,
    message: `This is a ${type} message`,
  });
}

function getColorBoxClass(color: string) {
  return `${color} w-3.5 h-3.5 inline-block rounded-full my-2 mr-2 border border-secondary`;
}

const checkboxTrue = ref(true);
const radioValue = ref("1");
const radioValue2 = ref("2");
</script>

<template>
  <div class="flex items-center justify-center">
  <main-container class="bg-main">
    <div class="prose dark:prose-invert">
      <h1>Style Guide</h1>

      <h2>Colors</h2>

      <div class="flex flex-row">
        <template v-for="color in colors" :key="color">
          <div
            class="flex rounded-full py-1 px-2 text-center border border-secondary-light mr-1"
          >
            <div :class="getColorBoxClass(color)"></div>
            <small class="mt-1">{{ color.split("-")[1] }}</small>
          </div>
        </template>
      </div>

      <h2>Headlines</h2>
      <h1>h1</h1>
      <h2>h2</h2>
      <h3>h3</h3>
      <h4>h4</h4>
      <h5>h5</h5>
      <h6>h6</h6>

      <h2>Buttons</h2>

      <h3>Normal</h3>

      <p>
        <ly-button class="primary">Primary</ly-button>
        {{ " " }}
        <ly-button class="secondary">Secondary</ly-button>
        {{ " " }}
        <ly-button class="info">Info</ly-button>
        {{ " " }}
        <ly-button class="success">Success</ly-button>
        {{ " " }}
        <ly-button class="warning">Warning</ly-button>
        {{ " " }}
        <ly-button class="danger">Danger</ly-button>
        {{ " " }}
        <ly-button class="danger" :loading="true">Danger</ly-button>
      </p>

      <h3>Active</h3>

      <p>
        <ly-button class="primary" :active="true">Primary</ly-button>
        {{ " " }}
        <ly-button class="secondary" :active="true">Secondary</ly-button>
        {{ " " }}
        <ly-button class="info" :active="true">Info</ly-button>
        {{ " " }}
        <ly-button class="success" :active="true">Success</ly-button>
        {{ " " }}
        <ly-button class="warning" :active="true">Warning</ly-button>
        {{ " " }}
        <ly-button class="danger" :active="true">Danger</ly-button>
        {{ " " }}
      </p>

      <h3>Disabled</h3>

      <p>
        <ly-button class="primary" :disabled="true">Primary</ly-button>
        {{ " " }}
        <ly-button class="secondary" :disabled="true">Secondary</ly-button>
        {{ " " }}
        <ly-button class="info" :disabled="true">Info</ly-button>
        {{ " " }}
        <ly-button class="success" :disabled="true">Success</ly-button>
        {{ " " }}
        <ly-button class="warning" :disabled="true">Warning</ly-button>
        {{ " " }}
        <ly-button class="danger" :disabled="true">Danger</ly-button>
        {{ " " }}
      </p>

      <h3>Outline</h3>

      <p>
        <ly-button class="primary outlined">Primary</ly-button>
        {{ " " }}
        <ly-button class="secondary outlined">Secondary</ly-button>
        {{ " " }}
        <ly-button class="info outlined">Info</ly-button>
        {{ " " }}
        <ly-button class="success outlined">Success</ly-button>
        {{ " " }}
        <ly-button class="warning outlined">Warning</ly-button>
        {{ " " }}
        <ly-button class="danger outlined">Danger</ly-button>
        {{ " " }}
      </p>

      <h3>Outline Active</h3>

      <p>
        <ly-button class="primary" :active="true">Primary</ly-button>
        {{ " " }}
        <ly-button class="secondary" :active="true">Secondary</ly-button>
        {{ " " }}
        <ly-button class="info" :active="true">Info</ly-button>
        {{ " " }}
        <ly-button class="success" :active="true">Success</ly-button>
        {{ " " }}
        <ly-button class="warning" :active="true">Warning</ly-button>
        {{ " " }}
        <ly-button class="danger" :active="true">Danger</ly-button>
        {{ " " }}
      </p>

      <h3>Loading</h3>

      <p>
        <ly-button class="primary" :loading="true">Primary</ly-button>
        {{ " " }}
        <ly-button class="secondary" :loading="true">Secondary</ly-button>
        {{ " " }}
        <ly-button class="info" :loading="true">Info</ly-button>
        {{ " " }}
        <ly-button class="success" :loading="true">Success</ly-button>
        {{ " " }}
        <ly-button class="warning" :loading="true">Warning</ly-button>
        {{ " " }}
        <ly-button class="danger" :loading="true">Danger</ly-button>
        {{ " " }}
      </p>

      <h2>Forms</h2>

      <h3>Checkboxes</h3>
      <div class="flex flex-col">
        <ly-input-checkbox label="Checkbox with label" />
        <ly-input-checkbox
          v-model="checkboxTrue"
          label="Disabled checked"
          :disabled="true"
        />
        <ly-input-checkbox
          label="Disabled unchecked"
          :disabled="true"
          :checked="false"
        />
        <ly-input-checkbox
          css-class="success"
          label="Success colored checkbox"
        />
      </div>

      <h3>Radio</h3>
      <div class="flex flex-col">
        <ly-input-radio v-model="radioValue" value="1" label="Checked" />
        <ly-input-radio v-model="radioValue" value="2" label="Unchecked" />
        <ly-input-radio
          v-model="radioValue"
          value="1"
          label="Disabled checked"
          :disabled="true"
        />
        <ly-input-radio
          v-model="radioValue2"
          value="1"
          label="Disabled unchecked"
          :disabled="true"
        />
        <ly-input-radio
          v-model="radioValue2"
          value="2"
          css-class="success"
          label="Success colored checkbox"
        />
      </div>

      <h3>Text Input</h3>
      <div class="flex flex-col">
        <div class="flex flex-col">
          <ly-input-text
            v-model="textInput1"
            label="Simple Text"
            wrapper-class="max-w-sm"
          />
          <ly-input-text
            v-model="textInput2"
            label="With error"
            error="Error message..."
          />
          <ly-input-text
            v-model="textInput3"
            label="Disabled"
            :disabled="true"
          />
          <ly-input-text
            v-model="textInput4"
            label="Readonly"
            :readonly="true"
          />
        </div>
      </div>

      <h3>Textarea Input</h3>
      <div class="flex flex-col">
        <div class="flex flex-col">
          <ly-input-textarea v-model="textareaInput1" label="Simple Textarea" />
          <ly-input-textarea
            v-model="textareaInput2"
            :rows="6"
            label="With rows attribute"
          />
          <ly-input-textarea
            v-model="textareaInput3"
            label="With error"
            error="Some error..."
          />
          <ly-input-textarea
            v-model="textareaInput4"
            label="Disabled"
            :disabled="true"
          />
          <ly-input-textarea
            v-model="textareaInput4"
            label="Readonly"
            :readonly="true"
          />
          <ly-input-textarea
            v-model="textareaInput4"
            label="Not resizable"
            css-class="resize-none"
          />
        </div>
      </div>

      <h3>Number Input</h3>
      <div class="flex flex-col">
        <ly-input-number
          v-model="numberInput1"
          label="Simple Input"
          wrapper-class="max-w-sm"
        />
        <ly-input-number
          v-model="numberInput2"
          :min="3"
          :max="6"
          label="With Min/Max"
          wrapper-class="max-w-sm"
        />
        <ly-input-number
          v-model="numberInput3"
          :steps="5"
          :min="0"
          label="Width steps"
          wrapper-class="max-w-sm"
        />
        <ly-input-number
          v-model="numberInput4"
          label="No slider"
          :slider="false"
          wrapper-class="max-w-sm"
        />
        <ly-input-number
          v-model="numberInput5"
          label="Error"
          error="Something went wrong?"
          wrapper-class="max-w-sm"
        />
        <ly-input-number
          v-model="numberInput6"
          label="Disabled"
          :disabled="true"
          wrapper-class="max-w-sm"
        />
        <ly-input-number
          v-model="numberInput7"
          label="Readonly"
          :readonly="true"
          wrapper-class="max-w-sm"
        />
      </div>

      <h3>Select</h3>
      <div class="flex flex-col">
        <ly-input-select
          v-model="selectValue1"
          label="Simple select"
          :options="selectOptions"
          wrapper-class="max-w-sm"
        />
        <ly-input-select
          v-model="selectValue2"
          label="With error"
          error="Invalid..."
          :options="selectOptions"
          wrapper-class="max-w-sm"
        />
        <ly-input-select
          v-model="selectValue3"
          label="Disabled"
          :options="selectOptions"
          :disabled="true"
          wrapper-class="max-w-sm"
        />
      </div>

      <h3>Range</h3>
      <div class="flex flex-col">
        <ly-input-range v-model="rangeInput1" label="Simple range" />
        <div class="text-right">{{ rangeInput1 }}</div>
        <ly-input-range
          v-model="rangeInput2"
          :min="0"
          :max="5"
          label="Min/Max range"
        />
        <div class="text-right">{{ rangeInput2 }}</div>
        <ly-input-range
          v-model="rangeInput3"
          :min="0"
          :max="100"
          :step="5"
          label="Steps of 5"
        />
        <div class="text-right">{{ rangeInput3 }}</div>
        <ly-input-range
          v-model="rangeInput4"
          :disabled="true"
          :min="0"
          :max="100"
          :step="5"
          label="Disabled"
        />
        <div class="text-right">{{ rangeInput4 }}</div>
      </div>

      <h3>Dropdown</h3>
      <div class="clear-both mb-2">
        <ly-dropdown css-class="float-right">
          <ly-dropdownLink label="Route" route="/activities" />
          <ly-dropdownLink label="Click" @click="showAlert('Clicked!')" />
          <ly-dropdownLink
            label="With icon"
            icon="lyvely"
            @click="showAlert('Clicked with Icon!')"
          />
        </ly-dropdown>
      </div>
      <div class="clear-both mb-2">
        <ly-dropdown css-class="float-right" label="With Label">
          <ly-dropdownLink label="Route" route="/activities" />
          <ly-dropdownLink label="Click" @click="showAlert('Clicked!')" />
          <ly-dropdownLink
            label="With icon"
            icon="lyvely"
            @click="showAlert('Clicked with Icon!')"
          />
        </ly-dropdown>
      </div>
      <div class="clear-both mb-2">
        <ly-dropdown css-class="float-right" label="With Label">
          <ly-dropdownLink label="Route" route="/activities" />
          <ly-dropdownLink label="Click" @click="showAlert('Clicked!')" />
          <ly-dropdownLink
            label="With icon"
            icon="lyvely"
            @click="showAlert('Clicked with Icon!')"
          />
        </ly-dropdown>
      </div>

      <h3>Dialog</h3>
      <ly-button class="info" @click="showDialog(DialogType.Info)">
        Info Dialog
      </ly-button>
      <ly-button class="danger ml-1" @click="showDialog(DialogType.Error)">
        Error Dialog
      </ly-button>
      <ly-button class="warning ml-1" @click="showDialog(DialogType.Warning)">
        Warning Dialog
      </ly-button>
      <ly-button class="success ml-1" @click="showDialog(DialogType.Success)">
        Success Dialog
      </ly-button>

      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  </main-container>
  </div>
</template>

<style scoped>
h2::before {
  content: "#";
}
</style>
