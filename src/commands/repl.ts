import repl from 'repl'
import {join} from 'path'
import {Command} from '@oclif/command'

import type {REPLServer} from 'repl'

export default class Repl extends Command {
  static description = 'Open an interactive REPL session to run commands'

  static examples = ['$ repl']

  static args = [{name: 'input'}]

  static postRun: ((repl: {
    server: REPLServer,
    setPrompt(prompt: string): void,
  }) => any) | undefined

  private commands: {id: string; description?: string}[] = []

  async run() {
    this.log('Entering REPL: type `Ctrl+C` or `.exit` to exit')
    let server: REPLServer
    await new Promise(() => {
      let inUse = false
      server = repl.start({
        eval: async message => {
          const [id, ...argv] = message.split(' ').map(arg => arg.replace('\n', ''))
          try {
            if (id && !inUse) {
              inUse = true
              if (id === this.id) {
                this.log('I heard you liked REPLs, so I put a REPL in a REPL.')
              } else {
                await this.config.runCommand(id, argv)
              }
            }
          } catch (error) {
            if (error.code !== 'EEXIT') {
              this.log(error.message)
            }
          }
          inUse = false
          server.prompt()
        },
        completer: (line: string) => {
          if (this.commands.length === 0) {
            this.commands.push({id: '.exit'})
            this.config.plugins.forEach(plugin => {
              plugin.commands.forEach(commands => {
                try {
                  if (commands.hidden) return
                  this.commands.push({
                    id: commands.id,
                    description: commands.description || '',
                  })
                } catch (error) { }
              })
            })
          }
          const result: [string[], string] = [
            this.commands
              .filter(command => command.id.startsWith(line))
              .map(command => command.id),
            line,
          ]
          return result
        },
      })

      if (Repl.postRun) Repl.postRun({
        server,
        setPrompt(prompt: string): void {
          server.setPrompt(prompt)
          server.displayPrompt(true)
        },
      })

      if (process.versions.node.split('.')[0] >= '12') {
        const history_file = join(this.config.cacheDir, '.repl_history')
        // @ts-expect-error 'setupHistory' is only available from Node v11.10, but v8 is the minimum in package.json
        server.setupHistory(history_file, (error: Error) => {
          if (error) this.debug(`Failed to setup REPL history: ${error.message}`)
          else this.debug(`Initialized REPL history at ${history_file}`)
        })
      }

      server.on('exit', () => {
        this.config.runHook('postrun', {
          Command: Repl,
          argv: this.argv,
        })
      })
    })
    process.exit() // eslint-disable-line unicorn/no-process-exit, no-process-exit
  }
}
