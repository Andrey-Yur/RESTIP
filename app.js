const express = require("express")
const app = express()
const path = require("path")

const host = '127.0.0.1'
const port = process.env.port || 3000

const CONTACTS = [
    { id: 1, name: 'Andrey', value: '+15062603582', marked: false }
]

// GET
app.get("/api/contacts", function (req, res) {
    setTimeout(function () { res.status(200).json(CONTACTS) }, 1000)

})

//POST

app.use(express.static(path.resolve(__dirname, "client")))
app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "client", "index.html"))
})
app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`)
})