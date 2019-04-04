import { notification } from 'antd'
import { all, takeEvery, put, call } from 'redux-saga/effects'
import createBlogApi from 'services/blog'
import actions from './action'

export function* createBlogSaga({ payload }) {
  try {
    const result = yield call(createBlogApi, payload)
    if (result.status === 200) {
      notification.success({
        message: 'Success',
        description: 'Blog is created successfully',
      })
      yield put({
        type: 'blog/SET_STATE',
        payload: {
          isBlogCreated: true,
          blogs: [],
        },
      })
    }
  } catch (err) {
    notification.warning({
      message: 'Error',
      description: 'Some Error Occured',
    })
    yield put({
      type: 'blog/SET_STATE',
      payload: {
        isBlogCreated: true,
        blogs: [],
      },
    })
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.CREATE_BLOG, createBlogSaga)])
}
