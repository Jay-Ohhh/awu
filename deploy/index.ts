import chalk from 'chalk'
import { ssh, connectServer } from './utils/ssh.js'
import { showHelper } from './utils/helper.js'
import { uploadFiles } from './utils/uploadFiles.js'
import { deployConfigs } from './utils/config.js'
import { compressFile } from './utils/compress.js'

async function main() {
  try {
    const config = await showHelper(deployConfigs)
    console.log(chalk.blue('you select the server:' + config.name));
    config.backup && await compressFile(config.targetDir, config.targetFile)
    await connectServer(config.ssh)
    await uploadFiles(ssh, config)
  } catch (err) {
    console.log(chalk.red(err));
  } finally {
    process.exit()
  }
}

main()
