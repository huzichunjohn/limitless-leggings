import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'
import { range } from 'lodash'

import { fetchProductById, updateSelectedSize } from '../../redux/products'
import { addCartItem } from '../../redux/cartItems'
import Sidebar from '../Sidebar'

/* -----------------    COMPONENT     ------------------ */

class SingleProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedId: 0,
      selectedSize: '',
      selectedQuantity: 0
    }
    this.updateSelectedSize = this.updateSelectedSize.bind(this)
    this.updateSelectedQuantity = this.updateSelectedQuantity.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.findSelectedProduct = this.findSelectedProduct.bind(this)
  }

  findSelectedProduct() {
    return this.props.selectedProduct.productItems.filter(item => {
      return item.size === this.state.selectedSize
    })
  }

  updateSelectedSize(event) {
    this.setState({
      selectedSize: event.target.value
    })
  }

  updateSelectedQuantity(event) {
    this.setState({
      selectedQuantity: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    let toAdd = {
      product_item_id: this.findSelectedProduct()[0].id,
      quantity: Number(this.state.selectedQuantity)
    }
    this.props.handleAddToCart(toAdd)
  }

  render() {
    const selectedProduct = this.props.selectedProduct
    const selectedSize = this.state.selectedSize
    const selectedQuantity = this.state.selectedQuantity

    const findSelectedProduct = this.findSelectedProduct
    const updateSelectedSize = this.updateSelectedSize
    const updateSelectedQuantity = this.updateSelectedQuantity
    const handleSubmit = this.handleSubmit

    const createQuantityArrayFromSize = () => {
      let selectedItem = findSelectedProduct()
      if (selectedItem[0]) {
        let maxQuantity = selectedItem[0].quantity
        return range(1, maxQuantity + 1)
      } else {
        return ['Please select a size']
      }
    }

    return (
      <div id="main">
      <div className="col-xs-2">
        <Sidebar/>
      </div>
      <div className="col-xs-10">
        <div>
          <div className="col-md-6 col-xs-10">
            <img src={selectedProduct.photoUrl} className="img-thumbnail"/>
          </div>

          <div className="col-md-4 col-xs-8 select-size-quantity">
            <h2>{selectedProduct.title}</h2>
            <p className="productdescription">{selectedProduct.description}</p>
            <hr />
            <FormGroup controlId="formControlsSelect">
              <ControlLabel>Select Size</ControlLabel>
              <FormControl onChange={updateSelectedSize} componentClass="select">
                <option>Select a size here</option>
                {selectedProduct.productItems.map((productItem) => (
                    <option key={productItem.id} value={productItem.size}>{productItem.size}</option>
                  ))}
              </FormControl>

              <ControlLabel>Select Quantity</ControlLabel>
              <FormControl onChange={updateSelectedQuantity} componentClass="select">
                <option>Select a quantity</option>
                {createQuantityArrayFromSize(selectedSize).map((quantity, idx) => (
                  <option key={idx} value={quantity}>{quantity}</option>
                ))}
              </FormControl>
            </FormGroup>

            <form onSubmit={handleSubmit}>
              {
                this.state.selectedQuantity > 0
                ? <Button type="submit" bsStyle="success">Add to Cart</Button>
                : <Button type="submit" bsStyle="success" disabled>Add to Cart</Button>
              }
            </form>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({products}) => ({
  selectedProduct: products.selectedProduct
})

const mapDispatchToProps = (dispatch) => {
  return {
    handleAddToCart: (cartItem) => {
      dispatch(addCartItem(cartItem))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct)
