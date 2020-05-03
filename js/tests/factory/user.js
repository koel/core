export default faker => ({
  id: faker.random.number(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  is_admin: false
})
