'use strict'

const Product = use('App/Models/Product')
const Sale = use('App/Models/Sale')

class BalanceController {
  async show ({ params }) {
    // Todas as vendas da categoria

    const sales_category = await Sale
      .query()
      .where('category_product_id', params.id)
      .with('product')
      .with('client')
      .fetch()

    // Separando todos os ids de produtos

    const productsIdsCounter = sales_category.rows.map(product => {
      return product['$attributes'].product_id
    })

    // Filtrando todos os ids de produtos para tirar repetidos

    const productsIds = productsIdsCounter.sort().filter(function(elem, index, self) {
      return index === self.indexOf(elem);
    })

    // Obtendo o total vendido de cada produto na categoria

    let counter = 0

    const productsData = productsIds.map(product => {
      counter = 0
      for(let i = 0; i < productsIdsCounter.length; i++) {
        if(productsIdsCounter[i] === product){
          counter++
        }
      }
      return [product, counter]
    })

    // Obtendo um array auxiliar para o produto mais vendido da categoria

    let auxMostSold = []

    productsData.forEach((product, index) => {
      if(index === 0) {
        counter = product[1]
      }else if(counter < product[1]) {
        counter = product[1]
        auxMostSold = product
      }
    })

    // Obtendo o produto mais vendido da categoria

    const quantity = auxMostSold[1]
    let mostSold = {}

    sales_category.rows.forEach(product => {
      if(product['$relations'].product['$attributes'].id === auxMostSold[0]) {
        mostSold = {
          ...product['$relations'].product['$attributes'],
          mostSold: product['$relations'].product['$attributes'].value * quantity
        }
      }
    })

    // Média ponderada dos produtos da categoria

    let dividend = 0
    let divider = 0

    sales_category.rows.forEach(product => {
      dividend += product['$relations'].product['$attributes'].value
    })

    productsData.forEach(product => {
      divider += product[1]
    })

    return {
      mostSold,
      average: Number((dividend / divider).toFixed(4)),
      sales: sales_category
    }
  }
}

module.exports = BalanceController
