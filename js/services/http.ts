import Axios, { AxiosInstance, Method } from 'axios'
import NProgress from 'nprogress'

import { eventBus } from '@/utils'
import { events } from '@/config'
import { ls } from '@/services'

export const http = {
  client: null as AxiosInstance | null,
  progressBarTimeout: 0,

  // Only show the progress bar after some delay
  setProgressBarAfterDelay () {
    this.progressBarTimeout = window.setTimeout(() => {
      NProgress.start()
    }, 2000)
  },

  hideProgressBar () {
    NProgress.done()

    if (this.progressBarTimeout) {
      window.clearTimeout(this.progressBarTimeout)
      delete this.progressBarTimeout
    }
  },

  request (method: Method, url: string, data: object, successCb: any, errorCb: any): void {
    this.client!.request({ url, data, method }).then(successCb).catch(errorCb)
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

  init (): void {
    this.client = Axios.create({
      baseURL: KOEL_ENV === 'app' ? `${ls.get('koelHost')}api` : `${window.BASE_URL}api`
    })

    // Intercept the request to make sure the token is injected into the header.
    this.client.interceptors.request.use(config => {
      this.setProgressBarAfterDelay()
      config.headers.Authorization = `Bearer ${ls.get('jwt-token')}`
      return config
    })

    // Intercept the response and…
    this.client.interceptors.response.use(response => {
      this.hideProgressBar()

      // …get the token from the header or response data if exists, and save it.
      const token = response.headers.Authorization || response.data.token

      if (token) {
        ls.set('jwt-token', token)
      }

      return response
    }, error => {
      this.hideProgressBar()

      // Also, if we receive a Bad Request / Unauthorized error
      if (error.response.status === 400 || error.response.status === 401) {
        // and we're not trying to login
        if (!(error.config.method === 'post' && /\/api\/me\/?$/.test(error.config.url))) {
          // the token must have expired. Log out.
          eventBus.emit(events.LOG_OUT)
        }
      }

      return Promise.reject(error)
    })
  }
}
