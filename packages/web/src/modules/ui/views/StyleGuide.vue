<script lang="ts" setup>
import Button from '@/modules/ui/components/button/Button.vue';
import Checkbox from '@/modules/ui/components/form/Checkbox.vue';
import NumberInput from '@/modules/ui/components/form/NumberInput.vue';
import TextInput from '@/modules/ui/components/form/TextInput.vue';
import Textarea from '@/modules/ui/components/form/Textarea.vue';
import SelectInput from '@/modules/ui/components/form/SelectInput.vue';
import RangeInput from '@/modules/ui/components/form/RangeInput.vue';
import Dropdown from '@/modules/ui/components/menu/Dropdown.vue';
import DropdownLink from '@/modules/ui/components/menu/DropdownLink.vue';
import MainContainer from '@/modules/ui/components/layout/MainContainer.vue';
import { DialogType, useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';

let numberInput1 = 0,
    numberInput2=3,
    numberInput3=0,
    numberInput4 = 0,
    numberInput5 = 0,
    numberInput6 = 0,
    numberInput7 = 0,
    rangeInput1 = 0,
    rangeInput2 = 0,
    rangeInput3 = 0,
    rangeInput4 = 0,
    rangeInput5 = 0,
    textInput1 = '',
    textInput2 = '',
    textInput3 = '',
    textInput4 = '',
    textareaInput1 = '',
    textareaInput2 = '',
    textareaInput3 = '',
    textareaInput4 = '',
    selectOptions = [
      {value: 0, label: 'Option 1'},
      {value: 1, label: 'Option 2'},
      {value: 2, label: 'Option 3'},
      {value: 3, label: 'Option 4'},
    ],
    selectValue1 = 0,
    selectValue2 = 0,
    selectValue3 = 0,
    selectValue4 = 0,
    colors = ['lyvely', 'inverted', 'primary', 'secondary', 'info', 'success', 'warning', 'danger'];

function showAlert(text: string) {
  alert(text);
}

function showDialog(type: DialogType) {
  const globalDialogStore = useGlobalDialogStore();
  globalDialogStore.show(type, { title: `Title of ${type} dialog`,  message: `This is a ${type} message`});
}

function getColorBoxClass(color: string) {
  return `bg-${color} w-3.5 h-3.5 inline-block rounded-full my-2 mr-2 border border-secondary`;
}

</script>

<template>
  <MainContainer>
  <div class="prose">
    <h1>Style Guide</h1>

    <h2>Colors</h2>

    <div class="flex flex-row">
      <template v-for="color in colors" :key="color">
        <div class="flex rounded-full py-1 px-2 text-center border border-secondary-light mr-1">
          <div :class="getColorBoxClass(color)"></div>
          <small class="mt-1">{{ color }}</small>
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
      <Button class="primary">Primary</Button>{{ ' ' }}
      <Button class="secondary">Secondary</Button>{{ ' ' }}
      <Button class="info">Info</Button>{{ ' ' }}
      <Button class="success">Success</Button>{{ ' ' }}
      <Button class="warning">Warning</Button>{{ ' ' }}
      <Button class="danger">Danger</Button>{{ ' ' }}
    </p>

    <h3>Active</h3>

    <p>
      <Button class="primary" :active="true">Primary</Button>{{ ' ' }}
      <Button class="secondary" :active="true">Secondary</Button>{{ ' ' }}
      <Button class="info" :active="true">Info</Button>{{ ' ' }}
      <Button class="success" :active="true">Success</Button>{{ ' ' }}
      <Button class="warning" :active="true">Warning</Button>{{ ' ' }}
      <Button class="danger" :active="true">Danger</Button>{{ ' ' }}
    </p>

    <h3>Disabled</h3>

    <p>
      <Button class="primary" :disabled="true">Primary</Button>{{ ' ' }}
      <Button class="secondary" :disabled="true">Secondary</Button>{{ ' ' }}
      <Button class="info" :disabled="true">Info</Button>{{ ' ' }}
      <Button class="success" :disabled="true">Success</Button>{{ ' ' }}
      <Button class="warning" :disabled="true">Warning</Button>{{ ' ' }}
      <Button class="danger" :disabled="true">Danger</Button>{{ ' ' }}
    </p>

    <h3>Outline</h3>

    <p>
      <Button class="primary outlined">Primary</Button>{{ ' ' }}
      <Button class="secondary outlined">Secondary</Button>{{ ' ' }}
      <Button class="info outlined">Info</Button>{{ ' ' }}
      <Button class="success outlined">Success</Button>{{ ' ' }}
      <Button class="warning outlined">Warning</Button>{{ ' ' }}
      <Button class="danger outlined">Danger</Button>{{ ' ' }}
    </p>

    <h3>Outline Active</h3>

    <p>
      <Button class="primary" :active="true">Primary</Button>{{ ' ' }}
      <Button class="secondary" :active="true">Secondary</Button>{{ ' ' }}
      <Button class="info" :active="true">Info</Button>{{ ' ' }}
      <Button class="success" :active="true">Success</Button>{{ ' ' }}
      <Button class="warning" :active="true">Warning</Button>{{ ' ' }}
      <Button class="danger" :active="true">Danger</Button>{{ ' ' }}
    </p>

    <h2>Forms</h2>
    <h3>Checkboxes</h3>

    <div class="flex flex-col">
      <Checkbox label="Checkbox with label" />
      <Checkbox label="Disabled checked" :disabled="true" :checked="true" />
      <Checkbox label="Disabled unchecked" :disabled="true" :checked="false" />
      <Checkbox css-class="success" label="Success colored checkbox" />
    </div>

    <h3>Text Input</h3>
    <div class="flex flex-col">
      <div class="flex flex-col">
        <TextInput v-model="textInput1" label="Simple Text" wrapper-class="max-w-sm"/>
        <TextInput v-model="textInput2" label="With error" error="Error message..."/>
        <TextInput v-model="textInput3" label="Disabled" :disabled="true"/>
        <TextInput v-model="textInput4" label="Readonly" :readonly="true"/>
      </div>
    </div>

    <h3>Textarea Input</h3>
    <div class="flex flex-col">
      <div class="flex flex-col">
        <Textarea v-model="textareaInput1" label="Simple Textarea"/>
        <Textarea v-model="textareaInput2" :rows="6" label="With rows attribute" />
        <Textarea v-model="textareaInput3" label="With error" error="Some error..."/>
        <Textarea v-model="textareaInput4" label="Disabled" :disabled="true"/>
        <Textarea v-model="textareaInput4" label="Readonly" :readonly="true"/>
        <Textarea v-model="textareaInput4" label="Not resizable" css-class="resize-none"/>
      </div>
    </div>

    <h3>Number Input</h3>
    <div class="flex flex-col">
      <NumberInput v-model="numberInput1" label="Simple Input" wrapper-class="max-w-sm"/>
      <NumberInput v-model="numberInput2" :min="3" :max="6" label="With Min/Max" wrapper-class="max-w-sm"/>
      <NumberInput v-model="numberInput3" :steps="5" :min="0" label="Width steps" wrapper-class="max-w-sm"/>
      <NumberInput v-model="numberInput4" label="No slider" :slider="false" wrapper-class="max-w-sm"/>
      <NumberInput v-model="numberInput5" label="Error" error="Something went wrong?" wrapper-class="max-w-sm"/>
      <NumberInput v-model="numberInput6" label="Disabled" :disabled="true" wrapper-class="max-w-sm"/>
      <NumberInput v-model="numberInput7" label="Readonly" :readonly="true" wrapper-class="max-w-sm"/>
    </div>

    <h3>Select</h3>
    <div class="flex flex-col">
      <SelectInput v-model="selectValue1" label="Simple select" :options="selectOptions" wrapper-class="max-w-sm" />
      <SelectInput v-model="selectValue2" label="With error" error="Invalid..." :options="selectOptions" wrapper-class="max-w-sm" />
      <SelectInput v-model="selectValue3" label="Disabled"  :options="selectOptions" :disabled="true" wrapper-class="max-w-sm" />
    </div>

    <h3>Range</h3>
    <div class="flex flex-col">
      <RangeInput v-model="rangeInput1" label="Simple range" />
      <div class="text-right">{{rangeInput1}}</div>
      <RangeInput v-model="rangeInput2" :min="0" :max="5" label="Min/Max range" />
      <div class="text-right">{{rangeInput2}}</div>
      <RangeInput v-model="rangeInput3" :min="0" :max="100" :step="5" label="Steps of 5" />
      <div class="text-right">{{rangeInput3}}</div>
      <RangeInput v-model="rangeInput4" :disabled="true" :min="0" :max="100" :step="5" label="Disabled" />
      <div class="text-right">{{rangeInput4}}</div>
    </div>

    <h3>Dropdown</h3>
    <div class="clear-both mb-2">
      <Dropdown css-class="float-right">
        <DropdownLink label="Route" route="/activities" />
        <DropdownLink label="Click" @click="showAlert('Clicked!')" />
        <DropdownLink label="With icon" icon="lyvely" @click="showAlert('Clicked with Icon!')" />
      </Dropdown>
    </div>
    <div class="clear-both mb-2">
      <Dropdown css-class="float-right" label="With Label">
        <DropdownLink label="Route" route="/activities" />
        <DropdownLink label="Click" @click="showAlert('Clicked!')" />
        <DropdownLink label="With icon" icon="lyvely" @click="showAlert('Clicked with Icon!')" />
      </Dropdown>
    </div>
    <div class="clear-both mb-2">
      <Dropdown css-class="float-right" label="With Label">
        <DropdownLink label="Route" route="/activities" />
        <DropdownLink label="Click" @click="showAlert('Clicked!')" />
        <DropdownLink label="With icon" icon="lyvely" @click="showAlert('Clicked with Icon!')" />
      </Dropdown>
    </div>

    <h3>Dialog</h3>
    <Button class="info" @click="showDialog(DialogType.Info)">Info Dialog</Button>
    <Button class="danger ml-1" @click="showDialog(DialogType.Error)">Error Dialog</Button>
    <Button class="warning ml-1" @click="showDialog(DialogType.Warning)">Warning Dialog</Button>
    <Button class="success ml-1" @click="showDialog(DialogType.Success)">Success Dialog</Button>


    <br>
    <br>
    <br>
    <br>
    <br>

  </div>
  </MainContainer>
</template>

<style scoped>
h2::before {
  content: "#";
}
</style>
