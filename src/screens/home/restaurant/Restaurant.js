import React, { Component } from 'react';
import "./Restaurant.css";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';



class Restaurant extends Component {

	constructor(props) {
		super(props)
	}

	clickCardHandler = (id) => {
		let detailsPageUrl = '/restaurant/' + id;
		return this.props.history.push(detailsPageUrl)
	}

	render() {
		const index = this.props.index;
		const classes = this.props.classes;
		return (
			<div className="cardContainer" onClick={this.clickCardHandler.bind(this.props.restaurantId)} key={index}>
				<Card style={{ width: "95%", height: "100%" }} className={classes.restaurantCard} key={index}>
					<CardMedia
						component="img"
						alt={this.props.restaurantName}
						height="160"
						image={this.props.restaurantURL}
					/>
					<CardContent >
						<Typography gutterBottom variant="h5" component="h4">
							{this.props.restaurantName}
						</Typography>
						<div><br />
							<Typography style={{ height: "25px", display: "block" }} variant="subtitle1" >
								{this.props.restaurantFoodCategories}
							</Typography>
							<br /><br />
						</div>
					</CardContent>
					<div className="rating-container">
						<div className="rating-stars">
							<span><i className="fa fa-star"></i></span>
							<span style={{ fontSize: "90%", marginLeft: "5%" }}> {this.props.restaurantCustomerRating} ({this.props.restaurantNumberCustRated})</span>
						</div>
						<div className="avg-price">
							<span><i className="fa fa-inr"></i><span style={{ fontSize: "90%", fontWeight: "bold" }}>{this.props.averagePrice} for two </span></span>
						</div>
					</div>
				</Card>
			</div>
		)
	}

}

export default withRouter(Restaurant);
