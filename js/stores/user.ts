import { without } from 'lodash'
import md5 from 'blueimp-md5'
import Vue from 'vue'
import NProgress from 'nprogress'

import { http } from '@/services'
import { alerts } from '@/utils'
import stub from '@/stubs/user'

interface UserStore {
  stub: User
  state: {
    users: User[]
    current: User
  }
  all: User[]
  current: User

  init(users: User[], currentUser: User): void
  setAvatar(user?: User | null): void
  byId(id: number): User
  login(email: string, password: string): Promise<User>
  logout(): Promise<void>
  getProfile(): Promise<User>
  updateProfile(password: string): Promise<User>
  store(name: string, email: string, password: string): Promise<User>
  update(user: User, name: string, email: string, password: string): Promise<User>
  destroy(user: User): Promise<void>
}

export const userStore: UserStore = {
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

  byId (id: number): User {
    return <User>this.all.find(user => user.id === id)
  },

  get current () {
    return this.state.current
  },

  set current (user: User) {
    this.state.current = user
  },

  /**
   * Set a user's avatar using Gravatar's service.
   *
   * @param {?User} user The user. If null, the current user.
   */
  setAvatar (user?: User): void {
    user = user || this.current
    Vue.set(user, 'avatar', `https://www.gravatar.com/avatar/${md5(user.email)}?s=256`)
  },

  login: (email: string, password: string): Promise<User> => {
    NProgress.start()

    return new Promise((resolve, reject): void => {
      http.post('me', { email, password }, ({ data } : { data: User }): void => {
        resolve(data)
      }, (error: any) => reject(error))
    })
  },

  logout: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      http.delete('me', {}, (): void => {
        resolve()
      }, (error: any) => reject(error))
    })
  },

  getProfile: (): Promise<User> => {
    return new Promise((resolve, reject): void => {
      http.get('me', ({ data } : { data: User }) => {
        resolve(data)
      }, (error: any) => reject(error))
    })
  },

  updateProfile (password: string): Promise<User> {
    NProgress.start()

    return new Promise((resolve, reject): void => {
      http.put('me', {
        password,
        name: this.current.name,
        email: this.current.email
      }, (): void => {
        this.setAvatar()
        alerts.success('Profile updated.')
        resolve(this.current)
      },
      (error: any) => reject(error))
    })
  },

  store (name: string, email: string, password: string): Promise<User> {
    NProgress.start()

    return new Promise((resolve, reject): void => {
      http.post('user', { name, email, password }, ({ data: user } : { data: User }): void => {
        this.setAvatar(user)
        this.all.unshift(user)
        alerts.success(`New user &quot;${name}&quot; created.`)
        resolve(user)
      }, (error: any) => reject(error))
    })
  },

  update (user: User, name: string, email: string, password: string): Promise<User> {
    NProgress.start()

    return new Promise((resolve, reject): void => {
      http.put(`user/${user.id}`, { name, email, password }, (): void => {
        this.setAvatar(user);
        [user.name, user.email, user.password] = [name, email, '']
        alerts.success('User profile updated.')
        resolve(user)
      }, (error: any) => reject(error))
    })
  },

  destroy (user: User): Promise<void> {
    NProgress.start()

    return new Promise((resolve, reject): void => {
      http.delete(`user/${user.id}`, {}, (): void => {
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
        resolve()
      }, (error: any) => reject(error))
    })
  }
}
