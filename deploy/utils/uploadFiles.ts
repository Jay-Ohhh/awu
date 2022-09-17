import type { NodeSSH } from 'node-ssh'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { runCommand } from './command.js'
import { getCurrentTime } from './time.js'
import type { DeployConfig } from './config.js'

async function uploadFiles(ssh: NodeSSH, config: DeployConfig) {
  // 如果命令都写在同一行，分号则是必需的
  // 注意if语句的空格
  await runCommand(ssh, `
  if [ ! -d backup ];
  then mkdir -p backup;
  fi;
  for i in $(ls);
  do if [ $i != backup ];
  then rm -rf $i;
  fi;
  done
  `, config.deployDir)

  console.log(chalk.green('uploading..'));
  await ssh.putDirectory(
    path.join(process.cwd(), config.targetDir),
    config.deployDir
  ).then(() => {
    console.log(chalk.green('upload complete'));
  }).catch((err) => {
    console.log(chalk.red('upload failed: ' + err));
    process.exit()
  })

  if (config.backup) {
    const targetZip = path.join(process.cwd(), config.targetFile)
    if (fs.existsSync(targetZip)) {
      const currentTime = getCurrentTime()
      console.log(chalk.bgGreenBright('start backup...'));
      await ssh.putFile(
        targetZip,
        path.join(config.deployDir, `backup/${currentTime + '.' + config.targetFile}`)
      ).then(() => {
        console.log(chalk.green('backup complete'));
      }).catch(err => {
        console.log(chalk.red('backup failed: ' + err));
        process.exit()
      })
    } else {
      console.log(chalk.red('backup failed: no compression file'));
    }
  } else {
    console.log(chalk.bgBlueBright('no backup'));
  }
}

export { uploadFiles }
