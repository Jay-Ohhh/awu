import type Taro from '@tarojs/taro';
import { baseURL } from '../utils/request';

type RequestOption = Taro.request.Option;

export const list: (options: {
  limit: number;
  offset: number;
  filterValue: string;
}) => RequestOption = (options) => ({
  url: "/rest/entities/awu_Evaluation/search",
  method: "POST",
  data: {
    "limit": options.limit,
    "offset": options.offset,
    "sort": "-createDate",
    "returnCount": true,
    "fetchPlan": "we-app-list",
    "filter": {
      "group": "AND",
      "conditions": [
        {
          "property": "category",
          "operator": "=",
          "value": options.filterValue
        },
        {
          "property": "enable",
          "operator": "=",
          "value": true
        }
      ]
    }
  },
});

export const api = {
  getUserInfo: (params: {
    code?: string;
    bloggerCode?: string;
    userId?: string;
  }): RequestOption => ({
    method: "GET",
    url: "/rest/douyin/userInfo",
    data: params
  }),
  uploadFile: (data: FormData): [string, RequestInit] => ([
    "/rest/files",
    {
      method: "POST",
      body: data,
    }
  ]),
  uploadFiles: (data: FormData): [string, RequestInit] => ([
    "/rest/files/uploadFiles",
    {
      method: "POST",
      body: data,
    }
  ]),
  postEvaluation: (data: {
    userId: string;
    videoUrl: string;
    goodsUrl: string;
    feedback: string;
    orderPicture: string;
  }): RequestOption => ({
    method: "POST",
    url: "/rest/entities/awu_TestBillOfLading",
    data,
  }),
  getEvaluations: (options: {
    limit: number;
    offset: number;
    userId: string;
  }): RequestOption => ({
    method: "POST",
    url: "/rest/entities/awu_TestBillOfLading/search",
    data: {
      "limit": options.limit,
      "offset": options.offset,
      "sort": "-createDate",
      "returnCount": true,
      "filter": {
        "group": "AND",
        "conditions": [
          {
            "operator": "=",
            "property": "userId",
            "value": options.userId
          }
        ]
      }
    },
  }),
  getGoodsOrVideoSubmissions: (options: {
    limit: number;
    offset: number;
    userId?: string;
    bloggerSubmission: boolean;
  }): RequestOption => {
    const _options: RequestOption = {
      method: "POST",
      url: "/rest/entities/awu_Contribution/search",
      data: {
        "limit": options.limit,
        "offset": options.offset,
        "returnCount": true,
        "filter": {
          "group": "AND",
          "conditions": [
            {
              "operator": "=",
              "property": "bloggerContribution",
              "value": options.bloggerSubmission
            }
          ]
        }
      }
    };

    if (options.userId) {
      _options.data.filter.conditions.unshift({
        "operator": "=",
        "property": "userId",
        "value": options.userId
      });
    }

    return _options;
  },
  postGoodsSubmission: (data: {
    "userId": string,
    "fanUserName": string,
    "goodsName": string,
    "goodsUrl": string,
    "goodsImg": string,
    "goodsVideoUrl"?: string,
    "bloggerVideoUrl"?: string,
    "bloggerContribution"?: boolean,
  }): RequestOption => ({
    method: "POST",
    url: "/rest/entities/awu_Contribution",
    data
  }),
  voteSubmission: (data: {
    cId: string;
    fanUserId: string;
  }): RequestOption => ({
    method: "POST",
    url: "/rest/entities/awu_Contribution/likes",
    data
  })
};

