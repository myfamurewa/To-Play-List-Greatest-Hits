const db = require('../database/dbConfig.js')

module.exports = {
    find, 
    findBy,
    findById,
    insert,
    update,
    remove
}

function find(){
    return db('users')
}


function findBy(username) {
    return db('users').where({ username }).first();
}

function findById(id) {
    return db('users').where({ id }).first();
}

function insert(user) {
    return db('users').insert(user);
}

function update(user) {
    return db('users'). where({id: user.id}).update(user);
}

function remove(id) {
    return db('users').where({ id }).del();
}

