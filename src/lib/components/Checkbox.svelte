<script lang="ts">
  import "@fluentui/web-components/checkbox.js";

  interface IProps {
    autofocus: boolean;
    checked: boolean;
    children?: any;
    disabled?: boolean;
    required: boolean;
    value: string;

    checkValidity?: () => boolean;
    reportValidity?: () => boolean;
    setCustomValidity: (message: string) => any;
    setValidity?: (flags: any, message: any, anchor: any) => void;
  }

  let { checked = $bindable(), children = undefined }: IProps = $props();
</script>

<fluent-checkbox>
  <!-- todo: finish Checkbox -->
  {@render children?.()}
</fluent-checkbox>
