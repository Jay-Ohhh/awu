import { useState, FC, CSSProperties } from "react";
import styles from './NavBar.module.scss';

export type NavBarProps = {
  items: {
    icon?: React.ReactNode;
    title?: React.ReactNode;
    key: string;
    onClick?: (activeKey: string) => void;
  }[];
  activeColor?: string;
  inactiveColor?: string;
  containerStyle: CSSProperties;
};

const NavBar: FC<NavBarProps> = (props) => {
  const { items,
    containerStyle,
    activeColor = '#5dcbb5',
    inactiveColor = '#666',
  } = props;
  const [activeKey, setActiveKey] = useState<string>(items[0].key);

  return (
    <div className={styles.container} style={containerStyle}>
      {items.map(item => {
        const isActive = item.key === activeKey;
        const color = isActive ? activeColor : inactiveColor;
        return (
          <div
            key={item.key}
            className={styles.item}
            onClick={() => {
              item.onClick?.(activeKey);
              setActiveKey(item.key);
            }}
          >
            <span className="icon" style={{ color }}>{item.icon}</span>
            <div className="title" style={{ color }}>{item.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default NavBar;
