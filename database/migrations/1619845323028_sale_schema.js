'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SaleSchema extends Schema {
  up () {
    this.create('sales', (table) => {
      table
        .increments()
        .primary()
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
      table
        .integer('client_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clients')
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
      table.timestamps()
    })
  }

  down () {
    this.drop('sales')
  }
}

module.exports = SaleSchema
