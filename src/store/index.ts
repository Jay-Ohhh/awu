import { useMemo } from 'react';
import { createStore, compose, applyMiddleware, Store, Action, Dispatch } from 'redux';
import { useSelector, useDispatch } from 'react-redux';
import rootReducer, { StoreActionType } from './reducers';
import type { User } from '../utils/tools';

export type StoreState = {
  userInfo: User | {};
};

export type StoreAction = Action<StoreActionType>;

let store: Store<StoreState, StoreAction>;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function initStore(preloadedState?: StoreState) {
  return createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware()
    )
  );
}

export const initializeStore = (preloadedState?: StoreState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({ ...store.getState(), ...preloadedState });
    // Reset the current store
    store = undefined as any;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined")
    return _store;

  // Create the store once in the client
  if (!store)
    store = _store;

  return _store;
};

export function useStore(initialState?: StoreState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}

export function useCurrentUser() {
  const userInfo = useSelector((store: StoreState) => store.userInfo) as User;
  const dispatch = useDispatch<Dispatch<StoreAction>>();
  const setUserInfo = (userInfo: User) => {
    dispatch({ type: "set_userInfo", userInfo });
  };

  return [userInfo, setUserInfo] as const;
}
