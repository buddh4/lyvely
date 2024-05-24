import { IconLibraryIF } from '@/components/icons/interfaces/icon-library.interface';

const libraries = new Map<string, IconLibraryIF>();

export function registerIconLibrary(lib: IconLibraryIF) {
  libraries.set(lib.id, lib);
}

export function getIconLibrary(id: string) {
  return libraries.get(id);
}
