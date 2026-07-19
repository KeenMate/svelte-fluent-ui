# Usage Examples

Runnable snippets for common `svelte-fluentui` patterns. For the full component catalogue see [COMPONENTS.md](https://github.com/KeenMate/svelte-fluentui/blob/prod/COMPONENTS.md); for the live showcase see [svelte-fluentui.keenmate.dev](https://svelte-fluentui.keenmate.dev).

## Form with Validation
```svelte
<script>
  import { TextField, Button, Stack } from 'svelte-fluentui'

  let email = ''
  let password = ''
</script>

<Stack orientation="vertical" gap="16">
  <TextField
    bind:value={email}
    type="email"
    placeholder="Enter email"
    required
  />
  <TextField
    bind:value={password}
    type="password"
    placeholder="Enter password"
    required
  />
  <Button appearance="accent">Sign In</Button>
</Stack>
```

## Data Grid
```svelte
<script>
  import { DataGrid, DataGridRow, DataGridCell } from 'svelte-fluentui'

  const users = [
    { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { name: 'Bob', email: 'bob@example.com', role: 'User' }
  ]
</script>

<DataGrid>
  {#each users as user}
    <DataGridRow>
      <DataGridCell>{user.name}</DataGridCell>
      <DataGridCell>{user.email}</DataGridCell>
      <DataGridCell>{user.role}</DataGridCell>
    </DataGridRow>
  {/each}
</DataGrid>
```

## QuickGrid with Sorting & Filtering
```svelte
<script lang="ts">
  import { QuickGrid } from 'svelte-fluentui'

  type User = {
    id: number
    name: string
    email: string
    role: string
  }

  const users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Carol', email: 'carol@example.com', role: 'User' }
  ]

  const columns = [
    { field: 'id', title: 'ID', width: '80px', sortable: true },
    { field: 'name', title: 'Name', sortable: true, filterable: true },
    { field: 'email', title: 'Email', filterable: true },
    { field: 'role', title: 'Role', sortable: true }
  ]
</script>

<QuickGrid
  items={users}
  {columns}
  sortable
  filterable
  pageable
  pageSize={10}
/>
```

## Navigation Layout with Persistence
```svelte
<script>
  import { Layout, Header, NavMenu, NavGroup, NavLinkItem, BodyContent } from 'svelte-fluentui'
  import { page } from '$app/stores'

  // Check if a link is active based on current route
  function isActive(href: string): boolean {
    if (!href) return false
    if (href === "/" && $page.url.pathname === "/") return true
    if (href !== "/" && $page.url.pathname.startsWith(href)) return true
    return false
  }
</script>

<Layout>
  <Header slot="header">
    <h1>My App</h1>
  </Header>

  <NavMenu slot="navigation">
    <NavGroup title="Main Menu">
      {#snippet linkText()}
        Main Menu
      {/snippet}

      <NavLinkItem href="/" class={isActive("/") ? "active" : ""}>
        Home
      </NavLinkItem>
      <NavLinkItem href="/about" class={isActive("/about") ? "active" : ""}>
        About
      </NavLinkItem>
      <NavLinkItem href="/contact" class={isActive("/contact") ? "active" : ""}>
        Contact
      </NavLinkItem>
    </NavGroup>
  </NavMenu>

  <BodyContent>
    <!-- Main content here -->
  </BodyContent>
</Layout>
```

## Date and Time Pickers
```svelte
<script>
  import { DatePicker, TimePicker } from 'svelte-fluentui'

  let selectedDate = $state<Date | null>(new Date())
  let selectedTime = $state<string | null>("14:30")

  // Deny weekends
  const disabledDateFunc = (d: Date) => d.getDay() === 0 || d.getDay() === 6
</script>

<DatePicker
  bind:value={selectedDate}
  label="Select date"
  placeholder="Choose a date"
  firstDayOfWeek={1}
  {disabledDateFunc}
  autoClose={true}
/>

<TimePicker
  bind:value={selectedTime}
  label="Select time"
  useAmPm={false}
  showSeconds={false}
  minTime="08:00"
  maxTime="18:00"
  autoClose={true}
/>
```

## Dialog with Actions
```svelte
<script>
  import { Dialog, Button } from 'svelte-fluentui'

  let open = $state(false)
  let name = $state("")
</script>

<Button onclick={() => open = true}>Open Dialog</Button>

<Dialog
  bind:visible={open}
  title="Rename item"
  modal
  primaryAction={{
    label: "Save",
    onClick: async () => {
      if (!name.trim()) return false  // keep open
      await saveName(name)
      // auto-closes when onClick resolves to anything but `false`
    }
  }}
  secondaryAction={{
    label: "Cancel"
  }}
>
  <label>
    Name
    <input bind:value={name} />
  </label>
</Dialog>
```

## Responsive Tabs
```svelte
<script>
  import { Tabs, Tab } from 'svelte-fluentui'
</script>

<!-- Default: tabs scroll horizontally when too wide -->
<Tabs activeId="overview">
  {#snippet childContent()}
    <Tab id="overview" label="Overview" />
    <Tab id="members" label="Members" />
    <Tab id="activity" label="Activity" />
    <Tab id="integrations" label="Integrations" />
    <Tab id="settings" label="Settings" />
  {/snippet}
</Tabs>

<!-- Wrap onto multiple rows instead of scrolling -->
<Tabs responsive="wrap" activeId="a">...</Tabs>

<!-- Justify: tabs divide the row equally -->
<Tabs justify activeId="a">...</Tabs>
```

## Autocomplete with Multiple Selection
```svelte
<script lang="ts">
  import { Autocomplete } from 'svelte-fluentui'

  const options = [
    { value: "1", text: "Option 1" },
    { value: "2", text: "Option 2" },
    { value: "3", text: "Option 3" }
  ]

  let selected = $state<string[]>([])
</script>

<Autocomplete
  bind:selectedOptions={selected}
  options={options}
  label="Select multiple"
  placeholder="Type to search..."
  maxSelectedOptions={5}
/>
```

## File Upload with Progress
```svelte
<script lang="ts">
  import { InputFile } from 'svelte-fluentui'
  import type { FileUploadHandler } from 'svelte-fluentui'

  const uploadFile: FileUploadHandler = async (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)

    // Your upload logic here
    // Call onProgress(percent) to update progress bar

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error('Upload failed')
  }
</script>

<InputFile
  multiple={true}
  accept="image/*"
  maxFileSize={5 * 1024 * 1024}
  uploadFileCallback={uploadFile}
  onFileUploaded={(file) => console.log('Uploaded:', file.name)}
/>
```

## Toast Notifications
```svelte
<script>
  import { ToastContainer, toast } from 'svelte-fluentui'

  function showSuccess() {
    toast.success('Operation completed successfully!')
  }

  function showError() {
    const id = toast.error('Something went wrong', {
      persistent: true,
      position: 'top-center'
    })
    // Later: toast.dismiss(id)
  }

  function showWithProgress() {
    toast.info('Processing your request...', {
      showProgress: true,
      duration: 8000
    })
  }
</script>

<!-- Add once in your layout -->
<ToastContainer />

<button onclick={showSuccess}>Show Success</button>
<button onclick={showError}>Show Error</button>
<button onclick={showWithProgress}>Show With Progress</button>
```

## `portal` Action (for custom overlays)
```svelte
<script>
  import { portal } from 'svelte-fluentui'

  let open = $state(false)
</script>

<button onclick={() => open = true}>Show overlay</button>

{#if open}
  <!-- Moved to <body> for the lifetime of this block so ancestor
       stacking contexts / transforms don't affect its z-index. -->
  <div use:portal class="my-overlay" onclick={() => open = false}>
    My custom overlay
  </div>
{/if}
```

## Global Runtime API
```js
// In any browser console, after the page has loaded svelte-fluentui:
window.components["svelte-fluentui"].version()
// => "1.0.0"
```

Also available as a direct import:
```js
import { VERSION } from 'svelte-fluentui'
console.log(VERSION)
```

## Z-Index Scale

All overlays use a shared token scale so the layering stays consistent across the library. Variables are exposed at `:root` when you import the SCSS bundle; every `z-index: var(--fluent-z-*)` declaration in components also includes the numeric fallback so things still stack correctly even without our SCSS loaded.

| Token | Value | Used for |
|---|---|---|
| `--fluent-z-dropdown` | 1000 | Simple dropdowns, grid overlays |
| `--fluent-z-sticky` | 1020 | Sticky app bars / headers |
| `--fluent-z-fixed` | 1030 | Fixed sidebars / mobile nav |
| `--fluent-z-modal-backdrop` | 1040 | Dialog overlay |
| `--fluent-z-modal` | 1050 | Dialog itself |
| `--fluent-z-popover` | 1060 | Calendar / time / autocomplete popups (above modal) |
| `--fluent-z-tooltip` | 1070 | Tooltip |
| `--fluent-z-toast` | 1080 | Toast |
