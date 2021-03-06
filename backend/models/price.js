const BaseModel = require('./base')

module.exports = class Price extends BaseModel {
    constructor(connection) {
        super('prices', connection)
        this.rules = {
            select: {
                allowed_query_keys: [
                    'id',
                    'productId',
                    'shopId',
                    'date',
                    'price',
                    'products.category', // ugly af
                    'tags'
                ],
                selectable_fields: [
                    'prices.id',
                    'price',
                    'date',
                    'dateTo',
                    'prices.shopId AS shopId',
                    'shops.name AS shopName',
                    'shops.address',
                    'products.name AS productName',
                    'prices.productId AS productId',
                    'products.brand AS brand',
                    'products.volume AS volume',
                    'products.category AS category',
                    'products.description AS description',
                    'shops.telephone AS telephone',
                    'products.barcode AS barcode',
                    'shops.lng AS lng',
                    'shops.lat AS lat',
                    'shops.withdrawn AS shopWithdrawn',
                    'products.withdrawn AS productWithdrawn'
                ],
                joins: [{
                    type: 'INNER JOIN',
                    table: 'shops',
                    on:'prices.shopId = shops.id'
                }, {
                    type: 'INNER JOIN',
                    table: 'products',
                    on:'prices.productId = products.id'
                }, {
                    type: 'INNER JOIN',
                    table: 'product_tags',
                    on:'prices.productId = product_tags.productId'
                }, {
                    type: 'INNER JOIN',
                    table: 'shop_tags',
                    on:'prices.shopId = shop_tags.shopId'
                }],
                ambiguous_fields_mappings: {
                    'id': 'prices.id',
                    'name': 'products.name',
                    'shopId': 'prices.shopId',
                    'productId': 'prices.productId'
                }
            },
            insert: {
                required_fields: [
                    'price',
                    'shopId',
                    'productId',
                    'date',
                ],
                optional_fields: ['dateTo']
            },
            update: {
                updatable_fields: [],
                allowed_query_keys: []
            },
            delete: {
                allowed_query_keys: []
            }
        }
    }
}
