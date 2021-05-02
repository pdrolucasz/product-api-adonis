'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Sale = use('App/Models/Sale')
const Product = use('App/Models/Product')

/**
 * Resourceful controller for interacting with sales
 */
class SaleController {
  /**
   * Show a list of all sales.
   * GET sales
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index () {
    const sales = await Sale.query().with('product').with('client').fetch()

    return sales
  }

  /**
   * Create/save a new sale.
   * POST sales
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request }) {
    const { product_id, client_id } = request.only(['product_id', 'client_id'])

    const { category_id } = await Product.findOrFail(product_id)

    const data = {
      product_id,
      client_id,
      category_product_id: category_id
    }

    const sale = await Sale.create({ ...data })

    return sale
  }

  /**
   * Display a single sale.
   * GET sales/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const product = await Sale.query().where('id', params.id).with('product').with('client').fetch()

    return product
  }

  /**
   * Update sale details.
   * PUT or PATCH sales/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    const { product_id, client_id } = request.only(['product_id', 'client_id'])

    const { category_id } = await Product.findOrFail(product_id)

    const sale = await Sale.findOrFail(params.id)

    sale.product_id = product_id
    sale.client_id = client_id
    sale.category_product_id = category_id

    await sale.save()

    return sale
  }

  /**
   * Delete a sale with id.
   * DELETE sales/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params }) {
    const sale = await Sale.findOrFail(params.id)

    await sale.delete()
  }
}

module.exports = SaleController
