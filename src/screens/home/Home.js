import React, { Component } from 'react';
import Header from '../../common/header/Header';
import Restaurant from './restaurant/Restaurant';
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import './Home.css';


const styles = {
    restaurantCard: { width: "90%", cursor: "pointer" }
};

const createRequestURL = (url, paramObj) => {
    if (!(paramObj === undefined || paramObj === null)) {
      let paramString = "";
      for (let key in paramObj) {
        if (paramString !== "") {
            paramString += "&";
        }
        paramString += key + "=" + encodeURIComponent(paramObj[key]);
      }
      url += "?" + paramString;
    }
    return url;
  };


const invokeAPI = (
    requestUrl,
    paramObj,
    requestBodyObj,
    requestType,
    requestHeadersObj,
    successCallback,
    failCallback
  ) => {
    let xhr = new XMLHttpRequest();
    xhr.open(
      requestType,
      createRequestURL(requestUrl, paramObj)
    );
    if (!(requestHeadersObj === undefined || requestHeadersObj === null)) {
      for (let key in requestHeadersObj) {      
        if (!(requestHeadersObj[key] === undefined || requestHeadersObj[key] === null || requestHeadersObj[key] === "")) {
          xhr.setRequestHeader(key, requestHeadersObj[key]);
        }
      }
    }
    (requestBodyObj === undefined || requestBodyObj === null)
      ? xhr.send()
      : xhr.send(JSON.stringify(requestBodyObj));
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        if (xhr.status === 200) {
          if (!(successCallback === undefined || successCallback === null)) {
            successCallback(this.responseText, this.getAllResponseHeaders());
          }
        } else {
          if (!(failCallback === undefined || failCallback === null)) {
            failCallback(this.responseText);
          }
        }
      }
    });
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
        invokeAPI(
            requestUrl,
            null,
            null,
            "GET",
            null,
            responseText => {
                that.setState(
                    {
                        restaurantData: JSON.parse(responseText).restaurants
                    }
                );
            },
            () => { }
        );
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
        if (!(!(searchValue === undefined || searchValue === null) && searchValue === "")) {
            invokeAPI(
                requestUrl,
                null,
                null,
                "GET",
                null,
                responseText => {
                    that.setState(
                        {
                            restaurantData: JSON.parse(responseText).restaurants
                        }
                    );
                },
                () => { }
            );
        } else {
            this.getAllRestaurantsData();
        }
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