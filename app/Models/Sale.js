'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Sale extends Model {
  product() {
    return this.belongsTo('App/Models/Product')
  }

  client() {
    return this.belongsTo('App/Models/Client')
  }
}

module.exports = Sale
