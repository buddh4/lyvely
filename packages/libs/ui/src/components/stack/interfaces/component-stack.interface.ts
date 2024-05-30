import { ComponentRegistration } from '@/types';
import { ComputedRef, Ref } from 'vue';

/**
 * Specifies the structure of a component stack entry.
 *
 * @template TProps The type of the props object.
 * @template TOn The type of the event handlers object.
 */
export interface IComponentStackEntrySpec<
  TProps = any,
  TOn extends Record<string, (...args: any[]) => void> = Record<string, (...args: any[]) => void>,
> {
  props?: TProps;
  on?: TOn;
}

/**
 * An interface representing a single entry in a component stack.
 *
 * @template TProps - The type of the component props.
 * @template TOn - The type of the component events.
 */
export interface IComponentStackEntry<
  TSpec extends IComponentStackEntrySpec = IComponentStackEntrySpec,
> {
  /** The id of the stack entry, needs to be unique amongst all stack entries. **/
  id: string;
  /** A component or lazy component **/
  component: ComponentRegistration<TSpec['props']>;
  /** Only renders the stack entry if it meets a certain condition **/
  condition?: Ref<boolean> | ComputedRef<boolean>;
  /** Used to sort stack entries **/
  sortOrder?: number;
  /** Attach component props **/
  props?: TSpec['props'];
  /** Attach component events **/
  on?: TSpec['on'];
}
