import { FC, ReactElement, useEffect, CSSProperties } from 'react';
import { Provider } from 'react-redux';
import { useStore } from './store';
import Taro from '@tarojs/taro';
import NavBar, { NavBarProps } from './components/NavBar/NavBar';
import isEmpty from 'lodash/isEmpty';
import './app.scss';
import './assets/font/iconfont.css';

const navBarItems: NavBarProps['items'] = [
  {
    key: 'index',
    icon: <span className='iconfont icontubiaozhizuomoban-' style={{ fontSize: 30 }} />,
    title: '首页',
    onClick: () => {
      Taro.navigateTo({
        url: '/pages/index/index'
      });
    }
  },
  {
    key: 'comment',
    icon: <span className='iconfont iconhot' style={{ fontSize: 30 }} />,
    title: '测评',
    onClick: () => {
      Taro.navigateTo({
        url: '/pages/evaluationForm/index'
      });
    }
  },
  {
    key: 'contribution',
    icon: <span className='iconfont icontougao' style={{ fontSize: 30 }} />,
    title: '投稿'
  },
  {
    key: 'profile',
    icon: <span className='iconfont icon31wode' style={{ fontSize: 28 }} />,
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

const App: FC<{ children: ReactElement; }> = function (props) {
  const store = useStore();

  useEffect(() => {
    const tiktokUserInfo = store.getState().tiktokUserInfo;
    if (isEmpty(tiktokUserInfo)) {
      let json: any = localStorage.getItem("tiktokCredential");

      if (!json)
        return;

      json = JSON.parse(json);


      if (json.openId && json.refresh_token < Date.now()) {
        // 获取用户信息
        // store.dispatch({ type: "set_tiktokUserInfo", userInfo: {} });
      }
    }
  }, []);

  return (
    <Provider store={store}>
      {props.children}
      <NavBar items={navBarItems} containerStyle={navBarStyle} />
    </Provider>
  );
};

export default App;
