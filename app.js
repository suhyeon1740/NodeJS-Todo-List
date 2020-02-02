var express = require('express')
var app = express()
var mysql = require('mysql')
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'study'
})

db.connect()

app.use(express.static('public')) 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/todos', function(req, res) {
    db.query(`SELECT * FROM todo`, function(error, result) {
        if (error) {
            console.log(error)
        }
        console.log(result)
        res.json(result)                    
    })  
})

app.post('/todos', function(req, res) {    
    var content = req.body.content
    console.log(req.body.content)    
    db.query(`INSERT INTO todo(content) VALUES(?)`, [content], function (error, result) {
        if (error) {
            console.log(error)
        }
        console.log(result)
        res.json({
            id: result.insertId,
            content: content,
            do: 0
        })        
    })  
})

app.put('/todos/:id/:state', function(req, res) {    
    var state = req.params.state
    var id = req.params.id
    
    db.query(`UPDATE todo SET do = ? WHERE id = ?`, [state, id], function(error, result) {
        if (error) {
            console.log(error)
        }
        console.log(result)
        res.json({ result: 1 })   
    })
})

app.delete('/todos/:id', function(req, res) {
    var id = req.params.id
    db.query('DELETE FROM todo WHERE id = ?', [id], function(error, result) {
        if (error) {
            console.log(error)
        }
        console.log(result)
        if (result.affectedRows) {
            res.json({ result: 1 })
        } else {
            res.json({ result: 0 })
        }        
    })
})

app.listen(3000, function(){
    console.log(`Server running at http://localhost:3000/`);
})

