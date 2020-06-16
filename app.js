const express = require("express")
const app = express()
const path = require("path")
const { v4 } = require("uuid")

const host = "127.0.0.1"
const port = process.env.port || 3000

let CONTACTS = [
    { id: v4(), name: "Andrey", value: "+15062603582", marked: false }
]

app.use(express.json()) // работа запросов с json 

// GET
app.get("/api/contacts", function (req, res) {
    setTimeout(function () { res.status(200).json(CONTACTS) }, 1000)

})

//POST
app.post("/api/contacts", function (req, res) {
    const contact = { ...req.body, id: v4(), marked: false }
    CONTACTS.push(contact)
    res.status(201).json(contact)
})

//DELETE
app.delete("/api/contacts/:id", (req, res) => {
    CONTACTS = CONTACTS.filter(c => c.id !== req.params.id)
    res.status(200).json({ message: "Контакт был удален" })
})

// PUT
app.put("/api/contacts/:id", (req, res) => {
    const idx = CONTACTS.findIndex(c => c.id === req.params.id)
    CONTACTS[idx] = req.body
    res.json(CONTACTS[idx])
})

app.use(express.static(path.resolve(__dirname, "client")))
app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "client", "index.html"))
})
app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`)
})