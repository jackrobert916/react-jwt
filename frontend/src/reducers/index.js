import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import accountReducer from './accountReducer';
import chatReducer from './chatReducer';
import postReducer from './postReducer';
import reviewReducer from './reviewReducer';

const rootReducer = combineReducers({
  account: accountReducer,
  post: postReducer,
  review: reviewReducer,
  chat: chatReducer,
  form: formReducer
});

export default rootReducer;
