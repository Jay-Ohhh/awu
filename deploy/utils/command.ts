import type { NodeSSH } from 'node-ssh'
import chalk from 'chalk'

function runCommand(ssh: NodeSSH, command: string, cwd: string) {
  return new Promise((resolve, reject) => {
    ssh.execCommand(command, { cwd }).then(res => {
      if (res.stderr) {
        reject(console.log(chalk.red('execution failed: ' + res.stderr)))
        process.exit()
      } else {
        resolve(null)
      }
    })
  })
}

export { runCommand }
