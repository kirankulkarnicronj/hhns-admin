import types from './action'

const initialState = {
  loading: false,
  lectures: [],
  totalLectures: '',
  topics: [],
  events: [],
  loactions: [],
  error: '',
  isUpdated: false,
  isLectureCreated: false,
  isDeleted: false,
  editLecture: '',
}

export default function lectureReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
