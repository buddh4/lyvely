import { DelegateEmitter } from "@/util/emitter";

export enum Scope {
  Locale = "localStorage",
  Session = "sessionStorage",
}

type StorageValueEvents = {
  update: string | undefined;
};

class StoredValue extends DelegateEmitter<StorageValueEvents> {
  private readonly storage: StorageWrapper;
  readonly key: string;
  private cache?: string;

  constructor(storage: StorageWrapper, key: string) {
    super();
    this.storage = storage;
    this.key = key;
    this.storage.on("update", (update) => {
      if (update.key === this.key) {
        this.emit("update", update.value);
      }
    });
  }

  getValue() {
    if (!this.storage.isAvailable()) {
      return this.cache;
    }
    return this.storage.get(this.key);
  }

  setValue(value?: string) {
    if (value === undefined) {
      this.removeFromStorage();
      return;
    }

    if (!this.storage.isAvailable()) {
      this.cache = value;
    }
    return this.storage.set(this.key, value);
  }

  removeFromStorage() {
    this.cache = undefined;
    return this.storage.remove(this.key);
  }

  toString() {
    return this.getValue();
  }
}

type StorageEvents = {
  update: {
    key: string;
    value: string | undefined;
  };
};

class StorageWrapper extends DelegateEmitter<StorageEvents> {
  readonly instance: Storage;
  readonly scope: string;

  private readonly valueStore: Map<string, StoredValue>;

  constructor(scope: string, instance?: Storage) {
    super();
    this.scope = scope;
    this.valueStore = new Map<string, StoredValue>();

    if (instance) {
      this.instance = instance;
    } else if (this.isAvailable()) {
      this.instance = this.getInstanceFromWindow();
    }
  }

  getStoredValue(key: string) {
    let result = this.valueStore.get(key);
    if (!result) {
      result = new StoredValue(this, key);
      this.valueStore.set(key, result);
    }
    return result;
  }

  get(key: string, defaultValue: string | null = null): string | null {
    if (this.isAvailable()) {
      return this.instance.getItem(key);
    }

    // If there is no storage support we get a StoredValue and use the value cache.
    return this.getStoredValue(key).getValue() || defaultValue;
  }

  set(key: string, value: string): string {
    if (this.isAvailable()) {
      if (!value) {
        this.remove(key);
      } else {
        this.instance.setItem(key, value);
      }
    } else {
      // If there is no storage support we get a StoredValue and use the value cache.
      this.getStoredValue(key).setValue(value);
    }

    this.emitter.emit("update", { key, value });
    return value;
  }

  remove(key: string): string | null {
    if (!this.isAvailable()) {
      return null;
    }

    const value = this.get(key);
    this.instance.removeItem(key);
    this.emitter.emit("update", { key, value: undefined });
    return value;
  }

  clear() {
    if (!this.isAvailable()) {
      return;
    }
    this.valueStore.forEach((value) => value.emit("update", undefined));
    this.instance.clear();
  }

  isAvailable() {
    return (
      this.instance ||
      (this.scope in window && this.getInstanceFromWindow() !== null)
    );
  }

  private getInstanceFromWindow() {
    return (window as { [key: string]: any })[this.scope];
  }
}

export const localStorageManager = new StorageWrapper(Scope.Locale);
export const sessionStorageManager = new StorageWrapper(Scope.Session);
