const BaseModel = require('./base')

module.exports = class Product extends BaseModel {
    constructor(connection) {
        super('products', connection)
        this.options = {
            //table: 'products',
            //optionalField: {query: 'employeeId', field_name: 'employee_id'},
            list: {
                allowed_search_keys: [
                    'product_id',
                    'name',
                    'barcode'
                ],
                fields: [],
                //orderBy: [order_field('name', 'ASC'), order_field('last_name', 'ASC')]
            },
            insert: {
                fields: [
                    'product_id',
                    'name',
                    'barcode'
                ]
            },
            update: {
                fields: [
                    'product_id',
                    'name',
                    'barcode',
                ]
            },
            delete: {
                queryField: 'id'
            }
        }
    }
}