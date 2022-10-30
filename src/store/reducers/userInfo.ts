import { getCurrentUser, User } from '../../utils/tools';

export type UserInfoActionType = 'set_userInfo' | 'update_userInfo' | 'clear_userInfo';
type Action = {
  userInfo: Partial<User>;
  type: UserInfoActionType;
};

const initialState: User | {} = getCurrentUser() ?? {};

function userInfo(state = initialState, action: Action): User | {} {
  switch (action.type) {
    case 'set_userInfo': {
      return action.userInfo;
    }
    case 'update_userInfo': {
      return { ...state, ...action.userInfo };
    }
    case 'clear_userInfo': {
      return {};
    }
    default:
      return state;
  }
}

export default userInfo;
