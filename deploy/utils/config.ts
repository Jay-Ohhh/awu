import path from 'path';
import { Config } from 'node-ssh';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config({
  path: path.join(process.cwd(), '.env.production')
});

/**
 * name: 命令行提示信息
 * ssh: 连接服务器用户信息
 * targetDir: 需要压缩的文件目录（启用本地压缩后生效），相对项目根目录路径
 * targetFile: 指定上传文件名称（目标文件），相对项目根目录路径
 * compress: 是否压缩，关闭后，将跳过本地文件压缩，直接上传同级目录下指定文件
 * backUp: 是否远端备份，开启后，若远端存在相同目录，则会修改原始目录名称，不会直接覆盖
 * deployDir: 指定远端部署地址
 */
export type DeployConfig = {
  name: string;
  ssh: Config,
  targetDir: string;
  targetFile: string;
  deployDir: string;
  compress?: boolean;
  backup?: boolean;
};

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const USERNAME = process.env.USERNAME;
const DEPLOY_DIR = process.env.DEPLOY_DIR;

if (!DEPLOY_DIR) {
  console.log(chalk.red('Need to set DEPLOY_DIR in .env.production'));
  process.exit();
}

const deployConfigs: DeployConfig[] = [
  {
    name: 'treedeep',
    ssh: {
      host: HOST,
      port: PORT ? Number(PORT) : null,
      username: USERNAME,
      // password: '',
      // privateKey: 'E:/id_rsa', // ssh私钥(不使用此方法时请勿填写， 注释即可)
      // passphrase: '123456' // ssh私钥对应解密密码(不存在设为''即可)
    },
    targetDir: 'dist', // 目标压缩目录
    targetFile: `dist.zip`, // 目标文件
    deployDir: DEPLOY_DIR, // 远端目录
  }
];

export { deployConfigs };
