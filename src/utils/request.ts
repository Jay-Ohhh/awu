import Taro, { Chain } from '@tarojs/taro';

/** @see https://docs.taro.zone/docs/envs#1-%E5%9C%A8%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%92%8C-h5-%E7%AB%AF%E5%88%86%E5%88%AB%E5%BC%95%E7%94%A8%E4%B8%8D%E5%90%8C%E8%B5%84%E6%BA%90 */
// 不要解构 process.env 来获取环境变量，请直接以完整书写的方式（process.env.TARO_ENV）来进行使用。
// 不允许直接使用 process, process.env，只能完整书写
const baseURL = process.env.BASE_URL;

let isRefresh = false;
let access_token: string = '';
let refresh_token: string = '';
let reTryRequestList: ((token: string) => void)[] = [];

const getTokenConfig: Taro.request.Option = {
  url: "https://www.treedeep.cn/oauth/token?grant_type=password&username=admin&password=admin",
  method: "POST",
  header: {
    Authorization: "Basic YXd1d2VhcHBhZG1pbjpZWGQxZDJWaGNIQTZZWEJ3V1RKNGNFQmFWelVoTUU="
  }
};

const refreshTokenConfig: Taro.request.Option = {
  url: `http://www.treedeep.cn/oauth/token?grant_type=refresh_token&refresh_token=${refresh_token}`,
  method: "POST",
  header: {
    Authorization: "Basic YXd1d2VhcHBhZG1pbjpZWGQxZDJWaGNIQTZZWEJ3V1RKNGNFQmFWelVoTUU="
  }
};

async function refreshToken() {
  const { data } = await Taro.request(refreshTokenConfig);
  access_token = data.access_token;
  refresh_token = data.refresh_token;
}

const interceptor = async function (chain: Chain) {
  const requestParams = chain.requestParams;
  const config = !access_token ? getTokenConfig : null;

  if (config) {
    return chain.proceed(config).then(res => {
      access_token = res.data.access_token;
      refresh_token = res.data.refresh_token;
      return chain.proceed({
        ...requestParams,
        header: {
          ...requestParams.header,
          Authorization: `Bearer ${access_token}`
        }
      }).then(res1 => res1);
    });
  }
  return chain.proceed(requestParams).then(res1 => res1);
};

async function request<T = any>(options: Taro.request.Option<any, any>): Promise<T> {
  const config: Taro.request.Option<any, any> = {
    ...options,
    url: baseURL + options.url,
    header: {
      ...options.header,
      // Authorization: `Bearer ${access_token}`
    }
  };
  // Taro.addInterceptor(interceptor)
  const { data } = await Taro.request(config);
  if (data.error === "invalid_token") {
    const promise = new Promise((resolve) => {
      reTryRequestList.push(
        (newToken) => resolve(Taro.request({
          ...config,
          header: {
            ...options.header,
            Authorization: `Bearer ${newToken}`
          }
        })) // 要使用最新的token
      );
    });
    if (!isRefresh) {
      try {
        isRefresh = true;
        await refreshToken();
      } finally {
        isRefresh = false;
      }
    }
    while (reTryRequestList.length > 0) {
      const cb = reTryRequestList.shift();
      cb?.(access_token);
    }

    return promise as Promise<T>;
  }
  return data;
}

export { request };
