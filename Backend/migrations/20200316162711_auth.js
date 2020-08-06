
exports.up = function(knex) {
    return knex.schema
    .createTableIfNotExists('users', tbl => {
        tbl.increments();
        tbl.string('username').notNullable();
        tbl.string('email').notNullable();
        tbl.string('password').notNullable();
      })
    .createTableIfNotExists('toGameList', tbl => {
      tbl.increments()
      tbl.string("name")
      tbl.integer("length")
      tbl.string("genre")
      tbl.boolean("sequel").defualtTo(false)
      tbl.integer("user_Id")
       .unsigned()
       .notNullable()
       .reference('id')
       .inTable('users')
       .onDelete('CASCADE')
    })
    .createTableIfNotExists('greatestHits', tbl => {
      tbl.increments()
      tbl.string("name")
      tbl.string("genre")
      tbl.integer("length")
      tbl.integer("user_Id")
       .unsigned()
       .notNullable()
       .reference('id')
       .inTable('users')
       .onDelete('CASCADE')
    })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExist('users')
};
