# Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/KeenMate/svelte-fluentui.git
cd svelte-fluentui
npm install
```

## Working on the Library

The library source code is in `packages/svelte-fluentui/src/lib/`. To package the library:

```bash
npm run package
```

## Working on Documentation

The documentation site is in the `docs/` folder as a separate SvelteKit project:

```bash
cd docs
npm install
npm run dev
```

Or use the Makefile:

```bash
make dev  # Runs docs dev server
```

Visit `http://localhost:5173` to see the component showcase and examples.

## Building

Build the library for publishing:

```bash
npm run build
```

Build documentation Docker image:

```bash
# With local source
make docker-build-docs

# With specific npm version
make docker-build-docs VERSION=1.0.0-rc03
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
