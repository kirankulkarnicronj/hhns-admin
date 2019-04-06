import { notification } from 'antd'
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { createBlogApi, getBlogList, getBlogByUuid } from 'services/blog'
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

export function* getBlogListSaga(payload) {
  try {
    const { page } = payload
    const result = yield call(getBlogList, page)
    const { data } = result
    const { blog } = data
    if (result.status === 200) {
      yield put({
        type: 'blog/SET_STATE',
        payload: {
          blogs: blog.results,
          totalBlogs: blog.total,
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

export function* getBlogByUuidSaga(body) {
  try {
    const result = yield call(getBlogByUuid, body)
    console.log('result =====>>>>', result)
    const { data } = result
    if (result.status === 200) {
      yield put({
        type: 'blog/SET_STATE',
        payload: {
          editBlog: data.blog,
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

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_BLOG, createBlogSaga),
    takeEvery(actions.GET_LIST, getBlogListSaga),
    takeEvery(actions.GET_BLOG_BY_ID, getBlogByUuidSaga),
  ])
}
