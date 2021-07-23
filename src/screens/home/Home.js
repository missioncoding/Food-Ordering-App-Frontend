import React, { Component } from 'react';
import Header from '../../common/header/Header';
import Restaurant from './restaurant/Restaurant';
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import './Home.css';


const styles = {
    restaurantCard: { width: "90%", cursor: "pointer" }
};

class Home extends Component {

    constructor() {
        super();
        this.state = {
            restaurantData: []
       }
    }

    componentDidMount() {
        this.getAllRestaurantsData();
    }

    // Get all restuarants data
    getAllRestaurantsData = () => {
        const requestUrl = this.props.baseUrl + "restaurant";
        const that = this;
        // make api call here
    };

    // redirects to login
    logoutHandler = () => {
        sessionStorage.clear();
        this.props.history.push({
            pathname: "/"
        });
        window.location.reload();
    }

    // Restaurant search by name
    searchRestaurants = event => {
        const searchValue = event.target.value;
        const requestUrl = this.props.baseUrl + "restaurant/name/" + searchValue;
        const that = this;
        // make api call here
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header logoutHandler={this.logoutHandler} baseUrl={this.props.baseUrl} searchRestaurants={this.searchRestaurants} showSearch={true} history={this.props.history} />
                <div className="mainContainer">
                    {
                        this.state.restaurantData === null ? <span style={{ fontSize: "20px" }}>No restaurant with the given name</span>
                            : (
                                (this.state.restaurantData || []).map((item, index) =>
                                    <div key={"rcard" + index} className="restaurantCard">
                                        <Grid className="gridCard" key={index}>
                                            <Restaurant
                                                restaurantId={item.id}
                                                restaurantURL={item.photo_URL}
                                                restaurantName={item.restaurant_name}
                                                restaurantFoodCategories={item.categories}
                                                restaurantCustomerRating={item.customer_rating}
                                                restaurantNumberCustRated={item.number_customers_rated}
                                                averagePrice={item.average_price}
                                                classes={classes}
                                                index={index}
                                            />
                                        </Grid>
                                    </div>
                                )
                            )
                    }
                </div>

            </div>
        )
    }
}

export default withStyles(styles)(Home);