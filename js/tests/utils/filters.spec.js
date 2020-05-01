import { orderBy } from "@/utils"

describe(`utils/filters`, () => {
  describe(`orderBy`, () => {
    it(`when no sortKey is provided, it will return the given array as-is`, () => {
      const initial = [20, 10, 30]
      const result = orderBy(initial, "", 1)
      expect(result).toBe(initial)
    })

    describe(`when the given array holds numbers`, () => {
      it(`will sort them by order without mutating the given array`, () => {
        const initial = [20, 10, 30]
        const result = orderBy(initial, true, 1)
        expect(result).toEqual([10, 20, 30])
        expect(result).not.toBe(initial)
      })

      it(`will sort them by reverse order when "reverse" is negative`, () => {
        const result = orderBy([20, 10, 30], true, -1)
        expect(result).toEqual([30, 20, 10])
      })
    })

    describe(`when the given array holds strings`, () => {
      it(`will sort them after lower-casing`, () => {
        const result = orderBy(["Alpha", "albert", "Bravo"], true, 1)
        expect(result).toEqual(["albert", "Alpha", "Bravo"])
      })
    })

    describe(`given an array of song wrappers`, () => {
      it(`and given sortKey is "song.title",
        it will sort the song wrappers by their title`, () => {
        const alpha_song = { song: { title: "Alpha" }}
        const bravo_song = { song: { title: "Bravo" }}
        const charlie_song = { song: { title: "Charlie" }}

        const result = orderBy(
          [alpha_song, charlie_song, bravo_song],
          "song.title",
          1
        )
        expect(result).toEqual([alpha_song, bravo_song, charlie_song])
      })

      it(`and given sortKey is "song.album.name",
        it will sort the song wrappers by their album name`, () => {
        const alpha_song = { song: { album: { name: "Alpha" }}}
        const bravo_song = { song: { album: { name: "Bravo" }}}
        const charlie_song = { song: { album: { name: "Charlie" }}}

        const result = orderBy(
          [alpha_song, charlie_song, bravo_song],
          "song.album.name",
          1
        )
        expect(result).toEqual([alpha_song, bravo_song, charlie_song])
      })

      it(`and given sortKey is "song.album.artist.name",
        it will sort the song wrappers by their artist name`, () => {
        const alpha_song = { song: { album: { artist: { name: "Alpha" }}}}
        const bravo_song = { song: { album: { artist: { name: "Bravo" }}}}
        const charlie_song = {
          song: { album: { artist: { name: "Charlie" }}}
        }

        const result = orderBy(
          [alpha_song, charlie_song, bravo_song],
          "song.album.artist.name",
          1
        )
        expect(result).toEqual([alpha_song, bravo_song, charlie_song])
      })

      it(`and given sortKey is ["song.track", "song.disc"],
        it will sort the song wrappers first by their track number,
        then by their disc number`, () => {
        const alpha_song = { song: { track: 1, disc: 1 }}
        const bravo_song = { song: { track: 1, disc: 2 }}
        const charlie_song = { song: { track: 2, disc: 1 }}

        const result = orderBy(
          [alpha_song, charlie_song, bravo_song],
          ["song.track", "song.disc"],
          1
        )
        expect(result).toEqual([alpha_song, bravo_song, charlie_song])
      })

      it(`and given sortKey is ["song.disc", "song.track"],
        it will sort the song wrappers first by their disc number,
        then by their track number`, () => {
        const alpha_song = { song: { track: 1, disc: 1 }}
        const bravo_song = { song: { track: 2, disc: 1 }}
        const charlie_song = { song: { track: 2, disc: 1 }}

        const result = orderBy(
          [alpha_song, charlie_song, bravo_song],
          ["song.disc", "song.track"],
          1
        )
        expect(result).toEqual([alpha_song, bravo_song, charlie_song])
      })

      it(`and given sortKey is ["song.album.name", "song.track"]
        it will sort the song wrappers first by their album name,
        then by their track number`, () => {
        const alpha_song = { song: { album: { name: "Alpha" }, track: 1 }}
        const bravo_song = { song: { album: { name: "Alpha" }, track: 2 }}
        const charlie_song = { song: { album: { name: "Bravo" }, track: 1 }}

        const result = orderBy(
          [alpha_song, charlie_song, bravo_song],
          ["song.album.name", "song.track"],
          1
        )
        expect(result).toEqual([alpha_song, bravo_song, charlie_song])
      })
    })
  })
})
