/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_POSTS,
} from 'src/actions/postActions';

const initialState = {
  posts: [],
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_POSTS: {
      const { posts } = action.payload;
      return produce(state, (draft) => {
        draft.posts = posts;
      });
    }

    default: {
      return state;
    }
  }
};

export default postReducer;