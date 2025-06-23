const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const assert = require("node:assert");
const api = supertest(app);
const helper = require('./test_helper')

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', name: 'Superuser', passwordHash: 'fakehash' })
    await user.save()
  })
  
test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()
    const newUser = {
      username: 'chris',
      name: 'Chris Evans',
      password: 'password123'
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb()
    console.log('start', usersAtStart)
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser) 
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    console.log('end', usersAtEnd)
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  
  after(async () => {
    await mongoose.connection.close()
  })