import Taro from '@tarojs/taro'

const env = Taro.getEnv()
const isWeb = env === Taro.ENV_TYPE.WEB

export { isWeb }
