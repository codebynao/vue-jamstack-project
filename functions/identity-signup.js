require('dotenv').config()
const mongoose = require('mongoose')
const UserModel = require('../models/User')

exports.handler = async function(event, context, callback) {
  try {
    if (event.httpMethod.toLowerCase() !== 'post') {
      return {
        statusCode: 400,
        body: 'Wrong HTTP method. Only accepts POST.',
      }
    }

    await mongoose.connect(process.env.GRIDSOME_DB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })

    const payload = JSON.parse(event.body)

    if (payload && payload.user) {
      await UserModel.create({
        netlifyId: payload.user.id,
        email: payload.user.email,
        name: payload.user.user_metadata.full_name,
        createdAt: payload.user.created_at,
      })
    }
    return {
      statusCode: 204,
      body: null,
    }
  } catch (error) {
    console.error('Error while saving new user in DB', error)
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
