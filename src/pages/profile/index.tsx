import { useState, FC, useEffect, useRef } from "react";
import { Button, Field } from "@antmjs/vantui";
import { showAuthWindow } from "../../utils/tools";
import avatar from '../../assets/images/avatar.svg';
import styles from './index.module.scss';
import { DOUYIN_CLIENT_KEY, env } from "../../utils/constant";

const douyinRedirectUrl = "https://www.treedeep.cn";
const douyinLoginUrl = 'https://open.douyin.com/platform/oauth/connect?' +
  `client_key=${DOUYIN_CLIENT_KEY}&response_type=code&scope=user_info&redirect_uri=${douyinRedirectUrl}&state=${env}`;

const Profile: FC = (props) => {
  const [code, setCode] = useState('');
  const authWindowRef = useRef<Window>();

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data.code) {
        window.removeEventListener("message", handleMessage);
        authWindowRef.current?.close();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className={styles.container}>
      <img className={styles.avatar} src={avatar}></img>
      <div className={styles["login-btn"]}>
        <Button
          size="large"
          color="#5dcbb5"
          round
          onClick={() => {
            authWindowRef.current = showAuthWindow({
              path: douyinLoginUrl,
            });
          }}
        >
          <span className="iconfont icondouyin"></span>
          <span className={styles['btn-text']}>抖音登录</span>
        </Button>
      </div>
      <div className={styles.form}>
        <Field
          value={code}
          placeholder="授权码"
          border
          onChange={(e) => setCode(e.detail)}
        />
      </div>
      <span className={styles['helper-text']}>博主首次登录需输入授权码</span>
    </div>
  );
};

export default Profile;
