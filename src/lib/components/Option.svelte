<script lang="ts">
  import "@fluentui/web-components/option.js";

  interface IProps {
    value: string;
    children: any;
    selected?: boolean;
    disabled?: boolean;
  }

  let {
    value,
    children,
    selected = false,
    disabled = false,
  }: IProps = $props();
</script>

<fluent-option {value} {selected} {disabled}>
  {@render children()}
</fluent-option>
