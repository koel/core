import { union, difference, shuffle } from 'lodash'

export const queueStore = {
  state: {
    songs: [],
    current: null
  },

  init () {
    // We don't have anything to do here yet.
    // How about another song then?
    //
    // LITTLE WING
    // -- by Jimi Fucking Hendrix
    //
    // Well she's walking
    // Through the clouds
    // With a circus mind
    // That's running wild
    // Butterflies and zebras and moonbeams and fairytales
    // That's all she ever thinks about
    // Riding with the wind
    //
    // When I'm sad
    // She comes to me
    // With a thousand smiles
    // She gives to me free
    // It's alright she said
    // It's alright
    // Take anything you want from me
    // Anything...
  },

  get all () {
    return this.state.songs
  },

  set all (songs) {
    this.state.songs = songs
  },

  /**
   * @return {?Object}
   */
  get first () {
    return this.all[0]
  },

  /**
   * @return {?Object}
   */
  get last () {
    return this.all[this.all.length - 1]
  },

  contains (song) {
    return this.all.includes(song)
  },

  /**
   * Add a list of songs to the end of the current queue.
   * @param {Object|Array.<Object>} songs The song, or an array of songs
   */
  queue (songs) {
    this.all = union(this.all, [].concat(songs))
  },

  /**
   * Add a list of songs to the top of the current queue.
   * @param {Object|Array.<Object>} songs The song, or an array of songs
   */
  queueToTop (songs) {
    this.all = union([].concat(songs), this.all)
  },

  /**
   * Replace the current queue with a list of songs.
   * @param {Object|Array.<Object>} songs The song, or an array of songs
   */
  replaceQueueWith (songs) {
    this.all = [].concat(songs)
  },

  /**
   * Queue songs right after the currently played song.
   * @param  {Array.<Object>|Object} songs
   */
  queueAfterCurrent (songs) {
    songs = [].concat(songs)

    if (!this.current || !this.all.length) {
      return this.queue(songs)
    }

    // First we unqueue the songs to make sure there are no duplicates.
    this.unqueue(songs)

    const head = this.all.splice(0, this.indexOf(this.current) + 1)
    this.all = head.concat(songs, this.all)
  },

  /**
   * @param  {Object|String|Array.<Object>} songs The song(s) to unqueue
   */
  unqueue (songs) {
    this.all = difference(this.all, [].concat(songs))
  },

  /**
   * Move some songs to after a target.
   *
   * @param  {Array.<Object>} songs  Songs to move
   * @param  {Object}     target The target song object
   */
  move (songs, target) {
    const targetIndex = this.indexOf(target)

    songs.forEach(song => {
      this.all.splice(this.indexOf(song), 1)
      this.all.splice(targetIndex, 0, song)
    })
  },

  clear () {
    this.all = []
  },

  indexOf (song) {
    return this.all.indexOf(song)
  },

  /**
   * @return {?Object}
   */
  get next () {
    if (!this.current) {
      return this.first
    }

    const index = this.all.map(song => song.id).indexOf(this.current.id) + 1

    return index >= this.all.length ? null : this.all[index]
  },

  /**
   * @return {?Object}
   */
  get previous () {
    if (!this.current) {
      return this.last
    }

    const index = this.all.map(song => song.id).indexOf(this.current.id) - 1

    return index < 0 ? null : this.all[index]
  },

  get current () {
    return this.state.current
  },

  set current (song) {
    this.state.current = song
    return this.state.current
  },

  shuffle () {
    this.all = shuffle(this.all)
    return this.all
  }
}
