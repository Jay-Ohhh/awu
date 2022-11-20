import { useState, FC, useEffect, useRef } from "react";
import { Button, Field } from "@antmjs/vantui";
import Taro from "@tarojs/taro";
import { showAuthWindow } from "../../utils/tools";
import avatar from '../../assets/images/avatar.svg';
import styles from './index.module.scss';
import { DOUYIN_CLIENT_KEY, env } from "../../utils/constant";
import { useTiktokUser } from "../../store";
import isEmpty from "lodash/isEmpty";
import clsx from 'clsx';
import { api } from "../../api";
import { request } from "../../utils/request";
import isMobile from "ismobilejs";

// const douyinRedirectUrl = "https://www.treedeep.cn/awu/rest/callback/douyin?bzsqm=123456";
const douyinRedirectUrl = "https://www.treedeep.cn";
const douyinLoginUrl = 'https://open.douyin.com/platform/oauth/connect?' +
  `client_key=${DOUYIN_CLIENT_KEY}&response_type=code&scope=user_info,trial.whitelist&` +
  `redirect_uri=${douyinRedirectUrl}&state=${env}`;

const Profile: FC = () => {
  const [bloggerCode, setBloggerCode] = useState('');
  const authWindowRef = useRef<Window>();
  const { tiktokUserInfo, setTiktokUserInfo, clearTiktokUserInfo } = useTiktokUser();
  const isLogin = !isEmpty(tiktokUserInfo);
  const _isMobile = isMobile(window.navigator).any;

  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data.code && !_isMobile) {
        window.removeEventListener("message", handleMessage);
        authWindowRef.current?.close();

        const params: Parameters<typeof api.getUserInfo>[0] = { code: e.data.code, };
        const _bloggerCode = bloggerCode.trim();

        if (_bloggerCode) {
          params.bloggerCode = _bloggerCode;
        }
        try {
          const res = await request(api.getUserInfo(params));

          if (res.code === "2000" && res.result) {
            setTiktokUserInfo({
              ...res.result.user,
              refreshExpiresIn: res.result.refreshExpiresIn
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return !isLogin ? (
    <div className={styles.loginContainer}>
      <img className={styles.avatar} src={avatar}></img>
      <div className={styles["login-btn"]}>
        <Button
          size="large"
          color="#5dcbb5"
          round
          onClick={() => {
            if (_isMobile) {
              location.href = douyinLoginUrl;
            } else {
              authWindowRef.current = showAuthWindow({
                path: douyinLoginUrl,
              });
            }
          }}
        >
          <span className="iconfont icondouyin"></span>
          <span className={styles['btn-text']}>抖音登录</span>
        </Button>
      </div>
      <div className={styles.form}>
        <Field
          value={bloggerCode}
          placeholder="授权码"
          border
          onChange={(e) => {
            localStorage.setItem("bloggerCode", e.detail);
            setBloggerCode(e.detail);
          }}
        />
      </div>
      <span className={styles['helper-text']}>博主首次登录需输入授权码</span>
    </div>
  ) : (
    <div className={styles.profileContainer}>
      <div className={clsx('v-center', styles.avatarContainer)}>
        <img className={styles.avatar} src={tiktokUserInfo.avatar || avatar} alt="user-avatar" />
        <span className={clsx("text-ellipsis", styles.nickname)}>{tiktokUserInfo.nickname}</span>
        {tiktokUserInfo.blogger ? <span className={styles["tag"]}>博主</span> : null}
      </div>
      <div className={styles.group}>
        <div
          className={styles.itemContainer}
          onClick={() => {
            Taro.navigateTo({
              url: "pages/evaluations/index"
            });
          }}
        >
          <span>我的提单</span>
          <span className="iconfont iconyou"></span>
        </div>
        <div
          className={styles.itemContainer}
          onClick={() => {
            Taro.navigateTo({
              url: "pages/myGoodsSubmissions/index"
            });
          }}
        >
          <span>我的投稿</span>
          <span className="iconfont iconyou"></span>
        </div>
      </div>
      <div
        className={styles.itemContainer}
        style={{
          justifyContent: "center",
          marginTop: 10
        }}
        onClick={clearTiktokUserInfo}
      >
        退出登录
      </div>
    </div >
  );
};

export default Profile;
