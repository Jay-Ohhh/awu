import { useState, FC } from "react";
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

  return (
    <div className={styles.container}>
      <img className={styles.avatar} src={avatar}></img>
      <div className={styles["login-btn"]}>
        <Button
          size="large"
          color="#5dcbb5"
          round
          onClick={() => {
            showAuthWindow({
              path: douyinLoginUrl,
              callback: (params) => {
                console.log(params);
              }
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
