const BaseModel = require('./base')

module.exports = class Product extends BaseModel {
    constructor(connection) {
        super('products', connection)
        this.options = {
            select: {
                allowed_search_keys: [
                    'id',
                    'name',
                    'barcode'
                ],
                selectable_fields: [],
                //orderBy: [order_field('name', 'ASC'), order_field('last_name', 'ASC')]
            },
            insert: {
                required_fields: [
                    'id',
                    'name',
                    'description',
                    'barcode'
                ],
                optional_fields: [
                    'withdrawn'
                ]
            },
            update: {
                updatable_fields: [
                    'id',   
                    'name',
                    'description',
                    'barcode',
                    'withdrawn',
                ]
            },
            delete: {
                query_field: 'id'
            }
        }
    }
}