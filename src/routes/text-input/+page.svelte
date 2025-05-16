<script lang="ts">
  import { onMount } from "svelte";

  import TextInput from "$lib/components/TextInput.svelte";
  let textValue = $state("");
  let textFieldSelect: () => void;

  onMount(() => {
    console.log("🚀 ~ onMount ~ onMount:", onMount);
    setTimeout(() => {
      console.log("🚀 ~ setTimeout ~ textFieldSelect:", textFieldSelect);

      textFieldSelect();
    }, 3500);
  });

  function onTextInputChanged(ev) {
    console.log("🚀 ~ onTextInputChanged ~ ev:", ev.target.value);
  }
</script>

<div class="demo-page">
  <h1>Text input</h1>
  <TextInput
    bind:select={textFieldSelect}
    bind:value={textValue}
    placeholder="Enter text"
    oninput={onTextInputChanged}
  />
</div>
