import { getCurrentUser, User } from '../../utils/tools';

export type UserInfoActionType = 'set_tiktokUserInfo' | 'update_tiktokUserInfo' | 'clear_tiktokUserInfo';
type Action = {
  userInfo: Partial<User>;
  type: UserInfoActionType;
};

const initialState: User | {} = getCurrentUser() ?? {};

function userInfo(state = initialState, action: Action): User | {} {
  switch (action.type) {
    case 'set_tiktokUserInfo': {
      const userInfo: Action['userInfo'] = action.userInfo;
      sessionStorage.setItem("tiktokUserInfo", JSON.stringify(userInfo));
      window["tiktokUserInfo"] = userInfo;

      return action.userInfo;
    }
    case 'update_tiktokUserInfo': {
      const userInfo: Action['userInfo'] = { ...state, ...action.userInfo };
      sessionStorage.setItem("tiktokUserInfo", JSON.stringify(userInfo));
      window["tiktokUserInfo"] = userInfo;

      return userInfo;
    }
    case 'clear_tiktokUserInfo': {
      sessionStorage.removeItem("tiktokUserInfo");

      return {};
    }
    default:
      return state;
  }
}

export default userInfo;
