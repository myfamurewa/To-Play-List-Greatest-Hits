
exports.up = function(knex) {
    return knex.schema
    .createTableIfNotExists('users', tbl => {
        tbl.increments();
        tbl.string('username').notNullable();
        tbl.string('email').notNullable();
        tbl.string('password').notNullable();
      })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExist('users')
};
