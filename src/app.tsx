import React, { FC, ReactElement, CSSProperties, useState, useEffect, useMemo } from 'react';
import { Provider } from 'react-redux';
import { useStore } from './store';
import Taro, { eventCenter } from '@tarojs/taro';
import NavBar, { NavBarProps } from './components/NavBar/NavBar';
import ErrorBoundary from './components/ErrorBoundary';
import isEmpty from 'lodash/isEmpty';
import { api } from './api';
import { useTiktokUser } from './store';
import { request } from './utils/request';
import { history } from '@tarojs/router';
import './app.scss';
import './assets/font/iconfont.css';
import isMobile from 'ismobilejs';

const handleNavBarItemClick = (pathname: string) => {
  if (history.location.pathname === pathname)
    return;

  Taro.navigateTo({ url: pathname });
};

const _navBarItems: (NavBarProps['items'][0] & {
  needAuth?: boolean;
  bloggerAuth?: boolean;
})[] = [
    {
      key: 'index',
      icon: <span className='iconfont icontubiaozhizuomoban-' style={{ fontSize: 22 }} />,
      title: '首页',
      onClick: () => {
        handleNavBarItemClick('/pages/index/index');
      }
    },
    {
      key: 'evaluationForm',
      icon: <span className='iconfont iconhot' style={{ fontSize: 22 }} />,
      title: '购买售后',
      needAuth: true,
      onClick: () => {
        handleNavBarItemClick('/pages/evaluationForm/index');
      }
    },
    {
      key: 'goodsSubmissions',
      icon: <span className='iconfont icontougao' style={{ fontSize: 22 }} />,
      title: '商品投稿',
      needAuth: true,
      onClick: () => {
        handleNavBarItemClick('/pages/goodsSubmissions/index');
      }
    },
    // {
    //   key: 'videoSubmissions',
    //   icon: <span className='iconfont iconshipin' style={{ fontSize: 22 }} />,
    //   title: '视频投稿',
    //   needAuth: true,
    //   bloggerAuth: true,
    //   onClick: () => {
    //     handleNavBarItemClick('/pages/videoSubmissions/index');
    //   }
    // },
    {
      key: 'profile',
      icon: <span className='iconfont icon31wode' style={{ fontSize: 20 }} />,
      title: '我的',
      onClick: () => {
        handleNavBarItemClick('/pages/profile/index');
      }
    },
  ];

const navBarStyle: CSSProperties = {
  height: 50,
  paddingBottom: 5
};

const NabBarContainer: FC = React.memo(() => {
  const { tiktokUserInfo } = useTiktokUser();
  const [activeKey, setActiveKey] = useState(location.hash.split('/')[2]);
  const navBarItems = useMemo(() => {
    if (isEmpty(tiktokUserInfo)) {
      return _navBarItems.filter(item => !item.needAuth);
    } else {
      return _navBarItems.filter(item => {
        if (item.bloggerAuth) {
          return tiktokUserInfo.blogger;
        }

        return item;
      });
    }
  }, [tiktokUserInfo]);

  useEffect(() => {
    const handleRouteChange = ({ toLocation }: { toLocation: { path: string; }; }) => {
      if (isEmpty(tiktokUserInfo) &&
        !["/pages/index/index", "/pages/profile/index"].includes(history.location.pathname)
      ) {
        location.href = location.origin + location.pathname;

        return;
      }

      if (toLocation.path !== activeKey) {
        setActiveKey(toLocation.path.split('/')[2]);
      }
    };

    eventCenter.on('__taroRouterChange', handleRouteChange);

    return () => {
      eventCenter.off('__taroRouterChange', handleRouteChange);
    };
  }, [tiktokUserInfo]);

  return (
    <>
      <NavBar activeKey={activeKey} items={navBarItems} containerStyle={navBarStyle} />
    </>
  );
});

const Auth: FC<{ children: React.ReactElement; }> = React.memo((props) => {
  const { tiktokUserInfo } = useTiktokUser();

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        width: "100%",
        display: (isEmpty(tiktokUserInfo) &&
          !["/pages/index/index", "/pages/profile/index"].includes(history.location.pathname)
        ) ? "none" : "block",
      }}>
      {props.children}
    </div>
  );
});

const App: FC<{ children: ReactElement; }> = function (props) {
  const store = useStore();

  useEffect(() => {
    const setDocHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
    };
    window.addEventListener("resize", setDocHeight);
    setDocHeight();

    return () => {
      window.removeEventListener("resize", setDocHeight);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const tiktokUserInfo = store.getState().tiktokUserInfo;
      const searchParams = new URL(location.href).searchParams;
      const code = searchParams.get("code");
      const bloggerCode = localStorage["bloggerCode"];
      const params: Parameters<typeof api.getUserInfo>[0] = {};

      if (code && isMobile(window.navigator).any) {
        code && (params.code = code);
        bloggerCode && (params.bloggerCode = bloggerCode);
        localStorage.removeItem("bloggerCode");
      } else if (isEmpty(tiktokUserInfo)) {
        let json: any = localStorage["tiktokCredential"]
          ? JSON.parse(localStorage["tiktokCredential"])
          : null;

        if (!json)
          return;

        if (json.userId && json.refreshExpiresIn > Date.now()) {
          params.userId = json.userId;
        }
      }

      if (!isEmpty(params)) {
        const res = await request(api.getUserInfo(params));

        if (["2000", "5001"].includes(res.code) && res.result) {
          window.history.replaceState({}, "", location.origin + location.pathname + location.hash);

          store.dispatch({
            type: "set_tiktokUserInfo",
            userInfo: {
              ...res.result.user,
              refreshExpiresIn: res.result.refreshExpiresIn
            }
          });
        }
      }
    })();
  }, []);

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <Auth>
          {props.children}
        </Auth>
        <NabBarContainer />
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
