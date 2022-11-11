import React, { FC, useEffect, useState, useRef, memo } from 'react';
import Taro, { usePageScroll } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import VirtualList from '@tarojs/components/virtual-list';
import { Tab, Tabs, Loading, Image, Field, Toast } from '@antmjs/vantui';
import { PullRefresh } from "@taroify/core";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import './index.scss';
import { isWeb } from '../../utils/tools';
import { request } from '../../utils/request';
import { list } from '../../api';

const FilterValue: any = {};
(function (obj) {
  obj[obj["YIFU"] = "姐妹测评"] = "YIFU";
  obj[obj["AWU"] = "阿吴测评"] = "AWU";
  obj[obj["QITA"] = "其他测评"] = "QITA";
})(FilterValue);

const tabList: { title: string; }[] = [
  { title: FilterValue.AWU },
  { title: FilterValue.YIFU },
  { title: FilterValue.QITA },
  { title: '参与投稿' },
];

type ItemProps = {
  id: string | number;
  image: string;
  videoSrc: string;
  productSrc: string;
  videoScheme: string;
  productScheme: string;
  product: string;
  qualityImgUrl: string;
  copyWriting: string;
};

const maskValue = `一、喜欢的衣服阿吴来不及测，可以直接购买。衣服质量不错，是自己的梦中情衣，就可以拍成测评视频分享给姐妹们。

二、视频要求如下：
1．开头
（1）可以和阿吴一样，看卖家宣传开头，开头一般不要超过8秒
（2）也可以口播开头，点明主题
（3）还可以按照自己的方式开头，但要求简单明了，有吸引力
2．测评
（1）应该用清晰的镜头，让大家可以看清楚面料和细节
（2）尽量囊括大家关心的指标，包括：面料，做工，吸汗，透气，易皱，粘毛，起球，静电，掉色，缩水，变形，掉档，显苦茶子等等（根据衣服不同增减）
（3）每个指标的展现一般不超过4秒，避免视频枯燥和冗长
（4）文案简单明了
（5）上身效果要能展现衣服的全貌，建议尽量露脸（可带口罩，用后置摄像头，不能使用美颜滤镜拉腿）
（6）可以加入自己的幽默感，让视频有趣
（7）剪辑注意细节，尽可能制作精良，避免给人粗糙感
3．结尾
（1）尽可能用检测报告结尾
（2）检测报告文案简单明了
（3）特殊情况可以用其他方式结尾

三、视频剪辑好后直接发到邮箱3304739058@qq.com进行审核。审核通过后，会发布到 阿吴和他的姐妹们 这个抖音号，并收录到我们的测评库（测评库是 ${location.origin + location.pathname}）
邮件格式为：
1.标题：【测评投稿】xxxx（衣服名）
2.邮件内容需要带上：
（1）手机号（能加V信给你发红包）
（2）抖音号和抖音名（其他平台的也可以，需注明平台）
（3）卖家秀视频链接（如果有引用的话）
（4）商品链接
（5）订单截图
四、视频一旦审核通过并采用，由阿吴承担衣服费用。没通过会回复邮件告知原因，可修改再次投稿。（目前试验阶段，审核会比较慢，以后会加快）

注：拍摄方式按照阿吴拍摄的手法的方式，通过率会加大，一定要有大家关心的指标面料，做工，吸汗，透气，易皱，粘毛，起球，静电，掉色，缩水，变形，掉档，显苦茶子等等（根据衣服不同增减）
`;


const TAOBAO_URL = 'https://market.m.taobao.com/app/fdilab/download-page/main/index.html';
const DOUYIN_URL = 'https://www.douyin.com/home';
const PINDUODUO_URL = 'https://lp.pinduoduo.com/poros/h5?ads_channel=baidu_seo&exp_id=115659&page_uid=85d568592f4e4496829fc9d3440f32d7-';
const urlScheme: {
  downloadUrl: string;
  schema: string;
}[] = [
    {
      downloadUrl: TAOBAO_URL,
      schema: 'taobao://'
    },
    {
      downloadUrl: DOUYIN_URL,
      schema: 'snssdk1128://'
    },
    {
      downloadUrl: PINDUODUO_URL,
      schema: 'pinduoduo://'
    },
  ];

const List: FC<{
  items: ItemProps[],
  actions: {
    setImgOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setImgIndex: React.Dispatch<React.SetStateAction<number>>;
  };
}> = memo(({ items, actions }) => {
  const { setImgOpen, setImgIndex } = actions;

  function toast(url: string) {
    let link: string = '';
    const flag = urlScheme.some(item => {
      if (url.startsWith(item.schema)) {
        link = item.downloadUrl;
        return true;
      }
      return false;
    });

    if (flag) {
      Toast.show({
        message: (
          <View>
            若未跳转应用，
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer nofollow"
              style={{ color: "#5ea7f8", textDecoration: "underline" }}
            >
              请先点击此链接下载应用
            </a>
          </View>
        ),
        duration: 2000,
      });
    }
  }

  return (
    <>
      {items.map((item, index) => (
        <View className='list-item' key={item.id}>
          <a
            href={item.videoScheme}
          // onClick={() => {
          //   toast(item.videoScheme)
          // }}
          >
            <Image src={item.image} width={150} height={200} fit='cover' lazyLoad radius={8} />
          </a>
          <View className="content-container">
            {isWeb ? (
              <a
                className='content'
                href={item.videoScheme}
              // onClick={() => {
              //   toast(item.videoScheme)
              // }}
              >
                {item.copyWriting}
              </a>
            ) : (
              <View className='content'>{item.copyWriting}</View>
            )}
            <View className='content-footer'>
              {isWeb ? (
                <a
                  className='link video-item-link'
                  // href={item.productScheme}
                  onClick={() => {
                    if (item.image) {
                      setImgIndex(index);
                      setImgOpen(true);
                    }
                  }}
                >
                  视频商品：{item.product}
                </a>
              ) : (
                <View className='title'>视频商品：{item.product}</View>
              )}
              {item.productSrc ? (
                <View
                  className='link copy-link'
                  onClick={(e) => {
                    e.preventDefault();
                    Taro.setClipboardData({
                      data: item.productSrc,
                      success: isWeb ? () => {
                        Toast.show({
                          message: "内容已复制",
                          duration: 1000,
                        });
                      } : undefined
                    });
                  }}
                >
                  复制链接
                </View>
              ) : null}
            </View>
          </View>
        </View >
      ))}
    </>
  );
});

const List1: FC<{
  id: string,
  index: number,
  style: React.CSSProperties,
  data: ItemProps;
}> = memo(({ id, index, data, style }) => {
  const item = data[index];
  return <View id={id} key={item.id} className='list-item' style={style} onClick={() => {
  }}
  >
    <Image src={item.image} width={150} height={200} fit='cover' lazyLoad radius={8} />
    <View className="content-container">
      <View className='content'>{item.copyWriting}</View>
      <View className='content-footer'>
        <View className='title'>{item.product}</View>
        <View className='link' onClick={(e) => {
          e.preventDefault();
          Taro.setClipboardData({ data: item.videoSrc });
        }}
        >复制链接</View>
      </View>
    </View>
  </View>;
});

const Draft: FC = memo(() => {
  return <View className='draft-page'>
    <View className='header'>参与投稿(规则说明)</View>
    <View className='title'>标题：投稿计划</View>
    <View className={isWeb ? 'textarea-container is-web' : 'textarea-container'}>
      <Field
        type='textarea'
        value={maskValue}
        maxlength={2000}
        showWordLimit
        readonly
        autosize={isWeb ? undefined :
          { minHeight: '150px', maxHeight: '360px' }}
      />
    </View>
  </View>;
});

type ImgSrc = {
  mainSrc: string;
  prevSrc?: string;
  nextSrc?: string;
};

const Index: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [reachTop, setReachTop] = useState(true);
  let limit = useRef(10).current;
  const offsetRef = useRef(0);
  const filterValueRef = useRef<string>(FilterValue[tabList[0].title]);
  const isLoadAll = useRef(false);
  const isLoading = useRef(false);
  const [imgOpen, setImgOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const getData = async (config: Taro.request.Option, showLoad = true) => {
    try {
      if (isLoading.current) return;
      showLoad && setLoading(true);
      isLoading.current = true;
      /**
       * 接口不规范：
       * get方法
       * 直接返回了数组数组，而不是 data+total+message，需要通过空数组来判断无数据
       * 前端需要传参字段过多且不必要
       */
      const res = await request(config);
      if (res.result.length === 0) {
        isLoadAll.current = true;
      } else {
        isLoadAll.current = false;
      }
      return res;
    } finally {
      showLoad && setLoading(false);
      isLoading.current = false;
    }
  };

  const handleChange = async (e: any, config: Taro.request.Option, index?: number) => {
    setActiveIndex(index ?? e.detail.index);
    const res = await getData(config);
    if (res.code === "2000" && res.result) {
      setItems(res.result);
    }
  };

  function onPullFresh() {
    if (refresh || isLoading.current) return;
    offsetRef.current = 0;
    (async () => {
      try {
        setRefresh(true);
        const res = await getData(list({
          limit,
          offset: offsetRef.current,
          filterValue: FilterValue[tabList[activeIndex!].title]
        }), false);
        if (res.code === "2000" && res.result) {
          setItems(res.result);
        }
      } finally {
        setRefresh(false);
      }
    })();
  }

  useEffect(() => {
    handleChange(undefined, list({
      limit,
      offset: offsetRef.current,
      filterValue: filterValueRef.current,
    }), 0);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  usePageScroll(({ scrollTop }) => {
    setReachTop(scrollTop === 0);
  });

  function handleScroll(e: Event) {
    if (isLoading.current || isLoadAll.current) return;

    const ele = e.currentTarget as any;
    if (ele.clientHeight + ele.scrollTop >= ele.scrollHeight - 30) {

      offsetRef.current = offsetRef.current + limit;
      getData(list({ limit, offset: offsetRef.current, filterValue: filterValueRef.current }))
        .then(res => {
          if (res.code === "2000" && res.result) {
            setItems(prev => [...prev, ...res.result]);
          }
        });
    }
  }

  return (
    <div style={{ marginBottom: 50 }}>
      <Tabs
        swipeable
        active={activeIndex}
        color='#03ceb4'
        lineWidth={120}
        onChange={(e) => {
          if (e.detail.index === tabList.length - 1) {
            setActiveIndex(e.detail.index);
            return;
          }
          offsetRef.current = 0;
          filterValueRef.current = FilterValue[e.detail.title!];
          handleChange(e, list({
            limit,
            offset: offsetRef.current,
            filterValue: filterValueRef.current,
          }));
        }}
      >
        {
          tabList.map((tab, index) => {
            const windowInfo = Taro.getWindowInfo();
            const listHeight = windowInfo.windowHeight - (isWeb ? 62 : 48);
            return (
              <Tab
                key={index}
                title={tab.title}
              >
                <PullRefresh
                  loading={refresh}
                  reachTop={reachTop}
                  onRefresh={onPullFresh}
                  disabled={activeIndex === tabList.length - 1}
                >
                  <PullRefresh.Pulling>
                    <View className='pull-refresh-text'>释放刷新</View>
                  </PullRefresh.Pulling>
                  <PullRefresh.Loosing>
                    <View className='pull-refresh-text'>释放刷新</View>
                  </PullRefresh.Loosing>
                  <PullRefresh.Loading>
                    <View className='pull-refresh-text'>加载中...</View>
                  </PullRefresh.Loading>
                  <View
                    className={loading ? 'tab-container disable-scroll' : 'tab-container'}
                    style={{ height: isWeb ? "calc(100vh - 118PX)" : "calc(100vh - 100PX)" }}
                    // @ts-ignore
                    onScroll={(isWeb && activeIndex !== tabList.length - 1) ? handleScroll
                      : undefined}
                  >
                    {index < 3 ?
                      <List items={items} actions={{ setImgOpen, setImgIndex }} />
                      // <VirtualList
                      //   height={listHeight} /* 列表的高度 */
                      //   width='100%' /* 列表的宽度 */
                      //   itemData={items} /* 渲染列表的数据 */
                      //   itemCount={items.length} /*  渲染列表的长度 */
                      //   itemSize={103}
                      // >
                      //   {List1}
                      // </VirtualList>
                      : <Draft />}
                    {(isLoadAll.current && items.length
                      && activeIndex !== tabList.length - 1) ?
                      <View className='bottom-text'>已经到底了～</View> :
                      null
                    }
                  </View>
                </PullRefresh>
              </Tab>
            );
          })
        }
      </Tabs>
      {/* {
        loading &&
        <View
          className='flex-center loading-mask'
        >
          <Loading color='#03ceb4' size={70} />
        </View>
      } */}
      <Toast id='toast-id' />
      {imgOpen && items[imgIndex].qualityImgUrl && (
        <Lightbox
          mainSrc={items[imgIndex].qualityImgUrl}
          nextSrc={
            imgIndex !== items.length - 1
              ? items[(imgIndex + 1) % items.length].qualityImgUrl
              : undefined
          }
          prevSrc={
            imgIndex !== 0
              ? items[(imgIndex + items.length - 1) % items.length].qualityImgUrl
              : undefined
          }
          onCloseRequest={() => {
            setImgOpen(false);
          }}
          onMovePrevRequest={() => {
            setImgIndex(prev => (prev + items.length - 1) % items.length);
          }}
          onMoveNextRequest={() => {
            setImgIndex(prev => (prev + items.length + 1) % items.length);
          }}
        />)}
    </div>
  );
};
export default Index;
