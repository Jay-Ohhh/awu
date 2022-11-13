import { FC, useState, useEffect, useRef } from "react";
import { Pagination, Loading, Image } from '@antmjs/vantui';
import { api } from "../../api";
import { request } from "../../utils/request";
import clsx from 'clsx';
import { imageBaseUrl } from "../../utils/constant";
import styles from './index.module.scss';

type ItemProps = {
  id: string;
  status: "verifying" | "verified";
  goodsUrl: string;
  videoUrl: string;
  feedback: string;
  orderPicture: string;
};

const List: FC<{ items: ItemProps[]; }> = (props) => {
  return (
    <ul>
      {props.items.map((item, index) => (
        <li
          key={item.id + index}
          className={clsx(
            styles['item-container'],
            "mb-2 border-b rounded-md bg-white overflow-hidden"
          )}
        >
          <div
            className={clsx(
              styles["item-header"],
              item.status === "verifying" ? styles.primary : styles.warn,
            )}
          >
            {item.status === "verifying" ? "审核中" : "未审核"}
          </div>
          <div className={clsx("flex p-2")}>
            <div className="mr-3">
              <Image
                width={150}
                height={150}
                radius={8}
                fit="cover"
                lazyLoad
                src={imageBaseUrl + item.orderPicture} />
            </div>
            <div>
              <div className="flex">
                <span>商品链接:&nbsp;</span>
                <span className="inline-block truncate">{item.goodsUrl}</span>
              </div>
              <div className="flex">
                <span>视频链接:&nbsp;</span>
                <span className="inline-block truncate">{item.videoUrl}</span>
              </div>
              <div>
                <span>问题反馈: </span>
                <div className={styles.feedback}>{item.feedback}</div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const evaluation: FC = () => {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);
  const limit = 10;
  const offsetRef = useRef(0);

  const getData = async () => {
    setLoading(true);
    const { openId } = JSON.parse(localStorage.tiktokCredential || {});
    try {
      const res = await request(api.getEvaluations({ limit, offset: offsetRef.current, openId }));
      if (res.code === "2000" && res.result) {
        setItems(res.result.data);
        setTotal(res.result.total);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={clsx(styles.root, "flex flex-col p-2 w-full h-full")}>
      <div className="flex justify-center mb-2 pb-1 border-b">
        <Pagination
          modelValue={currentPage}
          pageCount={Math.ceil(total / 10)}
          totalItems={total}
          itemsPerPage="10"
          showPageSize={5}
          onChange={(page) => {
            setCurrentPage(page);
            offsetRef.current = page - 1;
            getData();
          }}
          forceEllipses
          prevText={<span className="iconfont iconzuo" />}
          nextText={<span className="iconfont iconyou" />}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <List items={items} />
      </div>
      {
        loading &&
        <div
          className='flex-center loading-mask'
        >
          <Loading color='#03ceb4' size={70} />
        </div>
      }
    </div>
  );
};

export default evaluation;
