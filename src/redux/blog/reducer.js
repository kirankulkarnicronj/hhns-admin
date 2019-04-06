import types from './action'

const initialState = {
  loading: false,
  blogs: [],
  totalBlogs: '',
  isBlogCreated: false,
  editBlog: '',
  error: '',
}

export default function blogReducer(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_BLOG:
    case types.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
