<script module>
  import {
    DropdownDefinition,
    FluentDesignSystem,
  } from "@fluentui/web-components";

  DropdownDefinition.define(FluentDesignSystem.registry);
</script>

<script lang="ts">
  import "@fluentui/web-components/dropdown.js";
  import "@fluentui/web-components/listbox.js";
  import "@fluentui/web-components/option.js";

  interface IProps {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    autofocus?: boolean;
    name?: string;
    options?: Array<{ value: string; label: string }>;
    children?: any;
    onInput?: (e: Event) => void;
    onChange?: (e: Event) => void;
  }

  let {
    value = $bindable(),
    placeholder = undefined,
    disabled = undefined,
    required = undefined,
    autofocus = undefined,
    name = undefined,
    children = undefined,
    options = undefined,
    onInput = undefined,
    onChange = undefined,
  }: IProps = $props();

  let dropdown: HTMLElement & {
    value: string;
    checkValidity: () => boolean;
    reportValidity: () => boolean;
    setCustomValidity: (message: string) => void;
  };

  // Local reactive value
  //   let value = value ?? "";

  function handleInput(e: Event) {
    value = (e.target as HTMLInputElement).value;
    onInput?.(e);
  }

  function handleChange(e: Event) {
    onChange?.(e);
  }

  // Public methods
  export function checkValidity(): boolean {
    return dropdown?.checkValidity();
  }

  export function reportValidity(): boolean {
    return dropdown?.reportValidity();
  }

  export function setCustomValidity(message: string): void {
    dropdown?.setCustomValidity(message);
  }
</script>

<fluent-dropdown
  bind:this={dropdown}
  {placeholder}
  {disabled}
  {required}
  {autofocus}
  {name}
  oninput={handleInput}
  onchange={handleChange}
>
  <fluent-listbox>
    {#if children}
      {@render children()}
    {:else}
      {#each options ?? [] as option}
        <fluent-option value={option.value}>{option.label}</fluent-option>
      {/each}
    {/if}
  </fluent-listbox>
</fluent-dropdown>
