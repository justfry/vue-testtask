const express = require('express')
const fs = require('fs')

const app = express()


const avatars = JSON.parse(fs.readFileSync('./data/avatars.json', 'utf-8'))
const stats = JSON.parse(fs.readFileSync('./data/stat.json', 'utf-8'))

const setOrder = (order, users) => {
    switch (order){
        case "lastname_desc": return users.sort((a,b) => b.last_name.localeCompare(a.last_name))
        break;
        case "lastname_asc": return users.sort((a,b) => a.last_name.localeCompare(b.last_name))
        break;
        case "id_desc": return users.sort((a,b) => b.id - a.id)
        break;
        case "username_asc": return users.sort((a,b) => a.username.localeCompare(b.usernname))
        break;
        case "username_desc": return users.sort((a,b) => b.username.localeCompare(a.username))
        break;
        default: return users.sort((a,b) => a.id - b.id)
    }
}

const setOffset = (offset, users) => {
    return users.slice(offset)
}

const setLimit = (limit, users) => {
    return users.slice(0,limit)
}

app.get('/api/v1/users', (req, res) => {
    var users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))
    const searchString = req.query.search
    const orderBy = req.query.order_by
    const offset = req.query.offset
    const limit = req.query.limit
    const regex = new RegExp(searchString.toLowerCase(), 'g')
    if (searchString){
        users = users.filter(el => {
            for (key in el){
                if (regex.exec(el[key]) !== null) return el
            }
        })
    } 
    users = setOrder(orderBy, users)
    users = setOffset(offset, users)
    users = setLimit(limit,users)
        res.status(200).send({
            success: 'true',
            message: 'users has found',
            users: users,
        })
})

app.get('/api/v1/:userid/avatar', (req, res) => {

    const id = parseInt(req.params.userid, 10)

    const avatar = avatars.find(el => el.id == id)

    if (avatar) {
            res.status(200).send({
            success: 'true',
            message: 'avatar has found',
            avatar: avatar,
        })
    } else {
        res.status(404).send({
            error: 'user does not exists'
        })
    } 
    
  })

  app.get('/api/v1/:userid/stat', (req, res) => {

    const id = parseInt(req.params.userid, 10)

    const stat = stats.find(el => el.id == id)

    if (stat) {
            res.status(200).send({
            success: 'true',
            message: 'stat has found',
            stat: stat,
        })
    } else {
        res.status(404).send({
            error: 'user does not exists'
        })
    } 
    
  })

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})