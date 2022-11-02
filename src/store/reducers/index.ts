import tiktokUserInfo, { UserInfoActionType } from './tiktokUserInfo';
import { combineReducers } from 'redux';

export type StoreActionType = UserInfoActionType;

export default combineReducers({
  tiktokUserInfo,
});
