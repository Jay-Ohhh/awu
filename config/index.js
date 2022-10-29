const pxtransform = require('postcss-pxtransform');
const path = require("path");
const dotenv = require("dotenv");

const result = dotenv.config({
  path: path.join(process.cwd(), '.env')
});

if (result.error) {
  throw result.error;
}

const { parsed } = result;
const customEnv = {};

for (let k in parsed) {
  customEnv[k] = JSON.stringify(parsed[k]);
}

const config = {
  projectName: 'awu',
  date: '2022-7-30',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  env: {
    ...customEnv,
  },
  plugins: [],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  compiler: 'webpack5',
  cache: {
    enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    webpackChain(chain) {
      const lessRule = chain.module.rules.get('less');
      const lessRuleCfg = {
        test: /@antmjs[\\/]vantui(.+?)\.less$/,
        oneOf: [
          {
            use: [],
          },
        ],
      };
      lessRule.toConfig().oneOf[0].use.map((use) => {
        if (/postcss-loader/.test(use.loader)) {
          const newUse = {
            loader: use.loader,
            options: {
              sourceMap: use.options.sourceMap,
              postcssOptions: {
                plugins: [],
              },
            },
          };
          use.options.postcssOptions.plugins.map((xitem) => {
            if (xitem.postcssPlugin === 'postcss-pxtransform') {
              newUse.options.postcssOptions.plugins.push(
                pxtransform({
                  platform: process.env.TARO_ENV,
                  designWidth: 750,
                  deviceRatio: {
                    640: 2.34 / 2,
                    750: 1,
                    828: 1.81 / 2,
                  },
                  selectorBlackList: [],
                }),
              );
            } else {
              newUse.options.postcssOptions.plugins.push(xitem);
            }
          });
          lessRuleCfg.oneOf[0].use.push({ ...newUse });
        } else {
          lessRuleCfg.oneOf[0].use.push({ ...use });
        }
      });
      chain.module.rule('vantuiLess').merge(lessRuleCfg);
      lessRule.exclude.clear().add(/@antmjs[\\/]vantui/);
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: [/@antmjs[\\/]vantui/],
    devServer: {
      host: "127.0.0.1", // localhost
      port: 9000,
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      pxtransform: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  rn: {
    appName: 'taroDemo',
    postcss: {
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
      }
    }
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
