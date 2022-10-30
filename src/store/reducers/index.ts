import userInfo, { UserInfoActionType } from './userInfo';
import { combineReducers } from 'redux';

export type StoreActionType = UserInfoActionType;

export default combineReducers({
  userInfo,
});
