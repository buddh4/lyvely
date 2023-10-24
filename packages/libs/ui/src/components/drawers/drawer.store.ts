import { ref } from 'vue';

const drawerStack = ref<Array<string>>([]);

function pushDrawer(id: string) {
  return drawerStack.value.push(id);
}

function popDrawer(id: string) {
  drawerStack.value = drawerStack.value.filter((mId) => mId !== id);
  return drawerStack.value.length;
}

export const useDrawerStore = () => ({
  pushDrawer,
  popDrawer,
});
