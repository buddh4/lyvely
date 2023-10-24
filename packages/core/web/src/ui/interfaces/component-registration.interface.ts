import { Component } from 'vue';
import { Lazy } from '@lyvely/common';

export type ComponentRegistration<Props = any> = Component<Props> | Lazy<Component<Props>>;
