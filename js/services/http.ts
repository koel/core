import axios, { AxiosResponse } from 'axios'
import NProgress from 'nprogress'

import { event } from '@/utils/index'
import { ls } from '@/services'

export const http = {
  request: (method: string, url: string, data: object, successCb: any, errorCb: any): void => {
    axios.request({ url, data, method: method.toLowerCase() }).then(successCb).catch(errorCb)
  },

  get (url: string, successCb?: any, errorCb?: any): void {
    this.request('get', url, {}, successCb, errorCb)
  },

  post (url: string, data: object, successCb?: any, errorCb?: any): void {
    this.request('post', url, data, successCb, errorCb)
  },

  put (url: string, data: object, successCb?: any, errorCb?: any): void {
    this.request('put', url, data, successCb, errorCb)
  },

  delete (url: string, data: object = {}, successCb?: any, errorCb?: any): void {
    this.request('delete', url, data, successCb, errorCb)
  },

  init: (): void => {
    axios.defaults.baseURL = KOEL_ENV === 'app' ? `${ls.get('koelHost')}api` : `${window.BASE_URL}api`

    // Intercept the request to make sure the token is injected into the header.
    axios.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${ls.get('jwt-token')}`
      return config
    })

    // Intercept the response and…
    axios.interceptors.response.use(response => {
      NProgress.done()

      // …get the token from the header or response data if exists, and save it.
      const token = response.headers['Authorization'] || response.data['token']
      token && ls.set('jwt-token', token)

      return response
    }, error => {
      NProgress.done()
      // Also, if we receive a Bad Request / Unauthorized error
      if (error.response.status === 400 || error.response.status === 401) {
        // and we're not trying to login
        if (!(error.config.method === 'post' && /\/api\/me\/?$/.test(error.config.url))) {
          // the token must have expired. Log out.
          event.emit(event.$names.LOG_OUT)
        }
      }

      return Promise.reject(error)
    })
  }
}
