import { useState, FC, CSSProperties, useEffect } from "react";
import clsx from "clsx";
import styles from './NavBar.module.scss';

export type NavBarProps = {
  items: {
    key: string;
    icon?: React.ReactNode;
    title?: React.ReactNode;
    disabled?: boolean;
    onClick?: (activeKey: string) => void;
  }[];
  activeKey?: string;
  activeColor?: string;
  inactiveColor?: string;
  containerStyle: CSSProperties;
};

const NavBar: FC<NavBarProps> = (props) => {
  const {
    items,
    containerStyle,
    activeKey: _activeKey,
    activeColor = '#5dcbb5',
    inactiveColor = '#666',
  } = props;
  const [activeKey, setActiveKey] = useState<string>(_activeKey || items[0].key);

  useEffect(() => {
    if (_activeKey && _activeKey !== activeKey) {
      setActiveKey(_activeKey);
    }
  }, [_activeKey]);

  return (
    <div className={styles.container} style={containerStyle}>
      {items.map(item => {
        const isActive = item.key === activeKey;
        const color = isActive ? activeColor : inactiveColor;
        return (
          <div
            key={item.key}
            className={clsx(styles.item, item.disabled && styles.disabled)}
            onClick={item.disabled ? undefined : () => {
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
