import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import chalk from 'chalk'

function compressFile(targetDir: string, targetFile: string) {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue('\n' + 'compressing...'))
    // create a file to stream archive data to.
    const output = fs.createWriteStream(path.join(
      process.cwd(),
      targetFile
    ))
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', function () {
      resolve(console.log(chalk.blue(
        'compression succeeded. Total size: ' +
        chalk.bold((archive.pointer() / 1024 / 1024).toFixed(2) + 'MB')
      )))
    });

    output.on('error', (err) => {
      reject(console.error('\n' + 'compression failed', err))
      process.exit()
    })

    archive.on('error', function (err) {
      console.error('\n' + 'compression failed', err)
      process.exit()
    });

    // pipe archive data to the file
    archive.pipe(output)
    // Appends a directory and its files, recursively
    archive.directory(targetDir, false)
    // finalize the archive (we are done appending files
    // but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after
    // calling this method so register to them beforehand.
    archive.finalize()
  })
}

export { compressFile }
