import React from "react";

// Redux packages
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

// Redux Store
import tweetsReducer from './store/reducers/tweets';

import { useScreens } from 'react-native-screens';
useScreens();

import HomePage from './screens/HomePage';

console.disableYellowBox = true;

// Combined root reducer
const rootReducer = combineReducers({
  tweets: tweetsReducer
});

// Redux Store
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

console.log('CIAO');


export default function App() {

  return (
    <Provider store={store}>
        <HomePage/>
    </Provider>
  );

}