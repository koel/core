import { without } from 'lodash'
import md5 from 'blueimp-md5'
import Vue from 'vue'
import NProgress from 'nprogress'

import { http } from '@/services'
import { alerts } from '@/utils'
import stub from '@/stubs/user'

export const userStore = {
  stub,

  state: {
    users: [],
    current: stub
  },

  init (users, currentUser) {
    this.all = users
    this.current = currentUser

    // Set the avatar for each of the users…
    this.all.forEach(user => this.setAvatar(user))

    // …and the current user as well.
    this.setAvatar()
  },

  get all () {
    return this.state.users
  },

  set all (value) {
    this.state.users = value
  },

  byId (id) {
    return this.all.find(user => user.id === id)
  },

  get current () {
    return this.state.current
  },

  set current (user) {
    this.state.current = user
    return this.state.current
  },

  /**
   * Set a user's avatar using Gravatar's service.
   *
   * @param {?Object} user The user. If null, the current user.
   */
  setAvatar (user = null) {
    user = user || this.current
    Vue.set(user, 'avatar', `https://www.gravatar.com/avatar/${md5(user.email)}?s=256`)
  },

  login: (email, password) => {
    NProgress.start()

    return new Promise((resolve, reject) => {
      http.post('me', { email, password }, ({ data }) => {
        resolve(data)
      }, error => reject(error))
    })
  },

  logout: () => {
    return new Promise((resolve, reject) => {
      http.delete('me', {}, ({ data }) => {
        resolve(data)
      }, error => reject(error))
    })
  },

  getProfile: () => {
    return new Promise((resolve, reject) => {
      http.get('me', ({ data }) => {
        resolve(data)
      }, error => reject(error))
    })
  },

  updateProfile (password) {
    NProgress.start()

    return new Promise((resolve, reject) => {
      http.put('me', {
        password,
        name: this.current.name,
        email: this.current.email
      }, () => {
        this.setAvatar()
        alerts.success('Profile updated.')
        resolve(this.current)
      },
      error => reject(error))
    })
  },

  store (name, email, password) {
    NProgress.start()

    return new Promise((resolve, reject) => {
      http.post('user', { name, email, password }, ({ data: user }) => {
        this.setAvatar(user)
        this.all.unshift(user)
        alerts.success(`New user &quot;${name}&quot; created.`)
        resolve(user)
      }, error => reject(error))
    })
  },

  update (user, name, email, password) {
    NProgress.start()

    return new Promise((resolve, reject) => {
      http.put(`user/${user.id}`, { name, email, password }, () => {
        this.setAvatar(user);
        [user.name, user.email, user.password] = [name, email, '']
        alerts.success('User profile updated.')
        resolve(user)
      }, error => reject(error))
    })
  },

  destroy (user) {
    NProgress.start()

    return new Promise((resolve, reject) => {
      http.delete(`user/${user.id}`, {}, ({ data }) => {
        this.all = without(this.all, user)
        alerts.success(`User &quot;${user.name}&quot; deleted.`)

        // Mama, just killed a man
        // Put a gun against his head
        // Pulled my trigger, now he's dead
        // Mama, life had just begun
        // But now I've gone and thrown it all away
        // Mama, oooh
        // Didn't mean to make you cry
        // If I'm not back again this time tomorrow
        // Carry on, carry on, as if nothing really matters
        //
        // Too late, my time has come
        // Sends shivers down my spine
        // Body's aching all the time
        // Goodbye everybody - I've got to go
        // Gotta leave you all behind and face the truth
        // Mama, oooh
        // I don't want to die
        // I sometimes wish I'd never been born at all

        /**
         * Brian May enters the stage.
         */
        resolve(data)
      }, error => reject(error))
    })
  }
}
