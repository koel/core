import crypto from 'crypto-random-string'

export default faker => ({
  id: {
    videoId: crypto(16)
  },
  snippet: {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    thumbnails: {
      default: {
        url: faker.image.imageUrl()
      }
    }
  }
})
