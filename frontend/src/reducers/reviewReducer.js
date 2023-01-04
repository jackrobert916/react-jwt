/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_REVIEWS,
} from 'src/actions/reviewActions';

const initialState = {
  reviews: [],
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS: {
      const { reviews } = action.payload;
      return produce(state, (draft) => {
        draft.reviews = reviews;
      });
    }

    default: {
      return state;
    }
  }
};

export default reviewReducer;