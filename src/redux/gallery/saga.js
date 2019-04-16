import { notification } from 'antd'
import { all, takeEvery, put, call } from 'redux-saga/effects'
import {
  getStaticGallery,
  createGallery,
  removeGallery,
  getSubGalleryByGallery,
} from 'services/gallery'
import actions from './action'

export function* getStaticGallerySage() {
  try {
    const result = yield call(getStaticGallery())
    console.log('result ====>>>>>', result)
    const { data } = result
    const { gallery } = data
    if (result.status === 200) {
      yield put({
        type: 'gallery/GET_GALLERY_LIST',
        payload: {
          mainGallery: gallery,
          isGalleryCreated: false,
          isDeleted: false,
          isUpdated: false,
          loading: true,
        },
      })
    }
  } catch (err) {
    notification.error({
      message: 'Error',
      description: 'Some Error Occured',
    })
  }
}

export function* getSubGalleryByGallerySaga(body) {
  try {
    const result = yield call(getSubGalleryByGallery, body)
    console.log('result ====>>>>>', result)
    const { data } = result
    const { gallery } = data
    if (result.status === 200) {
      yield put({
        type: 'gallery/GET_SUB_GALLERY',
        payload: {
          subGallery: gallery,
          isGalleryCreated: false,
          isDeleted: false,
          isUpdated: false,
          loading: true,
        },
      })
    }
  } catch (err) {
    notification.warning({
      message: 'Error',
      description: 'Some Error Occured While getting gallery',
    })
  }
}

export function* createGallerySaga(body) {
  try {
    const result = yield call(createGallery, body)
    console.log('result ====>>>>>', result)
    if (result.status === 200) {
      yield put({
        type: 'gallery/CREATE_GALLERY',
        payload: {
          isGalleryCreated: true,
          isDeleted: false,
          isUpdated: false,
          loading: true,
        },
      })
    }
  } catch (err) {
    notification.warning({
      message: 'Error',
      description: 'Some Error Occured While Creating Gallery',
    })
  }
}

export function* removeGallerySaga(payload) {
  try {
    const { uuid } = payload
    const result = yield call(removeGallery, uuid)
    console.log('result ====>>>>>', result)
    if (result.status === 200) {
      yield put({
        type: 'gallery/REMOVE_GALLERY',
        payload: {
          isGalleryCreated: false,
          isDeleted: true,
          isUpdated: false,
          loading: true,
        },
      })
    }
  } catch (err) {
    notification.warning({
      message: 'Error',
      description: 'Some Error Occured While Deleting Gallery',
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_GALLERY_LIST, getStaticGallerySage),
    takeEvery(actions.CREATE_GALLERY, createGallerySaga),
    takeEvery(actions.REMOVE_GALLERY, removeGallerySaga),
    takeEvery(actions.GET_SUB_GALLERY, getSubGalleryByGallerySaga),
  ])
}
