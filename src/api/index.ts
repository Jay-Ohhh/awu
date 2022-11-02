import type Taro from '@tarojs/taro';

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
  getUserInfo: (params: { code: string; blogger: string; openId: string; }): RequestOption => ({
    method: "GET",
    url: "/rest/douyin/userInfo",
    data: params
  })
};
