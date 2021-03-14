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
* [`<your-command> repl [INPUT]`](#your-command-repl-input)

## `<your-command> repl [INPUT]`

This command will open a repl session for you to execute your commands

```
USAGE
  $ <your-command> repl [INPUT]

EXAMPLE
  $ repl
```

_See code: [src/commands/repl.ts](https://github.com/sisou/oclif-plugin-repl/blob/v0.2.0/src/commands/repl.ts)_
<!-- commandsstop -->
