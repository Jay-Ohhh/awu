import React, { FC, ReactElement, useState, useEffect, CSSProperties } from 'react';
import { Provider } from 'react-redux';
import { useStore } from './store';
import Taro, { eventCenter } from '@tarojs/taro';
import NavBar, { NavBarProps } from './components/NavBar/NavBar';
import isEmpty from 'lodash/isEmpty';
import { api } from './api';
import { useTiktokUser } from './store';
import { request } from './utils/request';
import { history } from '@tarojs/router';
import './app.scss';
import './assets/font/iconfont.css';

const _navBarItems: (NavBarProps['items'][0] & { needAuth?: boolean; })[] = [
  {
    key: 'index',
    icon: <span className='iconfont icontubiaozhizuomoban-' style={{ fontSize: 26 }} />,
    title: '首页',
    onClick: () => {
      Taro.navigateTo({
        url: '/pages/index/index'
      });
    }
  },
  {
    key: 'evaluationForm',
    icon: <span className='iconfont iconhot' style={{ fontSize: 26 }} />,
    title: '测评',
    needAuth: true,
    onClick: () => {
      Taro.navigateTo({
        url: '/pages/evaluationForm/index'
      });
    }
  },
  {
    key: 'contribution',
    icon: <span className='iconfont icontougao' style={{ fontSize: 26 }} />,
    title: '投稿',
    needAuth: true,
  },
  {
    key: 'profile',
    icon: <span className='iconfont icon31wode' style={{ fontSize: 24 }} />,
    title: '我的',
    onClick: () => {
      Taro.navigateTo({
        url: '/pages/profile/index'
      });
    }
  },
];

const navBarStyle: CSSProperties = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  boxSizing: 'border-box',
  height: 50,
  paddingBottom: 5
};

const NabBarContainer: FC = React.memo(() => {
  const { tiktokUserInfo } = useTiktokUser();
  const [activeKey, setActiveKey] = useState(location.hash.split('/')[2]);
  let navBarItems = _navBarItems;

  if (isEmpty(tiktokUserInfo)) {
    navBarItems = navBarItems.filter(item => !item.needAuth);
  }

  useEffect(() => {
    const handleRouteChange = ({ toLocation }: { toLocation: { path: string; }; }) => {
      if (toLocation.path !== activeKey) {
        setActiveKey(toLocation.path.split('/')[2]);
      }
    };

    eventCenter.on('__taroRouterChange', handleRouteChange);

    return () => {
      eventCenter.off('__taroRouterChange', handleRouteChange);
    };
  }, []);

  return (
    <>
      <NavBar activeKey={activeKey} items={navBarItems} containerStyle={navBarStyle} />
    </>
  );
});

const App: FC<{ children: ReactElement; }> = function (props) {
  const store = useStore();

  useEffect(() => {
    (async () => {
      const tiktokUserInfo = store.getState().tiktokUserInfo;
      if (isEmpty(tiktokUserInfo)) {
        let json: any = localStorage.getItem("tiktokCredential");

        if (!json) {
          if (!["/pages/index/index", "/pages/profile/index"].includes(history.location.pathname)) {
            Taro.redirectTo({
              url: "/pages/index/index"
            });
          }

          return;
        }

        json = JSON.parse(json);

        if (json.openId && json.refreshExpiresIn > Date.now()) {
          const res = await request(api.getUserInfo({
            openId: json.openId
          }));

          if (!res.code && res.data) {
            store.dispatch({
              type: "set_tiktokUserInfo",
              userInfo: {
                ...res.data.user,
                refreshExpiresIn: res.data.refreshExpiresIn
              }
            });
          }
        }
      }
    })();
  }, []);

  return (
    <Provider store={store}>
      {props.children}
      <NabBarContainer />
    </Provider>
  );
};

export default App;
