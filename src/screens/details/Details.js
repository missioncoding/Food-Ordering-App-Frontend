import React, { Component } from "react";
import Typography from '@material-ui/core/Typography';
import { withStyles, CardContent } from '@material-ui/core';
import './Details.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core'
import '@fortawesome/free-regular-svg-icons'
import '@fortawesome/free-brands-svg-icons'
import '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import "font-awesome/css/font-awesome.min.css";


import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Fade from '@material-ui/core/Fade';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Button from '@material-ui/core/Button';

// Custom Styles to over ride material ui default styles
const styles = (theme => ({

    textRatingCost: { //Style for the Text of the Rating and cost.
        'text-overflow': 'clip',
        'width': '145px',
        'color': 'grey'
    },
    restaurantName: { //Style for the Restaurant name.
        'padding': '8px 0px 8px 0px',
        'font-size': '30px',
    },
    restaurantCategory: { //Style for the Restaurant Category.
        'padding': '8px 0px 8px 0px'
    },
    avgCost: { //Style for the Average cost.
        'padding-left': '5px',
    },
    itemPrice: { //Style for the Item prices.
        'padding-left': '5px'
    }
}
));
class Details extends Component {
    constructor() {
        super()
        this.state = {
            restaurantDetails: [],
            categories: [],
            cartItems: [],
            totalAmount: 0,
            snackBarOpen: false,
            snackBarMessage: "",
            transition: Fade,
            badgeVisible: false,
        }
    }

    componentDidMount() {
        let data = null;
        let that = this;
        let xhrRestaurantDetails = new XMLHttpRequest()


        xhrRestaurantDetails.addEventListener("readystatechange", function () {
            if (xhrRestaurantDetails.readyState === 4 && xhrRestaurantDetails.status === 200) {
                let response = JSON.parse(xhrRestaurantDetails.responseText);
                let categoriesName = [];
                //Creating array of category.
                response.categories.forEach(category => {
                    categoriesName.push(category.category_name);
                });
                //Creating Restaurant object containing relevant details.
                let restaurantDetails = {
                    id: response.id,
                    name: response.restaurant_name,
                    photoURL: response.photo_URL,
                    avgCost: response.average_price,
                    rating: response.customer_rating,
                    noOfCustomerRated: response.number_customers_rated,
                    locality: response.address.locality,
                    categoriesName: categoriesName.toString(),
                }
                let categories = response.categories;
                that.setState({
                    ...that.state,
                    restaurantDetails: restaurantDetails,
                    categories: categories,

                })
            }

        })
        //Calling the api to get details of the restaurant by id.
        xhrRestaurantDetails.open('GET', 'http://localhost:8080/api/restaurant/246165d2-a238-11e8-9077-720006ceb890')
        xhrRestaurantDetails.send(data);
    }


    render() {
        const { classes } = this.props;
        return (
            <div className="shopping-list">
                <div className="panel-restaurant-details">
                    <div>
                        <img className="Image-details" src={this.state.restaurantDetails.photoURL} alt="Restaurant" height="215px" width="275px" />
                    </div>
                    <div className="restaurant-details">
                        <div className="restaurant-name">
                            <Typography variant="h5"
                                component="h5"
                                className={classes.restaurantName}>
                                {this.state.restaurantDetails.name}
                            </Typography>
                            <Typography variant="subtitle1"
                                component="p"
                                className={classes.restaurantLocation} >
                                {this.state.restaurantDetails.locality}
                            </Typography>
                            <Typography variant="subtitle1"
                                component="p"
                                className={classes.restaurantCategory}>
                                {this.state.restaurantDetails.categoriesName}
                            </Typography>
                        </div>
                        <div className="restaurant-rating-cost-container">
                            <div className="restaurant-rating-container">
                                <div className="restaurant-rating">
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <Typography variant="subtitle1" component="p">{this.state.restaurantDetails.rating}</Typography>
                                </div>
                                <Typography
                                    variant="caption"
                                    component="p"
                                    className={classes.textRatingCost}
                                >
                                    AVERAGE RATING BY{" "}
                                    {
                                        <span className="restaurant-NoOfCustomerRated">
                                            {this.state.restaurantDetails.noOfCustomerRated}
                                        </span>
                                    }{" "}
                                    CUSTOMERS
                                </Typography>
                            </div>
                            <div className="restaurant-avg-cost-container">
                                <div className="restaurant-avg-cost">
                                    <i className="fa fa-inr" aria-hidden="true"></i>
                                    <Typography variant="subtitle1" component="p" className={classes.avgCost}>
                                        {this.state.restaurantDetails.avgCost}
                                    </Typography>
                                </div>
                                <Typography variant="caption" component="p"  >AVERAGE COST FOR TWO PEOPLE</Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="menu-details-cart-container">
                    <div className="menu-details">
                        {this.state.categories.map(category => (
                            <div key={category.id}>
                                <Typography variant="overline" component="p" className={classes.categoryName} >{category.category_name}</Typography>
                                <Divider />
                                {category.item_list.map(item => (
                                    <div className='menu-item-container' key={item.id}>
                                        <i className="fa fa-stop-circle-o" aria-hidden="true"
                                            style={{ color: item.item_type === "NON_VEG" ? "#BE4A47" : "#5A9A5B", }}>
                                        </i>
                                        <Typography variant="subtitle1" component="p"
                                            className={classes.menuItemName} >
                                            {item.item_name[0].toUpperCase() + item.item_name.slice(1)}
                                        </Typography>

                                        <div className="item-price">
                                            <i className="fa fa-inr" aria-hidden="true"></i>
                                            <Typography variant="subtitle1" component="p" className={classes.itemPrice} >
                                                {item.price.toFixed(2)}
                                            </Typography>
                                        </div>
                                        <IconButton className={classes.addButton} aria-label="add" onClick={() => this.itemAddButtonClickHandler(item)}>
                                            <AddIcon />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="my-cart">
                        <Card className={classes.myCart}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="shopping-cart" className={classes.shoppingCart}>
                                        <Badge badgeContent={this.state.cartItems.length} color="primary" showZero={true} invisible={this.state.badgeVisible} className={classes.badge}>
                                            <ShoppingCartIcon />
                                        </Badge>
                                    </Avatar>
                                }
                                title="My Cart"
                                titleTypographyProps={{
                                    variant: 'h6'
                                }}
                                className={classes.cartHeader}
                            />
                            <CardContent className={classes.cardContent}>
                                {this.state.cartItems.map(cartItem => ( //Iterating over each item in cartItem to show in the cart.
                                    <div className="cart-menu-item-container" key={cartItem.id}>
                                        <i className="fa fa-stop-circle-o" aria-hidden="true"
                                            style={{ color: cartItem.item_type === "NON_VEG" ? "#BE4A47" : "#5A9A5B", }}>
                                        </i>
                                        <Typography variant="subtitle1"
                                            component="p"
                                            className={classes.menuItemName}
                                            id="cart-menu-item-name" >
                                            {cartItem.name[0].toUpperCase() + cartItem.name.slice(1)}
                                        </Typography>
                                        <div className="quantity-container">
                                            <IconButton className={classes.cartItemButton}
                                                id="minus-button"
                                                aria-label="remove"
                                                onClick={() => this.minusButtonClickHandler(cartItem)} >
                                                <FontAwesomeIcon icon="minus" size="xs" color="black" />
                                            </IconButton>
                                            <Typography variant="subtitle1" component="p"
                                                className={classes.itemQuantity}>{cartItem.quantity}
                                            </Typography>
                                            <IconButton className={classes.cartItemButton}
                                                aria-label="add"
                                                onClick={() => this.cartAddButtonClickHandler(cartItem)}>
                                                <FontAwesomeIcon icon="plus" size="xs" color="black" />
                                            </IconButton>
                                        </div>
                                        <div className="item-price">
                                            <i class="fa-solid fa-indian-rupee-sign"></i>
                                            <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="cart-item-price">{cartItem.totalAmount.toFixed(2)}</Typography>
                                        </div>
                                    </div>
                                ))}
                                <div className="total-amount-container">
                                    <Typography variant="subtitle2" component="p" className={classes.totalAmount}>TOTAL AMOUNT</Typography>
                                    <div className="total-price">
                                        <i className="fa fa-inr" aria-hidden="true" ></i>
                                        <Typography variant="subtitle1" component="p" className={classes.itemPrice} id="cart-total-price">{this.state.totalAmount.toFixed(2)}</Typography>
                                    </div>
                                </div>

                                <Button variant="contained" color='primary' fullWidth={true} className={classes.checkOutButton} onClick={this.checkOutButtonClickHandler}>CHECKOUT</Button>

                            </CardContent>

                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}


export default withStyles(styles)(Details);