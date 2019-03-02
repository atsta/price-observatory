import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import { Input, Label } from 'reactstrap';
import {getLocation} from '../functions/current_location';

import { Button, Modal, ModalHeader, ModalBody, Container } from 'reactstrap';

/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

export class MapClass extends Component {
    constructor(props) {
        super(props);
        this.currentLocation = this.currentLocation.bind(this);
        this.state = {current: [], show_current: false,
            markers : this.props.shops, activeMarker: null,  showingInfoWindow: false, modal: false};
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.toggle = this.toggle.bind(this);
    }
    
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    
    async currentLocation ()  {
        var checkBox = document.getElementById("location_map");
        var temp;
        if (!checkBox.checked) {
            temp = this.state.show_current;
            this.setState({ show_current: !temp});
            return;
        }
        
        let result = await getLocation();
        console.log(result);
        temp = this.state.show_current;
        this.setState({ current: [{lat: result[0], lng: result[1]}], show_current: !temp});
    }
 
    onMarkerClick (props, marker, e) {
        this.setState({
          selectedPlace: props,
          activeMarker: marker,
          showingInfoWindow: true
        });
    }
  
    render() {
        return (
            <div>
                <Button color="primary" onClick={this.toggle}>Εμφάνιση αποτελεσμάτων στον χάρτη</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} size="lg">
                
                    <ModalHeader toggle={this.toggle}>
                    <FormGroup check>
                        <Label check>
                        
                        <Col sm={13}> 
                            <Input type="checkbox" id="location_map" onChange={() => this.currentLocation()}/>{' '}
                        </Col>
                            Εμφάνιση Τωρινής Τοποθεσίας
                        </Label>
                        </FormGroup>
                    </ModalHeader>
                   
                    <ModalBody>
                    <Container className="MapClass">
                        <Row className="show-grid">
                        <Col xs={12} md={8}>
                        <Map      
                            google={this.props.google}
                            zoom={11}
                            coordinates={true}
                            initialCenter={{
                                lat: 37.9838,
                                lng: 23.7275
                            }}>
                            {this.state.markers.map(marker => (
                            <Marker
                                className='marker'
                                position={{ lat: marker.lat, lng: marker.lng }}
                                key={marker.id}
                                info={marker}
                                labelStyle={{color: '#fff'}}
                                onClick={this.onMarkerClick}
                                id={marker.id}
                            >
                            </Marker>
                            ))}
                            {this.state.current.map(marker => (
                                this.state.show_current 
                                ? <Marker
                                    position={{ lat: marker.lat, lng: marker.lng }}
                                    key={3} icon={'https://www.robotwoods.com/dev/misc/bluecircle.png'}
                                >
                                </Marker>
                                : null
                                ))}
                                <InfoWindow
                                    marker={this.state.activeMarker}
                                    visible={this.state.showingInfoWindow}>
                                    {this.state.activeMarker
                                    ? <div>
                                        <strong>{this.state.activeMarker.info.name} </strong><br/>
                                        {this.state.activeMarker.info.address} <br/>
                                        {this.state.activeMarker.info.phone} <br/>
                                        {this.state.activeMarker.info.withdrawn 
                                        ? <p className='withdrawnShop'> Αποσυρθέν </p>
                                        : <p className='activeShop'> Ενεργό </p>
                                        }
                                    </div>
                                    : <div></div>
                                    }
                                </InfoWindow>
                        </Map>
                        </Col>
                        </Row>
                        </Container>
                    </ModalBody>
          
                </Modal>
              
            </div>
            
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAsLsF3d7bdPcNMcSwPfb8aUfcadkjOMH0'
})(MapClass);
