// import firebase from 'firebase/app'
import { notification } from 'antd'
import axios from 'axios'
import serverAddress from './config'
// import 'firebase/auth'
// import 'firebase/database'
// import 'firebase/storage'

// const firebaseConfig = {
//   apiKey: 'AIzaSyAE5G0RI2LwzwTBizhJbnRKIKbiXQIA1dY',
//   authDomain: 'cleanui-72a42.firebaseapp.com',
//   databaseURL: 'https://cleanui-72a42.firebaseio.com',
//   projectId: 'cleanui-72a42',
//   storageBucket: 'cleanui-72a42.appspot.com',
//   messagingSenderId: '583382839121',
// }

// const firebaseApp = firebase.initializeApp(firebaseConfig)
// const firebaseAuth = firebase.auth
// export default firebaseApp

// export async function login(email, password) {
//   return firebaseAuth()
//     .signInWithEmailAndPassword(email, password)
//     .then(() => true)
//     .catch(error => {
//       notification.warning({
//         message: error.code,
//         description: error.message,
//       })
//     })
// }

export async function currentAccount() {
  let userLoaded = false
  function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
      if (userLoaded) {
        resolve()
      }

      resolve()
    })
  }
  return true
}

export async function logout() {
  return true
}

export async function login(email, password) {
  let url = serverAddress + '/api/signin/'
  console.log('email----->', email)
  return axios
    .post(url, { username: email, password: password })
    .then(data => {
      console.log('------>', data)
      if (data && data.data && data.data.success) {
        return true
      } else {
        notification.warning({
          message: 'User not found',
          description: 'No User',
        })
        return false
      }
    })
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    })
}
