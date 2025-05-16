<script lang="ts">
  import "@fluentui/web-components/text-input.js";

  let {
    value = $bindable(),
    placeholder = undefined,
    appearance = undefined,
    disabled = undefined,
    readonly = undefined,
    required = undefined,
    type = undefined,
    name = undefined,
    autofocus = undefined,

    select = $bindable(),
    checkValidity = $bindable(),
    reportValidity = $bindable(),
    setCustomValidity = $bindable(),
    setSelectionRange = $bindable(),

    oninput = undefined,
    onchange = undefined,
  } = $props();

  let textField: HTMLElement & {
    value: string;
    select: () => void;
    checkValidity: () => boolean;
    reportValidity: () => boolean;
    setCustomValidity: (message: string) => void;
    setSelectionRange: (
      start: number,
      end: number,
      direction?: "forward" | "backward" | "none"
    ) => void;
  };

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    oninput?.(event);
  }

  function handleChange(event: Event) {
    onchange?.(event);
  }

  // Sync internal state with prop if changed externally
  $effect(() => {
    // if (value !== state.value) {
    //   state.value = value;
    // }
  });

  // Expose methods
  select = () => {
    textField?.select();
  };

  checkValidity = () => {
    return textField?.checkValidity();
  };

  reportValidity = () => {
    return textField?.reportValidity();
  };

  setCustomValidity = (message: string) => {
    textField?.setCustomValidity(message);
  };

  setSelectionRange = (
    start: number,
    end: number,
    direction?: "forward" | "backward" | "none"
  ) => {
    textField?.setSelectionRange(start, end, direction);
  };
</script>

<fluent-text-input
  bind:this={textField}
  {value}
  {placeholder}
  {appearance}
  {disabled}
  {readonly}
  {required}
  {type}
  {name}
  {autofocus}
  oninput={handleInput}
  onchange={handleChange}
></fluent-text-input>

<style>
  /* Optional: Add component-specific styles here */
</style>
