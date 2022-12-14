import { FC, useState, useRef } from "react";
import { Field, Uploader, Button, Loading, Notify } from '@antmjs/vantui';
import type { UploaderProps } from '@antmjs/vantui/types/uploader';
import type { ITouchEvent, } from '@tarojs/components';
import { isUrl, readBinary } from "../../utils/tools";
import { api } from "../../api";
import { request, $fetch } from "../../utils/request";
import styles from './index.module.scss';
import { useDebounceFn } from 'ahooks';

type Files = {
  originalFileObj: File;
  size: number;
  type: string;
  thumb: string;
  url: string;
};

const evaluationForm: FC = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errMap, setErrMap] = useState<Record<string, string>>({});
  const [orderImages, setOrderImages] = useState<Files[]>([]);
  // const [orderVideos, setOrderVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const afterImageRead: UploaderProps['onAfterRead'] = (event) => {
    // file is a object if Multiple is false, otherwise it is a array.
    const { file: files, name } = event.detail;

    if (errMap.orderImages) {
      setErrMap((prev) => ({
        ...prev,
        orderImages: ''
      }));
    }
    setOrderImages(orderImages.concat(files));
  };

  const handleDelteImage: UploaderProps['onDelete'] = (event) => {
    const { index } = event.detail;
    const _orderImages = [...orderImages];
    _orderImages.splice(index, 1);
    setOrderImages(_orderImages);
  };

  const { run } = useDebounceFn((e: ITouchEvent, field: string) => {
    let isValid = false;

    if (["goodsUrl", "videoUrl"].includes(field)
      && isUrl(e.detail)
    ) {
      isValid = true;
    } else if (field === "feedback" && e.detail.trim()) {
      isValid = true;
    }

    if (!isValid)
      return;

    if (errMap[field]) {
      setErrMap((prev) => ({
        ...prev,
        [field]: ''
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [field]: e.detail
    }));
  }, {
    wait: 600
  });

  const handleSubmit = async () => {
    let tiktokCredential: any = localStorage.getItem("tiktokCredential");

    if (!tiktokCredential)
      return;

    tiktokCredential = JSON.parse(tiktokCredential);

    let _errMap: Record<string, string> = {};
    const { goodsUrl, videoUrl, feedback } = formData;

    if (!isUrl(goodsUrl)) {
      _errMap.goodsUrl = "??????????????????????????????";
    }
    if (!isUrl(videoUrl)) {
      _errMap.videoUrl = "??????????????????????????????";
    }
    if (!feedback?.trim()) {
      _errMap.feedback = "???????????????";
    }
    if (!orderImages.length) {
      _errMap.orderImages = "???????????????";
    }
    if (Object.keys(_errMap).length) {
      setErrMap(_errMap);
      return;
    }

    setLoading(true);

    Promise.all(orderImages.map((image) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.error) {
            reject(reader.error);
          } else {
            resolve({ file: readBinary(reader.result as string), name: image.originalFileObj.name });
          }
        };

        reader.readAsBinaryString(image.originalFileObj);
      });
    })).then(async (files: { file: Uint8Array, name: string; }[]) => {
      const fileNameSlices = files[0].name.split(".");
      let fileExtension = fileNameSlices[fileNameSlices.length - 1];

      if (!/jpe?g|png|webp/.test(fileExtension)) {
        fileExtension = 'png';
      }

      const formData = new FormData();
      formData.append("files", orderImages[0].originalFileObj);
      const res = await $fetch(api.uploadFiles(formData));
      // console.log("https://treedeep.cn/awu/rest/files?fileRef=" + res.result[0].fileRef);
      if (!(res.code === "2000" && res.result[0]))
        return;

      const res1 = await request(api.postEvaluation({
        userId: tiktokCredential.userId,
        videoUrl,
        goodsUrl,
        feedback,
        orderPicture: res.result[0].fileRef
      }));

      if (res1.code === "2000") {
        setFormData({});
        setOrderImages([]);
        Notify.show({
          message: '????????????',
          type: 'success',
        });
      }

      setLoading(false);
    }).catch((e) => {
      setLoading(false);
      console.error(e);
    });
  };

  // const afterVideoRead: UploaderProps['onAfterRead'] = (event) => {
  //   const { file:_files, name } = event.detail;
  //   setOrderVideos(orderVideos.concat(files));
  // };

  // const onDeleteVideo: UploaderProps['onDelete'] = (event) => {
  //   const { index } = event.detail;
  //   const _orderVideos = [...orderVideos];
  //   _orderVideos.splice(index, 1);
  //   setOrderVideos(_orderVideos);
  // };

  return (
    <div ref={containerRef} className={styles.root}>
      <div className={styles.form}>
        <span style={{ marginLeft: 5 }}>????????????</span>
        <div className={styles.card}>
          <div className={errMap.goodsUrl ? styles.alert : undefined}>
            <Field
              value={formData.goodsUrl || ""}
              clearable
              label="????????????"
              required
              placeholder="???????????????"
              onChange={(e) => {
                run(e, "goodsUrl");
              }}
            />
          </div>
          {errMap.goodsUrl ? <div className={styles["alert-msg"]}>{errMap.goodsUrl}</div> : null}
          <div className={errMap.videoUrl ? styles.alert : undefined}>
            <Field
              value={formData.videoUrl || ""}
              clearable
              required
              label="????????????"
              placeholder="???????????????"
              onChange={(e) => {
                run(e, "videoUrl");
              }}
            />
          </div>
          {errMap.videoUrl ? <div className={styles["alert-msg"]}>{errMap.videoUrl}</div> : null}
          <div className={errMap.feedback ? styles.alert : undefined}>
            <Field
              type="textarea"
              label="????????????"
              value={formData.feedback || ""}
              maxlength={150}
              required
              placeholder="???????????????"
              autosize={{ minHeight: "30px" }}
              onChange={(e) => {
                run(e, "feedback");
              }}
            />
          </div>
          {errMap.feedback ? <div className={styles["alert-msg"]}>{errMap.feedback}</div> : null}
          <div
            className={errMap.orderImages ? styles.alert : undefined}
            style={{
              position: "relative",
              padding: "12px 16px",
              borderBottom: "1px solid #f5f6f7"
            }}
          >
            <div style={{ marginBottom: 10, }}>
              <span className={styles["required-icon"]}>*</span>
              <span>????????????</span>
            </div>
            <Uploader
              fileList={orderImages}
              onAfterRead={afterImageRead}
              onDelete={handleDelteImage}
              accept="image"
              maxCount={1}
              // multiple
              deletable
            />
          </div>
          {errMap.orderImages ? <div className={styles["alert-msg"]}>{errMap.orderImages}</div> : null}
          {/* <div
            style={{
              margin: "12px 16px 0",
              paddingBottom: 12,
              borderBottom: "1px solid #f5f6f7"
            }}
          >
            <div style={{ marginBottom: 10 }}>????????????</div>
            <div className={styles.videoGroup}>
              <Uploader
                fileList={orderVideos}
                onAfterRead={afterVideoRead}
                onDelete={onDeleteVideo}
                accept="video"
                maxCount={2}
                multiple
                deletable
              />
            </div>
          </div> */}
        </div>
        <div
          style={{
            width: "100%",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          <Button
            size="normal"
            color="#5dcbb5"
            style={{ height: "33px", padding: "10px 25px" }}
            round
            onClick={handleSubmit}
          >
            <span>??????</span>
          </Button>
        </div>
      </div>
      {loading ? (
        <div className='flex-center loading-mask'>
          <Loading color='#03ceb4' size={70} />
        </div>
      ) : null}
      <Notify id="vanNotify" />
    </div>
  );
};

export default evaluationForm;
