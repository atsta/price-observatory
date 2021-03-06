import React from "react";
import {Row} from 'reactstrap';

class Range extends React.Component {
  constructor(props) {
    super(props);
    this.updateRange = this.updateRange.bind(this);
  }
  
  updateRange(e) {
    this.props.updateRange(e.target.value);
  }
  
  render() {
    // console.log(this.props);
    const { range } = this.props;
    return (
      <div>
       
      <Row>
          <input className="range" type="range"
            value={range} 
            min="0"
            max="150"
            step="1"
            onChange={this.updateRange}
          />

          <span htmlFor="range" className="price" id="price">{range}€</span>

          </Row>
       </div>
    );
  }
}

export default Range;

