import axios from 'axios'
import serverAddress from './config'

export async function createBlogApi(body) {
  const url = `${serverAddress}/api/blog/create/`
  return axios
    .post(url, body)
    .then(response => {
      if (response && response.data) {
        return response
      }
      return false
    })
    .catch(error => {
      return error
    })
}

export async function getBlogList(page) {
  const pageNumber = page || 1
  const url = `${serverAddress}/api/blog/?page=${pageNumber}`
  return axios
    .get(url)
    .then(response => {
      if (response && response.data) {
        return response
      }
      return false
    })
    .catch(error => {
      return error
    })
}
