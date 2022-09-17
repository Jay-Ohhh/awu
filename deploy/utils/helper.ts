import chalk from 'chalk'
import dotenv from 'dotenv'
import path from 'path'
import inquirer, { QuestionCollection } from 'inquirer'
import { DeployConfig } from './config.js'

dotenv.config({
  path: path.join(process.cwd(), '.env.production')
})

const {
  SERVER_PWD,
  PRIVATE_KEY_PATH,
  PASSPHRASE,
} = process.env
const projectName = 'server'
const auth = 'authentication'
const authType = ['password', 'private-key']

function showHelper(configs: DeployConfig[]): Promise<DeployConfig> {
  const choices: any[] = []
  const options: QuestionCollection[] = [
    {
      type: 'list',
      name: projectName,
      message: 'select a server to deploy',
      choices: []
    },
    {
      type: 'list',
      name: auth,
      message: auth,
      choices: authType
    },
    {
      type: 'confirm',
      name: 'backup',
      message: 'back up files in the server',
    }
  ]

  configs.forEach(item => {
    (choices as any[]).push(item.name)
  })

  if (new Set(choices).size !== choices.length) {
    console.error('请检查配置信息，存在相同name！')
    process.exit()
  }

  (options[0] as any).choices = choices

  return new Promise((resolve, reject) => {
    inquirer.prompt(options).then(answers => {
      const config = configs.find(item =>
        item.name === answers[projectName]
      )

      if (answers[auth] === authType[0]) {
        if (!SERVER_PWD) {
          console.log(chalk.red(
            'Need to set SERVER_PWD in .env.production'
          ));
          process.exit()
        }
        config.ssh.password = SERVER_PWD
      } else if (answers[auth] === authType[1]) {
        if (!PRIVATE_KEY_PATH) {
          console.log(chalk.red(
            'Need to set PRIVATE_KEY_PATH and PASSPHRASE(if need) in .env.production'
          ));
          process.exit()
        }
        config.ssh.privateKeyPath = PRIVATE_KEY_PATH
        config.ssh.passphrase = PASSPHRASE
      }

      if (answers['backup']) {
        config.backup = true
      }

      resolve(config)
    }).catch(err => {
      reject(console.log(
        chalk.red('\n' + '选择错误！' + '\n' + err)
      ))
      process.exit()
    })
  })
}

export { showHelper }
