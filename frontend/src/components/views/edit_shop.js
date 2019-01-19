import React, { Component } from "react";
import { browserHistory } from 'react-router';
import MapClass from '../helper_components/map';
import {Categories} from '../helper_components/categories_menu';
import { Input, InputGroupAddon, Button, Form, InputGroup, FormFeedback,
        Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, FormText, Container, Row,  Col, Table, Alert } from 'reactstrap';
import {send_to_server} from '../communication/send';
import {Settings} from '../helper_components/dropdown_settings';
import {receive_from_server} from '../communication/receive';
import Search from '../helper_components/searchComponent';
import cookie from 'react-cookies';
import {put} from '../communication/put';
import {patch} from '../communication/patch';
import { address_to_coords } from '../functions/address_to_coordinates';
import NavBarClass from '../helper_components/navbar';

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function onlyUnique (value, index, self) { 
    return self.indexOf(value) === index;
}

function check_changes (original, edited) {
    const keys = Object.keys(edited);
    var changed = [];
    
    var unchanged = ['withdrawn',  'tags'];
    for (var i=0; i<unchanged.length; i++) {
        var index = keys.indexOf(unchanged[i]); 
        if (index > -1) {
            keys.splice(index, 1);
        }
    }
    
    for (var i=0; i<keys.length; i++) {
        if (original[keys[i]] !== edited[keys[i]]) {
            changed.push(keys[i]);
        }
    }
    
    if (!arraysEqual(original.tags, edited.tags)) {
        changed.push('tags');
    }
    return changed;
}

export default class EditShop extends Component {
    constructor(props) {
        super(props);
        this.request = this.request.bind(this);
        this.state = {flag: false, details: null, name: '', address: '', phone: '', error: null, success: null, not_found: null, tags: '', success_edit: null, error_edit: null, not_found: null};
        this.toggleModal = this.toggleModal.bind(this);
        this.homepage = this.homepage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.currentLocation = this.currentLocation.bind(this);
        this.validatePhone = this.validatePhone.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
     componentDidMount () {        
        this._asyncRequest = this.request().then(
            details => {
                this._asyncRequest = null;
                this.setState({details, tags: details.tags, name: details.name, address: details.address, phone: details.telephone});
            }
        );
    }
    
    componentWilldUnmount() {
        if (this._asyncRequest) {
            this._asyncRequest.cancel();
        }
    }
    
    validatePhone() {
        const phoneRex = /^69\d{8}|^210\d{7}$/;
        var result = null;
        const phone = document.getElementById('edit_shop_phone').value;
        if (phoneRex.test(phone)) {
          result = true;
        } 
        else {
          result = false;
        }
        this.setState({ checkPhone: result });
    }
    
    async currentLocation () {
        var checkBox = document.getElementById("edit_shop_location");
        this.setState({flag: !this.state.flag});
        
        if (!checkBox.checked) {
            return;
        }
        
        let result = await getLocation();
        console.log(result);
        var temp = this.state.show_current;
        this.setState({ current: { latitude: result[0], longitude: result[1], address: result[2]}, show_current: !temp});
    }
    
    async request() {
        const url = 'http://localhost:3002/shops/' + this.props.location.query.id;
        const answer = await receive_from_server(url);
        
        if (answer === 'error') {
            this.setState({error: true});
            return;
        }
        
        if (answer.status === 200) {
            this.setState({success: true});
        }
        else {
            this.setState({not_found: true});
        }
        
        var details = await answer.json().then((result) => {return result;});
        console.log(details);
        this.setState({details: details});
        return details;
    }
    
    handleChange(event) {
        var name = event.target.name;
        this.setState({[name]: event.target.value});
    }
    
    homepage() {
        browserHistory.push('/search');
    }
    
    toggleModal() {
        this.setState({ not_found_edit: !this.state.not_found_edit });
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        event.nativeEvent.stopImmediatePropagation();
        
        this.setState({success_edit: null, error_edit: null, not_found_edit: null});
        
        const name = document.getElementById('edit_shop_name').value;
        const telephone = document.getElementById('edit_shop_phone').value; 
        var tags_list = (document.getElementById('edit_shop_tags').value).split(',');
        
        var tags = [];
        tags_list = tags_list.filter(onlyUnique);
        for (var i=0; i<tags_list.length; i++) {
            var temp = tags_list[i].replace(/\s+/g,' ').trim();
            if (temp === "") continue;
            tags.push(temp);
        }

        tags = tags.filter( onlyUnique );
        if (tags.length > 0) {
            if (tags[0] === "") {
                tags = [];
            }
        }
        
        var lng = null;
        var lat = null;
        var address = null;
        
        var checkBox = document.getElementById("edit_shop_location");
        
        if (checkBox.checked) {
            lng = this.state.current.longitude;
            lat = this.state.current.latitude;
            address = this.state.current.address;
        }
        else {
            address = document.getElementById('edit_shop_address').value;
            var result = await address_to_coords(address);
            if (result) {
                lat = result[0];
                lng = result[1];
                this.setState({error_address: false});
            }
            else {
                this.setState({error_address: true});
                return;
            }
        }
        
        var shop = {
            name,
            address,
            lng,
            lat,
            tags,
            withdrawn: this.state.details.withdrawn
        };
        
        console.log(shop);
        
        var changed = check_changes(this.state.details, shop);
        
        const url = 'http://localhost:3002/shops/' + this.props.location.query.id;
        
        var answer;
        
        if (changed.length === 1) {
            var key = changed[0];
            answer = await patch(url, {key: shop[key]});
        }
        else if (changed.length > 1) {
            answer = await put(url, shop); 
        }
        else {
            browserHistory.push('/shops');
        }
        
        if (answer === 'error') {
            this.setState({error_edit: true});
            return;
        }
        
        if (answer.status === 200) {
            this.setState({success_edit: true});
        }
        else {
            this.setState({not_found_edit: true});
            return;
        }
    }
    
    render() {
      return (
        <div>
            <NavBarClass/>
            
            <Alert color="danger" isOpen={this.state.error===true}>Πρόβλημα με τη σύνδεση. Δοκιμάστε ξανά.</Alert>
            {this.state.details === null
            ?<div> Loading </div>
            : <div>
                <Container className="EditShop">
                <h2 align="center">Επεξεργασία Καταστήματος</h2>
                <hr></hr>
                <Form id="edit_shop" onSubmit={this.handleSubmit}>
                    <Alert color="danger" isOpen={this.state.error===true}>Πρόβλημα με τη σύνδεση. Δοκιμάστε ξανά.</Alert>
                    
                    <FormGroup check row>
                        <Label sm={6} for="name">Όνομα Καταστήματος:</Label>
                        <Col sm={3}>
                            <Input id="edit_shop_name" name="name" value={this.state.name} onChange={this.handleChange} type="text" required/>
                        </Col>
                    </FormGroup>
                    <div className="row mt-3"></div>
                    <FormGroup check>
                        <Label check>
                            <Col sm={9}>
                                <Input type="checkbox" name="location" id="edit_shop_location" onChange={this.handleChange}></Input>
                            </Col>
                            Tωρινή Τοποθεσία
                        </Label>
                    </FormGroup>
                    
                    <FormGroup check row>
                        <Label sm={3} for="address">Διεύθυνση:</Label>
                        <Col sm={3}>
                            <Input invalid={this.state.error_address} value={this.state.address} onChange={this.handleChange} valid={false} id="edit_shop_address" name="address" type="text" disabled={this.state.flag} required/>
                            <FormFeedback valid={!this.state.error_address}>Η διεύθυνση δεν είναι έγκυρη.</FormFeedback>
                        </Col>
                    </FormGroup>
                    <div className="row mt-3"></div>
                    <FormGroup check row>
                        <Label sm={6} for="edit_shop_tags">Χαρακτηριστικά Καταστήματος:
                        <FormText>Διαχωρισμός χαρακτηριστικών με κόμμα (,)</FormText></Label>
                        <Col sm={8}>
                            <Input type="textarea" name="text" id="edit_shop_tags" onChange={this.handleChange} value={this.state.tags}/>
                        </Col>
                    </FormGroup>
                    <div className="row mt-3"></div>
                    <FormGroup check row>
                        <Label sm={6} for="phone">Τηλέφωνο Καταστήματος:</Label>
                        <Col sm={3}>
                            <Input type="tel" id="edit_shop_phone" name="phone" value={this.state.telephone} onChange={this.handleChange} invalid={this.state.checkPhone===false} valid={this.state.checkPhone} onChange={() => this.validatePhone()}/>
                        </Col>
                    </FormGroup>
                    <hr></hr>
                    <div className="text-center">
                        <Button type="submit" id="button1">Αποθήκευση</Button>{' '}
                        <Button type="button" id="button2" onClick={browserHistory.goBack}>Ακύρωση</Button>
                    </div>
                </Form>

                </Container>
            </div>
            }
            
            <Modal isOpen={this.state.not_found_edit} toggle={this.toggleModal}>
                <ModalBody>Η επεξεργασία δεν ολοκληρώθηκε επιτυχώς.</ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggleModal}>Προσπάθεια ξανά</Button>{' '}
                    <Button color="secondary" onClick={this.homepage}>Αρχική σελίδα</Button>
                </ModalFooter>
            </Modal>
                
            <Modal isOpen={this.state.success_edit}>
                <ModalBody>Η επεξεργασία ολοκληρώθηκε επιτυχώς.</ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.homepage}>Αρχική σελίδα</Button>
                </ModalFooter>
            </Modal>
        </div>

          );
    }
}

