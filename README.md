oclif-plugin-repl
===========

A plugin that allows command interaction through a read-eval-print loop.

<!-- toc -->
* [Installation](#installation)
* [Commands](#commands)
<!-- tocstop -->

# Installation

`npm i -S @sisou/oclif-plugin-repl`

Then update package.json to include it in your list of oclif plugins.

```json
"oclif": {
  "plugins": [
    "@sisou/oclif-plugin-repl"
  ]
},
```

# Commands
<!-- commands -->
* [`<your-command> repl`](#your-command-repl)

## `<your-command> repl`

Open an interactive REPL session to run commands

```
USAGE
  $ <your-command> repl

DESCRIPTION
  Open an interactive REPL session to run commands

EXAMPLES
  $ repl
```

_See code: [src/commands/repl.ts](https://github.com/sisou/oclif-plugin-repl/blob/v0.4.0/src/commands/repl.ts)_
<!-- commandsstop -->
