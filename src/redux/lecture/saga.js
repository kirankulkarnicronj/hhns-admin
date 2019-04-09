import { notification } from 'antd'
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { getLectureList, createLecture, deleteLectureByUuid, updateLecture } from 'services/lecture'
import { getTopicList, getEventList, getLocationList } from 'services/common'
import actions from './action'

export function* getLectureListSaga(payload) {
  try {
    const { page } = payload
    const result = yield call(getLectureList, page)
    const { data } = result
    const { lecture } = data

    if (result.status === 200) {
      yield put({
        type: 'lecture/SET_STATE',
        payload: {
          lectures: lecture.results,
          totalLectures: lecture.total,
        },
      })
    }
  } catch (err) {
    notification.warning({
      message: 'Error',
      description: 'Some Error Occured',
    })
  }
}

export function* createLectureSaga(payload) {
  try {
    const { body } = payload
    const result = yield call(createLecture, body)
    if (result.status === 200) {
      notification.success({
        message: 'Success',
        description: 'Lecture is created successfully',
      })
      yield put({
        type: 'lecture/SET_STATE',
        payload: {
          isLectureCreated: true,
          isDeleted: false,
          isUpdated: false,
          lectures: [],
        },
      })
    }
  } catch (err) {
    notification.warning({
      message: 'Error',
      description: 'Error Occured while Creating Lecture',
    })
  }
}

export function* deleteBlogByUuidSaga(payload) {
  try {
    const { uuid } = payload
    const result = yield call(deleteLectureByUuid, uuid)
    if (result.status === 200) {
      yield put({
        type: 'lecture/SET_STATE',
        payload: {
          isDeleted: true,
          isLectureCreated: false,
          isUpdated: false,
        },
      })
      notification.success({
        message: 'Success',
        description: 'lecture is Deleted successfully',
      })
    }
  } catch (err) {
    notification.warning({
      message: 'Error',
      description: 'Some Error Occured While Deleting lecture',
    })
  }
}

export function* updateBlogSaga(payload) {
  try {
    const { body, uuid } = payload.payload
    const result = yield call(updateLecture, uuid, body)
    if (result.status === 200) {
      yield put({
        type: 'lecture/SET_STATE',
        payload: {
          isUpdated: true,
          isLectureCreated: false,
          isDeleted: false,
        },
      })
      notification.success({
        message: 'Success',
        description: 'lecture is updated successfully',
      })
    }
  } catch (err) {
    notification.warning({
      message: 'Error',
      description: 'Some Error Occured While Updating lecture',
    })
  }
}
export function* getTopics() {
  try {
    const result = yield call(getTopicList)
    const { data } = result
    if (result.status === 200) {
      yield put({
        type: 'lecture/SET_STATE',
        payload: {
          topics: data.topic,
        },
      })
    }
  } catch (err) {
    notification.error({
      message: 'Error',
      description: 'Error Occured while getting Topics',
    })
  }
}

export function* getEvents() {
  try {
    const result = yield call(getEventList)
    const { data } = result
    if (result.status === 200) {
      yield put({
        type: 'lecture/SET_STATE',
        payload: {
          events: data.event,
        },
      })
    }
  } catch (err) {
    notification.error({
      message: 'Error',
      description: 'Error Occured while getting Events',
    })
  }
}

export function* getLocations() {
  try {
    const result = yield call(getLocationList)
    const { data } = result
    if (result.status === 200) {
      yield put({
        type: 'lecture/SET_STATE',
        payload: {
          locations: data.location,
        },
      })
    }
  } catch (err) {
    notification.error({
      message: 'Error',
      description: 'Error Occured while getting Locations',
    })
  }
}
export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_LECTURES, getLectureListSaga),
    takeEvery(actions.GET_TOPICS, getTopics),
    takeEvery(actions.GET_EVENTS, getEvents),
    takeEvery(actions.GET_LOCATIONS, getLocations),
    takeEvery(actions.CREATE_LECTURE, createLectureSaga),
    takeEvery(actions.DELETE_LECTURE, deleteBlogByUuidSaga),
    takeEvery(actions.UPDATE_LECTURE, updateBlogSaga),
  ])
}
