import Taro from '@tarojs/taro';

const env = Taro.getEnv();
const isWeb = env === Taro.ENV_TYPE.WEB;

type ShowAuthWindowOptions = {
  path: string;
  callback: (props: { code: string | null; }) => void;
  windowName?: string;
  windowFeatures?: string;
};

//Authorization popup window code
function showAuthWindow(options: ShowAuthWindowOptions) {
  const {
    path,
    callback,
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

  const handleMessage = e => {
    console.log(e);
    // get access_token via e.data.code
    callback?.(e.data);
    oauthWindow.onmessage = null;
    oauthWindow.window.close();
  };
  oauthWindow.onmessage = handleMessage;

  return oauthWindow;
}

export { isWeb, showAuthWindow };
