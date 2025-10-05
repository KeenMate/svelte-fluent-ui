# Svelte FluentUI

A comprehensive Svelte wrapper library for Microsoft FluentUI web components (v2.6.x), providing a seamless way to use FluentUI components in Svelte applications.

## Features

- 🎨 **Complete FluentUI Component Set** - Wraps all major FluentUI web components
- 🔧 **TypeScript Support** - Full type definitions for all components
- 📱 **Responsive Design** - Built-in responsive layout components
- 🎯 **Svelte 5 Compatible** - Works with the latest Svelte features
- 🎨 **SCSS & Tailwind CSS** - Flexible styling options
- 📦 **Tree-shakeable** - Import only what you need

## Installation

```bash
npm install svelte-fluentui
```

## Quick Start

```svelte
<script>
  import { Button, TextField, Card } from 'svelte-fluentui'
</script>

<Card>
  <TextField placeholder="Enter your name" />
  <Button appearance="accent">Submit</Button>
</Card>
```

## Available Components

### Form Controls
- `Button` - Various button styles and appearances
- `TextField` - Text input with validation
- `NumberField` - Numeric input control
- `Textarea` - Multi-line text input
- `Checkbox` - Checkbox input
- `Radio` / `RadioGroup` - Radio button controls
- `Switch` - Toggle switch
- `Select` - Dropdown selection
- `Combobox` - Searchable dropdown
- `Slider` - Range slider control
- `Search` - Search input field

### Data Display
- `DataGrid` / `DataGridRow` / `DataGridCell` - Data table components
- `QuickGrid` - Advanced data grid with sorting, filtering, and pagination
- `Card` - Content container
- `Badge` - Status indicators
- `ProgressBar` - Progress indication
- `Tooltip` - Contextual information
- `Calendar` - Date picker and calendar
- `Paginator` - Pagination control

### Navigation
- `Tabs` / `Tab` / `TabPanel` - Tab navigation
- `Breadcrumb` / `BreadcrumbItem` - Breadcrumb navigation
- `Menu` / `MenuItem` - Context menus
- `AppBar` / `AppBarItem` - Application bar
- `NavMenu` / `NavItem` / `NavLink` - Navigation components
- `Anchor` - Link component

### Layout
- `Stack` - Flexible layout container
- `Layout` - Page layout wrapper
- `Header` / `Footer` / `BodyContent` - Layout sections
- `Spacer` - Spacing utility
- `Divider` - Visual separator

### Feedback
- `Dialog` - Modal dialogs
- `Toast` - Notification messages
- `Accordion` / `AccordionItem` - Collapsible content

### Utilities
- `Listbox` / `Option` - List selection
- `Tree` / `TreeItem` - Hierarchical data
- `Toolbar` - Action toolbars

## Usage Examples

### Form with Validation
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

### Data Grid
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

### QuickGrid with Sorting & Filtering
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

### Navigation Layout
```svelte
<script>
  import { Layout, Header, NavMenu, NavItem, BodyContent } from 'svelte-fluentui'
</script>

<Layout>
  <Header slot="header">
    <h1>My App</h1>
  </Header>

  <NavMenu slot="navigation">
    <NavItem href="/">Home</NavItem>
    <NavItem href="/about">About</NavItem>
    <NavItem href="/contact">Contact</NavItem>
  </NavMenu>

  <BodyContent>
    <!-- Main content here -->
  </BodyContent>
</Layout>
```

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/KeenMate/svelte-fluentui.git
cd svelte-fluentui
npm install
```

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:5173` to see the component showcase and examples.

## Building

Build the library:

```bash
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [KeenMate](https://github.com/KeenMate)

## Credits

Built on top of [Microsoft FluentUI Web Components](https://github.com/microsoft/fluentui) v2.6.x.
