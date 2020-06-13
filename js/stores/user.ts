import { without } from 'lodash'
import md5 from 'blueimp-md5'
import Vue from 'vue'

import { http } from '@/services'
import { alerts } from '@/utils'
import stub from '@/stubs/user'

export const userStore = {
  stub,

  state: {
    users: [] as User[],
    current: stub
  },

  init (users: User[], currentUser: User): void {
    this.all = users
    this.current = currentUser

    // Set the avatar for each of the users…
    this.all.forEach(user => this.setAvatar(user))

    // …and the current user as well.
    this.setAvatar()
  },

  get all (): User[] {
    return this.state.users
  },

  set all (value: User[]) {
    this.state.users = value
  },

  byId (id: number): User {
    return <User> this.all.find(user => user.id === id)
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

  login: async (email: string, password: string): Promise<User> => {
    return await http.post<User>('me', { email, password })
  },

  logout: async (): Promise<void> => {
    await http.delete('me')
  },

  getProfile: async (): Promise<User> => {
    return await http.get<User>('me')
  },

  async updateProfile (password: string): Promise<void> {
    await http.put('me', {
      password,
      name: this.current.name,
      email: this.current.email
    })

    this.setAvatar()
    alerts.success('Profile updated.')
  },

  async store (name: string, email: string, password: string, is_admin: boolean): Promise<User> {
    const user = await http.post<User>('user', { name, email, password, is_admin })
    this.setAvatar(user)
    this.all.unshift(user)
    alerts.success(`New user &quot;${name}&quot; created.`)

    return user
  },

  async update (user: User, name: string, email: string, password: string, is_admin: boolean): Promise<void> {
    await http.put(`user/${user.id}`, { name, email, password, is_admin })
    this.setAvatar(user);
    [user.name, user.email, user.password, user.is_admin] = [name, email, '', is_admin]
    alerts.success('User profile updated.')
  },

  async destroy (user: User): Promise<void> {
    await http.delete(`user/${user.id}`)
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
  }
}
