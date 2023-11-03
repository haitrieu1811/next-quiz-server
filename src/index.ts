import express from 'express'

import { ENV_CONFIG } from './constants/config'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'

databaseServices.connect()

const app = express()
const port = ENV_CONFIG.PORT || 8000

app.use(express.json())
app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
