import React, { FC, CSSProperties, useState, useEffect, useRef } from "react";
import clsx from 'clsx';
import './index.scss';

type FloatingButtonProps = {
  content: React.ReactNode;
  translateX?: string;
  placement?: "tr" | "tl" | "br" | "bl";
  className?: string;
  containerStyle?: CSSProperties;
  offset?: number | string;
  onContentClick?: (e: React.MouseEvent) => void;
  open?: boolean;
};

const FloatingButton: FC<FloatingButtonProps> = ({
  content,
  placement = "br",
  className,
  translateX,
  containerStyle: _containerStyle,
  offset = 100,
  open: _open,
}) => {
  const [open, setOpen] = useState(false);
  const containerStyle: CSSProperties = {};

  if (_open === false) {
    containerStyle.transform = `translateX(${translateX})`;
  } else if (!open) {
    containerStyle.transform = `translateX(${translateX})`;
  }

  if (placement[0] === "t") {
    containerStyle.top = offset;
  } else if (placement[0] === "b") {
    containerStyle.bottom = offset;
  }

  if (placement[1] === "r") {
    containerStyle.right = 0;
  } else if (placement[1] === "l") {
    containerStyle.left = 0;
  }

  useEffect(() => {
    if (_open === undefined || _open === null) {

      const handleClick = () => {
        setOpen(false);
      };

      document.addEventListener("click", handleClick);

      return () => {
        document.removeEventListener("click", handleClick);
      };
    }
  }, []);

  return (
    <div
      className={clsx(
        "floating-button-root", "fixed", "z-10", "shadow-md", "transition-transform",
        className
      )}
      style={{ ...containerStyle, ..._containerStyle }}
      onClick={(e) => {
        e.stopPropagation();

        if (!open && e.currentTarget === e.target) {
          setOpen(true);
        }
      }}
    >
      <button>
        {content}
      </button>
    </div>
  );
};

export default FloatingButton;
