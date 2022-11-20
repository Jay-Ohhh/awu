import Taro from '@tarojs/taro';

const env = Taro.getEnv();
/** @deprecated use isBrowser */
export const isWeb = env === Taro.ENV_TYPE.WEB;

type ShowAuthWindowOptions = {
  path: string;
  windowName?: string;
  windowFeatures?: string;
};

//Authorization popup window code
export function showAuthWindow(options: ShowAuthWindowOptions) {
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

export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export type User = {
  id: string;
  nickname: string;
  openId: string;
  refreshExpiresIn: number;
  blogger?: boolean;
  avatar?: string;
  city?: string;
  province?: string;
  country?: string;
  description?: string;
  e_account_role?: string;
  error_code?: string;
  gender?: string;
  union_id?: string;
};

export function getCurrentUser(): User | null {
  if (!isBrowser) {
    return null;
  }

  if (!window["tiktokUserInfo"]) {
    const json = sessionStorage.getItem("tiktokUserInfo");

    if (json) {
      window["tiktokUserInfo"] = JSON.parse(json);
    }
  }

  return window["tiktokUserInfo"] || null;
}

export function isUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function readBinary(text: string) {
  const arrayBuffer = new ArrayBuffer(text.length);
  const ui8a = new Uint8Array(arrayBuffer, 0);

  for (let i = 0; i < text.length; i++) {
    ui8a[i] = (text.charCodeAt(i) & 0xff);
  }

  return ui8a;
}
