const express = require('express'); //requires express module
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors') 

var port = process.env.PORT || 3000;

let conn = null


const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'turtorials',
        port: 8889
    })
}

app.use(bodyParser.json())
app.use(cors())

app.listen(port, async () => {
    await initMySQL()
    console.log("server start at port:" + port)
})

// GET /users สำหรับ get users ทั้งหมดที่บันทึกเข้าไปออกมา
app.get('/users', async (req, res) => {
    try {
        const result = await conn.query('SELECT * FROM users')
        res.json(result[0])
    } catch (error) {
        console.error(error.message)
        res.status(500)
    }
})


// POST /users สำหรับการสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
    const user = req.body
    try {
        const result = await conn.query('INSERT INTO users SET ?', user)
        res.json({
            message: 'insert success.',
            data: result[0]
        })

    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message: "error "
        })
    }
})

// GET /users/:id สำหรับการดึง users รายคนออกมา
app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        const result = await conn.query('SELECT * FROM users WHERE id = ?', id)

        console.log(result[0])
        if (result[0].length == 0) {
            throw { statusCode : 404 , message : "NOt found users."}
        }

        res.json(result[0][0])

    } catch (error) {
        console.error(error.message)
        
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: "Server Error !! , " + error.message
        })
    }
})
// PUT /users/:id สำหรับการแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
// PUT -> send it all
// PATCH -> send only update
app.put('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        let user = req.body

        const result = await conn.query('UPDATE users SET ? WHERE id = ?',[user,id])
        console.log(result[0])
        res.json({
            message: 'update success.',
            data: result[0]
        })

    } catch (error) {
        console.error(error.message)
        res.status(500).json({
            message: "error "
        })
    }
})

// DELETE /users/:id สำหรับการลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id
        
        const result = await conn.query('DELETE FROM users WHERE id = ?',id)
    
        if (result[0].affectedRows == 0) {
            throw { statusCode : 404 , message : "NOt found users."}
        }
        
        res.json({
            message: 'delete success.',
            data: result[0]
        })

    } catch (error) {
        console.error(error.message)
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: "Server Error !! , " + error.message
        })
    }
})






