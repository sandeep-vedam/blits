/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

declare namespace Component {

  /**
   * Name of the Component
   */
  type Name = string

  interface AdvancedProp {
    /**
     * Name of the prop
     */
    key: string,
    /**
     * Whether the prop is required to be passed
     */
    required?: boolean,
    /**
     * Default value for the prop when omited
     */
    default?: any,
    /**
     * Cast the value of the prop
     *
     * @example
     * ```js
     * {
     *   cast: Number, // casts to a number
     *   cast: (v) => v.toUpperCase() // casts to uppercase
     * }
     * ```
     */
    cast?: () => any
  }
  type PropsArray<T extends string> = T[]
  type AdvancedProps = AdvancedProp[]

  // type ExtractPropNames<T extends Prop[]> = T extends (infer U)[]
  // ? U extends string
  //   ? U
  //   : U extends AdvancedProp
  //   ? U['key']
  //   : never
  // : never;

  type NotFunction<T> = T extends Function ? never : T;

  /**
   * Internal state of a Component instance
   */
  interface State {
    [key: string]: any
  }

  interface Computed {
    [key: string]: (this: ComponentInstance) => any
  }

  interface Watch {
    [key: string]: (this: ComponentInstance, value: any, oldValue: any) => void
  }

  interface Methods {
    [key: string]: (this: ComponentInstance) => any
  }

  interface Input {
    [key: string]: ((this: ComponentInstance, event: KeyboardEvent) => void) | undefined,

    /**
     * Catch all input function
     *
     * Will be invoked when there is no dedicated function for a certain key
    */
    any?: (this: ComponentInstance, event: KeyboardEvent) => void,
  }

  interface Log {
    /**
    * Log an info message
    */
    info(...args): typeof console.info
    /**
    * Log an error message
    */
    error(...args): typeof console.error
    /**
    * Log a warning
    */
    warn(...args): typeof console.warn
    /**
    * Log a debug message
    */
    debug(...args): typeof console.debug
  }

  interface Hooks {
    /**
    * Fires when the Component is being instantiated.
    * At this moment child elements will not be available yet
    */
    init?: (this: ComponentInstance) => void
    /**
    * Fires when the Component is fully initialized and ready for interaction.
    */
    ready?: (this: ComponentInstance) => void
    /**
    * Triggers when the Component receives focus.
    *
    * This event can fire multiple times during the component's lifecycle
    */
    focus?: (this: ComponentInstance) => void
    /**
    * Triggers when the Component loses focus.
    *
    * This event can fire multiple times during the component's lifecycle
    */
    unfocus?: (this: ComponentInstance) => void
    /**
    * Fires when the Component is being destroyed and removed.
    */
    destroy?: (this: ComponentInstance) => void,
    /**
    * Fires upon each frame start  (allowing you to tap directly into the renderloop)
    *
    * Note: This hook will fire continuously, multiple times per second!
    */
    frameTick?: (this: ComponentInstance) => void,
    /**
    * Fires when the component enters the viewport _margin_ and is attached to the render tree
    *
    * This event can fire multiple times during the component's lifecycle
    */
    attach?: (this: ComponentInstance) => void,
    /**
    * Fires when the component leaves the viewport _margin_ and is detached from the render tree
    *
    * This event can fire multiple times during the component's lifecycle
    */
    detach?: (this: ComponentInstance) => void,
    /**
    * Fires when the component enters the visible viewport
    *
    * This event can fire multiple times during the component's lifecycle
    */
    enter?: (this: ComponentInstance) => void,
    /**
    * Fires when the component leaves the visible viewport
    *
    * This event can fire multiple times during the component's lifecycle
    */
    exit?: (this: ComponentInstance) => void,
  }

  export interface ComponentInstance {
    /**
    * Listen to events emitted by other components
    */
    $listen: (event: string, callback: (args: any) => void) => void

    /**
    * Emit events that other components can listen to
    */
    $emit: (event: string, args?: any) => void

    /**
    * Set a timeout that is automatically cleaned upon component destroy
    */
    $setTimeout: (callback: (args: any) => void, ms?: number | undefined) => ReturnType<typeof setTimeout>

    /**
    * Clear a timeout
    */
    $clearTimeout: (id: ReturnType<typeof setTimeout>) => void

    /**
    * Set an interval that is automatically cleaned upon component destroy
    */
    $setInterval: (callback: (args: any) => void, ms?: number | undefined) => ReturnType<typeof setInterval>

    /**
    * Clear a interval
    */
    $clearInterval: (id: ReturnType<typeof setInterval>) => void

    /**
    * Log to the console with prettier output and configurable debug levels in Settings
    */
    $log: Log

    /**
    * Set focus to the Component, optionally pass a KeyboardEvent for instant event bubbling
    */
    focus: (event?: KeyboardEvent) => void

    /**
    * Select a child Element or Component by ref
    *
    * Elements and Components in the template can have an optional ref argument.
    * Returns an Element Instance or Component Instance.
    * Useful for passing on the focus to a Child component.
    *
    * @example
    * ```js
    * const menu = this.select('Menu')
    * if(menu) {
    *   menu.focus()
    * }
    * ```
    */
    select: (ref: string) => ComponentInstance | ElementInstance

    // tmp
    [key: string]: any
  }

  export interface ElementInstance {
    focus?: () => void
  }

  export interface ComponentConfig<Props extends string, Watch, Computed, Hooks, Input, State, Methods> {
    components?: any,
    /**
     * XML-based template string of the Component
     *
     * @example
     * ```xml
     * <Element :x="$x" w="400" h="1080" color="#64748b">
     *  <Element x="50" y="40">
     *   <Button color="#e4e4e7" />
     *   <Button color="#e4e4e7" y="100" />
     *   <Button color="#e4e4e7" y="200" />
     *   <Button color="#e4e4e7" y="300" />
     *  </Element>
     * </Element>
     * ```
     */
    template?: String,
    /**
     * Reactive internal state of the Component instance
     *
     * Should return an object (literal) with key value pairs.
     * Can contain nested objects, but beware that too deep nesting can have
     * a negative impact on performance
     *
     * @example
     * ```js
     * state() {
     *  return {
     *    items: [],
     *    color: 'red',
     *    alpha: 0.1
     *  }
     * }
     * ```
     */
    state?: (this: { [K in Props]: any}) => State,
    /**
     * Allowed props to be passed into the Component by the parent
     *
     * Can be a simple array with `prop` keys as strings.
     * Alternatively objects can be used to specify `required` props and `default` values
     *
     * @example
     * ```js
     * props: ['index', {
     *  key: 'alpha',
     *  required: true
     * }, {
     *  key: 'color',
     *  default: 'red'
     * }]
     * ```
     */
    props?: PropsArray<Props> | AdvancedProp[],
    /**
     * Computed properties
     */
    computed?: Computed & ThisType<ComponentInstance & State & Methods & { [K in Props]: any}>,
    /**
     * Watchers for changes to state variables, props or computed properties
     */
    watch?: Watch & ThisType<ComponentInstance & State & Methods & { [K in Props]: any}>,
    /**
     * Hooking into Lifecycle events
     */
    hooks?: Hooks & ThisType<ComponentInstance & State & Methods & { [K in Props]: any}>,
    /**
     * Methods for abstracting more complex business logic into separate function
     */
    methods?: Methods & ThisType<ComponentInstance & State & Methods & { [K in Props]: any}>,
    /**
     * Tapping into user input
     */
    input?: Input & ThisType<ComponentInstance & State & Methods & { [K in Props]: any}>,
  }
}


 /**
 * Blits.Component()
 */
declare function Component<Props extends string, Watch, Computed, Hooks, Input, State, Methods>(
  name: Component.Name,
  config: Component.ComponentConfig<Props, Watch, Computed, Hooks, Input, State, Methods>,
) : Component.ComponentInstance

export default Component;
