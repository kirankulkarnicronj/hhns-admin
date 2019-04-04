import axios from 'axios'
import serverAddress from './config'

export default async function createBlogApi(body) {
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
