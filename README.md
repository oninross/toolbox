# toolbox

`toolbox` is a CLI utility to speed up common frontend project tasks. It provides commands for generating LLM guidelines, scaffolding a Next.js + Storybook project, and running a component generator.

## Installation & Usage

You can run toolbox directly with npx (no install required):

```sh
npx @oninross/toolbox <command>
```

## Available Commands

| Command                  | Description                                                                |
| ------------------------ | -------------------------------------------------------------------------- |
| `--llm-guide, -g`        | Generate `llm.txt` in the project root with LLM guidelines                 |
| `--create-component, -c` | Run `@oninross/create-component` to scaffold a new component               |
| `--scaffold`             | Scaffold a Next.js + Storybook project (with TypeScript, ESLint, and SCSS) |
| `--switch`, `-s`         | Interactively switch which SSH key is used for GitHub pushes               |
| `--clean-modules, -x`    | Remove `node_modules` and `package-lock.json` from the project root        |
| `--help, -h`             | List all available commands                                                |

## Examples

Generate LLM guidelines file:

```sh
npx @oninross/toolbox --llm-guide
```

Run the component generator:

```sh
npx @oninross/toolbox --create-component
```

Scaffold a Next.js + Storybook project:

```sh
npx @oninross/toolbox --scaffold
```

Switch SSH key for GitHub pushes:

```sh
npx @oninross/toolbox --switch
# or
npx @oninross/toolbox -s
```

Remove `node_modules` and `package-lock.json`:

```sh
npx @oninross/toolbox --clean-modules
# or
npx @oninross/toolbox -x
```

Show help:

```sh
npx @oninross/toolbox --help
```

---

This tool is maintained by [oninross](https://github.com/oninross).
