import repl, {REPLServer} from 'repl'
import {Command} from '@oclif/command'

export default class Repl extends Command {
  static description = 'This command will open a repl session for you to execute your commands'

  static examples = ['$ repl']

  static args = [{name: 'input'}]

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
              if (id === 'repl') {
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
      server.on('exit', () => {
        this.config.runHook('postrun', {
          // @ts-expect-error this.config.commands falsely typed as Plugin[]
          Command: this.config.commands.find(command => command.id === this.id)!,
          argv: this.argv,
        })
      })
    })
    process.exit() // eslint-disable-line unicorn/no-process-exit, no-process-exit
  }
}
