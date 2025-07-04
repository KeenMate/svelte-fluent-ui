# Svelte FluentUI (Svelte wrapper)

A Svelte wrapper of FluentUI web components in version 2.6.x, because 3.x.x version is too new and missing too many components.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a
development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview
app.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target
> environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a
`"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is
the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```
