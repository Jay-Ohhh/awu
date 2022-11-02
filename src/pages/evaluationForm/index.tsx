import { useState, FC, useEffect, useRef } from "react";
import { Field, Uploader, } from '@antmjs/vantui';
import type { UploaderProps } from '@antmjs/vantui/types/uploader';
import styles from './index.module.scss';

const evaluationForm: FC = () => {
  const [orderImages, setOrderImages] = useState<any[]>([]);
  const [orderVideos, setOrderVideos] = useState<any[]>([]);

  const afterImageRead: UploaderProps['onAfterRead'] = (event) => {
    const { file, name } = event.detail;
    console.log(file);
    setOrderImages(orderImages.concat(file));
  };

  const onDeleteImage: UploaderProps['onDelete'] = (event) => {
    const { index } = event.detail;
    const _orderImages = [...orderImages];
    _orderImages.splice(index, 1);
    setOrderImages(_orderImages);
  };

  const afterVideoRead: UploaderProps['onAfterRead'] = (event) => {
    const { file, name } = event.detail;
    console.log(file);
    setOrderVideos(orderVideos.concat(file));
  };

  const onDeleteVideo: UploaderProps['onDelete'] = (event) => {
    const { index } = event.detail;
    const _orderVideos = [...orderVideos];
    _orderVideos.splice(index, 1);
    setOrderVideos(_orderVideos);
  };

  return (
    <div className={styles.root}>
      <div className={styles.form}>
        <span style={{ marginLeft: 5 }}>测评提单</span>
        <div className={styles.card}>
          <Field
            clearable
            label="商品链接"
            placeholder="请输入"
          />
          <Field
            label="问题反馈"
            type="textarea"
            placeholder="请输入描述"
            autosize={{ minHeight: "30px" }}
          />
          <div
            style={{
              margin: "12px 16px 0",
              paddingBottom: 12,
              borderBottom: "1px solid #f5f6f7"
            }}
          >
            <div style={{ marginBottom: 10 }}>订单图片</div>
            <Uploader
              fileList={orderImages}
              onAfterRead={afterImageRead}
              onDelete={onDeleteImage}
              accept="image"
              maxCount={3}
              multiple
              deletable
            />
          </div>
          <div
            style={{
              margin: "12px 16px 0",
              paddingBottom: 12,
              borderBottom: "1px solid #f5f6f7"
            }}
          >
            <div style={{ marginBottom: 10 }}>测评视频</div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default evaluationForm;
