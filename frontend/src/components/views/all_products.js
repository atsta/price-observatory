/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import React, { Component } from "react";
import { browserHistory } from 'react-router';
import ProductsResults from '../helper_components/all_products_papigation';
import { Alert } from 'reactstrap';
import Delete from '../helper_components/delete';
import NavBarClass from '../helper_components/navbar';

export class AllProducts extends Component {
    constructor(props) {
        super(props);
        this.id = null;
        this.state = {products: null, error: null, success: null, not_found: null};
        this.homepage = this.homepage.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.delete_complete = this.delete_complete.bind(this);
    }
    
    delete_complete () {
        this.refs.result.setState({ready: false});
        this.refs.delete.closeall();
        this.refs.result.request();
    }
    
    edit (id) {
        this.id = id;
        console.log(this.id);
        browserHistory.push({
            pathname: '/edit_product',
            search: '?id=' + id.toString()
            }
        );
    }
    
    delete (id, name) {
        this.refs.delete.toggle_delete(id, name);
    }
    
    homepage() {
        browserHistory.push('/');
    }
    
    render() {
        return (
            <div>
                <NavBarClass/>
                <Alert color="danger" isOpen={this.state.error===true}>Πρόβλημα με τη σύνδεση. Δοκιμάστε ξανά.</Alert>
                <ProductsResults ref='result' select={this.select} delete={this.delete} edit={this.edit} search={this.search}/>
                <Delete ref='delete' back={this.delete_complete} category="product" id={this.id} name={this.name}/>
            </div>
        );
    }
};

export default AllProducts;
    
