import React, { Component } from "react";
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import Home from "../screens/home/Home";
import Details from "../screens/details/Details"
//import Checkout from '../screens/checkout/Checkout';
import Profile from "./profile/Profile";

class Controller extends Component {
    constructor(){
        super();
        this.baseUrl= "http://localhost:8080/api/";
    }

    render(){
        return(
            <Router>
                <div className= "main-container">
                    <Route exact path="/" render={props=> <Home {...props} baseUrl={this.baseUrl}/>} />
                    <Route exact path='/checkout' render={({history},props) => (
                        sessionStorage.getItem('access-token') === null ? (
                            <Redirect to='/' />
                        ) : (
                                <Checkout {...props} baseUrl={this.baseUrl} history={history} />
                            )
                    )} />
                    <Route exact path='/restaurant/:id' render={({history},props) => <Details {...props} baseUrl={this.baseUrl} history={history} />} />
                    <Route path='/profile' render={({history},props) => (
                        sessionStorage.getItem('access-token') === null ? (
                            <Redirect to='/' />
                        ) : (
                                <Profile {...props} baseUrl={this.baseUrl} history={history} />
                            )
                    )} />
                </div>
            </Router>
        );
    }
}

export default Controller