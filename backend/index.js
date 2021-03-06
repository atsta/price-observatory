const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./config.json')
const { createSimpleRouter } = require('./utils')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const https = require("https")
const fs = require("fs")

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

async function main() {
    const dbConnection = await mysql.createConnection(config.db);

    console.log('Connected to MySQL. Moving on...')
    const sessions = new Map()
    const resources = ['products', 'shops', 'prices', 'users', 'login', 'logout']
    for (const resource of resources) {
        app.use(`/observatory/api/${resource}`, createSimpleRouter(resource, sessions, dbConnection))
    }

    const options = {
        key: fs.readFileSync('./certs/key.pem'),
        cert: fs.readFileSync('./certs/cert.pem')
    }
    app.listen(config.port, () => console.log(`Server listening on port ${config.port}`))
    https.createServer(options, app).listen(config.https_port, () => {
        console.log(`HTTPS Server listening on port ${config.https_port}`)
    });
}

main().then().catch(err => {
    console.log(err)
})
