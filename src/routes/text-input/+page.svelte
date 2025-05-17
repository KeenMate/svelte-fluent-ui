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

<div class="header">
  <h1>Text input</h1>  
</div>

<div class="content">
  <h2 class="content-subhead">Properties</h2>
  <table class="pure-table property-table">
    <tbody>
      <tr class="property">
        <td colspan="4">Properties</td>
      </tr>
      <tr class="property">
<td></td>
<td>value</td>
<td>string</td>
<td>undefined</td>
</tr>
<tr class="property">
<td></td>
<td>placeholder</td>
<td>string</td>
<td>undefined</td>
</tr>
<tr class="property">
<td></td>
<td>appearance</td>
<td>TextInputAppearance</td>
<td>undefined</td>
</tr>
<tr class="property">
<td></td>
<td>disabled</td>
<td>boolean</td>
<td>undefined</td>
</tr>
<tr class="property">
<td></td>
<td>readonly</td>
<td>boolean</td>
<td>undefined</td>
</tr>
<tr class="property">
<td></td>
<td>required</td>
<td>boolean</td>
<td>undefined</td>
</tr>
<tr class="property">
<td></td>
<td>type</td>
<td>TextInputType</td>
<td>undefined</td>
</tr>
<tr class="property">
<td></td>
<td>name</td>
<td>string</td>
<td>undefined</td>
</tr>
<tr class="property">
<td></td>
<td>autofocus</td>
<td>boolean</td>
<td>undefined</td>
</tr>

<tr class="action">
        <td colspan="4">Actions</td>
      </tr>
<tr class="action">
<td></td>
<td>select</td>
<td>() => void;</td>
<td></td>
</tr>
<tr class="action">
<td></td>
<td>checkValidity</td>
<td>() => boolean;</td>
<td></td>
</tr>
<tr class="action">
<td></td>
<td>reportValidity</td>
<td>() => boolean;</td>
<td></td>
</tr>
<tr class="action">
<td></td>
<td>setCustomValidity</td>
<td>(message: string) => any;</td>
<td></td>
</tr>
<tr class="action">
<td></td>
<td>setValidity</td>
<td>(flags: any, message: any, anchor: any) => void;</td>
<td></td>
</tr>
<tr class="action">
<td></td>
<td>setSelectionRange</td>
<td>(start: number,  end: number,  direction?: "forward" | "backward" | "none") => void;</td>
<td></td>
</tr>

<tr class="property">
        <td></td>
        <td>Value</td>
        <td>text</td>
        <td>undefined</td>
      </tr>


      <tr class="property">
        <td></td>
        <td>Value</td>
        <td>text</td>
        <td>undefined</td>
      </tr>

      <tr class="callback">
        <td colspan="4">Callbacks</td>
      </tr>
      <tr class="callback">
        <td></td>
        <td>Value</td>
        <td>text</td>
        <td>undefined</td>
      </tr>

      <tr class="callback">
        <td></td>
        <td>Value</td>
        <td>text</td>
        <td>undefined</td>
      </tr>

      <tr class="slot">
        <td colspan="4">Slots</td>
      </tr>
      <tr class="slot">
        <td></td>
        <td>Value</td>
        <td>text</td>
        <td>undefined</td>
      </tr>

      <tr class="slot">
        <td></td>
        <td>Value</td>
        <td>text</td>
        <td>undefined</td>
      </tr>

      <tr class="slot">
        <td></td>
        <td>Value</td>
        <td>text</td>
        <td>undefined</td>
      </tr>
    </tbody>
  </table>

  <h2 class="content-subhead">Examples</h2>
  <p>
    <TextInput
      bind:select={textFieldSelect}
      bind:value={textValue}
      placeholder="Enter text"
      oninput={onTextInputChanged}
    />
  </p>
</div>
