const express = require("express")
const mysql = require("mysql2")
require("dotenv").config()
const app = express()
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})
db.connect(err => {
    if (err) {
        console.log(err)
        return
    }
    console.log("Sikeres kapcs.")
})
app.get("/berletek", (req, res) => {
    const sql = `
        SELECT
            b.id,
            b.megnevezes,
            b.ar,
            b.ervenyes_napok,
            b.diak_kedvezmeny,
            t.nev AS tipus_nev
        FROM berletek b
        INNER JOIN tipusok t ON b.tipus_id = t.id
        ORDER BY b.ar ASC
    `
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ hiba: err.message })
        }
        res.json(result)
    })
})
app.get("/berletek/elerheto", (req, res) => {
    const sql = `
        SELECT *
        FROM berletek
        WHERE diak_kedvezmeny = 1
        AND ervenyes_napok <= 30
    `
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ hiba: err.message })
        }
        res.json(result)
    })
})
app.get("/berletek/kereses/:szoveg", (req, res) => {
    const sql = `
        SELECT *
        FROM berletek
        WHERE megnevezes LIKE ?
    `
    db.query(sql, [`%${req.params.szoveg}%`], (err, result) => {
        if (err) {
            return res.status(500).json({ hiba: err.message })
        }
        res.json(result)
    })
})
app.listen(process.env.PORT, () => {
    console.log(`A szerver fut a 3000-es porton`)
})