import { useState, FC } from "react";
import { Button, Field } from "@antmjs/vantui";
import avatar from '../../assets/images/avatar.svg';
import styles from './index.module.scss';

const Profile: FC = (props) => {
  const [code, setCode] = useState('');

  return (
    <div className={styles.container}>
      <img className={styles.avatar} src={avatar}></img>
      <div className={styles["login-btn"]}>
        <Button size="large" color="#5dcbb5" round>
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
