import Taro from '@tarojs/taro';

const env = Taro.getEnv();
const isWeb = env === Taro.ENV_TYPE.WEB;

type ShowAuthWindowOptions = {
  path: string;
  windowName?: string;
  windowFeatures?: string;
};

//Authorization popup window code
function showAuthWindow(options: ShowAuthWindowOptions) {
  const {
    path,
    windowName = 'ConnectWithOAuth',
    windowFeatures = `
    location=0,
    status=0,
    left=${window.screenLeft + window.outerWidth / 2 - 400},
    top=${window.screenTop + window.outerHeight / 2 - 300},
    width=800,
    height=600
    `
  } = options;

  const oauthWindow = window.open(path, windowName, windowFeatures);
  if (!oauthWindow)
    return;

  return oauthWindow;
}

export { isWeb, showAuthWindow };
