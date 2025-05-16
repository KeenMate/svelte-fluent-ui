<script lang="ts">
  import "$lib/fluent-ui/index.js";

  import Accordion from "$lib/components/Accordion.svelte";
  import AccordionItem from "$lib/components/AccordionItem.svelte";
  import AnchorButton from "$lib/components/AnchorButton.svelte";
  import Badge from "$lib/components/Badge.svelte";
  import Button from "$lib/components/Button.svelte";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import CompoundButton from "$lib/components/CompoundButton.svelte";
  import CounterBadge from "$lib/components/CounterBadge.svelte";
  import Dialog from "$lib/components/Dialog.svelte";
  import DialogBody from "$lib/components/DialogBody.svelte";
  import Divider from "$lib/components/Divider.svelte";
  import Drawer from "$lib/components/Drawer.svelte";
  import DrawerBody from "$lib/components/DrawerBody.svelte";
  import Dropdown from "$lib/components/Dropdown.svelte";
  import Field from "$lib/components/Field.svelte";
  import Image from "$lib/components/Image.svelte";
  import Label from "$lib/components/Label.svelte";
  import Link from "$lib/components/Link.svelte";
  import Menu from "$lib/components/Menu.svelte";
  import MenuButton from "$lib/components/MenuButton.svelte";
  import MenuItem from "$lib/components/MenuItem.svelte";
  import MenuList from "$lib/components/MenuList.svelte";
  import MessageBar from "$lib/components/MessageBar.svelte";
  import Option from "$lib/components/Option.svelte";
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import Radio from "$lib/components/Radio.svelte";
  import RadioGroup from "$lib/components/RadioGroup.svelte";
  import RatingDisplay from "$lib/components/RatingDisplay.svelte";
  import Slider from "$lib/components/Slider.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import Switch from "$lib/components/Switch.svelte";
  import TabPanel from "$lib/components/TabPanel.svelte";
  import TabList from "$lib/components/TabList.svelte";
  import Text from "$lib/components/Text.svelte";
  import TextInput from "$lib/components/TextInput.svelte";
  import Textarea from "$lib/components/Textarea.svelte";
  import ToggleButton from "$lib/components/ToggleButton.svelte";
  import Tooltip from "$lib/components/Tooltip.svelte";
  import Tree from "$lib/components/Tree.svelte";
  import TreeItem from "$lib/components/TreeItem.svelte";
  import { ButtonAppearance } from "@fluentui/web-components";
  import { onMount } from "svelte";

  let textValue = $state("");
  let checked = $state(true);
  let selectedValue = $state("");

  let textFieldSelect;

  onMount(() => {
    console.log("🚀 ~ onMount ~ onMount:", onMount)
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
  <h1>Fluent UI Svelte – Full Component Demo</h1>

  <!-- Example Section -->
  <div class="component-section">
    <div class="component-title">Button</div>
    <div class="grid">
      <Button appearance={ButtonAppearance.primary}>Primary</Button>
      <AnchorButton href="#">Anchor</AnchorButton>
      <CompoundButton secondaryContent="More info">Compound</CompoundButton>
    </div>
  </div>

  <div class="component-section">
    <div class="component-title">Inputs</div>
    <div class="grid">
      <TextInput
        bind:select={textFieldSelect}
        bind:value={textValue}
        placeholder="Enter text"
        oninput={onTextInputChanged}
      />
      {textValue}
      <Textarea placeholder="Multiline text" />
      <Checkbox bind:checked>Accept</Checkbox>
      <Switch bind:checked>Toggle</Switch>
      <Slider min="0" max="100" value="50" />
      <RatingDisplay value="3" max="5" />
    </div>
  </div>

  <div class="component-section">
    <div class="component-title">Selectors</div>
    <div class="grid">
      <Dropdown>
        <Option value="A">A</Option>
        <Option value="B">B</Option>
      </Dropdown>
      <RadioGroup name="example">
        <Radio value="yes">Yes</Radio>
        <Radio value="no">No</Radio>
      </RadioGroup>
    </div>
  </div>

  <div class="component-section">
    <div class="component-title">Navigation / Layout</div>
    <div class="grid">
      <TabList>
        <TabPanel>Tab 1 content</TabPanel>
        <TabPanel>Tab 2 content</TabPanel>
      </TabList>
      <Accordion>
        <AccordionItem header="Item 1">Content 1</AccordionItem>
        <AccordionItem header="Item 2">Content 2</AccordionItem>
      </Accordion>
      <Tree>
        <TreeItem
          >Root
          <TreeItem>Child</TreeItem>
        </TreeItem>
      </Tree>
    </div>
  </div>

  <div class="component-section">
    <div class="component-title">Feedback & Utility</div>
    <div class="grid">
      <Badge appearance="accent">New</Badge>
      <CounterBadge count="5" />
      <ProgressBar value="75" />
      <Spinner />
      <Tooltip content="Helpful info">
        <Button>Hover me</Button>
      </Tooltip>
      <MessageBar>Important message here</MessageBar>
    </div>
  </div>

  <div class="component-section">
    <div class="component-title">Menus & Dialogs</div>
    <div class="grid">
      <Menu>
        <MenuButton>Open Menu</MenuButton>
        <MenuList slot="menu">
          <MenuItem>Item A</MenuItem>
          <MenuItem>Item B</MenuItem>
        </MenuList>
      </Menu>
      <Dialog>
        <DialogBody>This is a dialog</DialogBody>
      </Dialog>
      <Drawer>
        <DrawerBody>This is a drawer</DrawerBody>
      </Drawer>
    </div>
  </div>

  <div class="component-section">
    <div class="component-title">Text, Media, Misc</div>
    <div class="grid">
      <Text>Sample text</Text>
      <Label for="input">Label</Label>
      <Image src="https://via.placeholder.com/100" alt="Placeholder" />
      <Link href="https://example.com">Example Link</Link>
      <Field label="Name">
        <TextInput id="name" />
      </Field>
    </div>
  </div>

  <div class="component-section">
    <div class="component-title">Decorative & Structural</div>
    <div class="grid">
      <Divider />
      <ToggleButton>Toggle Me</ToggleButton>
    </div>
  </div>
</div>

<style>
  .demo-page {
    max-width: 1100px;
    margin: auto;
    padding: 2rem;
    font-family: sans-serif;
  }

  .component-section {
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 2rem;
    padding: 1rem;
  }

  .component-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
  }
</style>
