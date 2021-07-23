import React from 'react';
import "./Restaurant.css";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';


const Restaurant = function(props){
    const index = props.index;
	const classes = props.classes;
    
    clickCardHandler = () => {
        let detailsPageUrl = '/restaurant/'+ props.restaurantId; 
        return props.history.push(detailsPageUrl)
    }

    return (
		<div className="cardContainer" onClick={this.clickCardHandler} key={index}>
			<Card style={{width:"95%",height:"100%"}} className={classes.restaurantCard} key={index}>			
					<CardMedia
						component="img"
						alt={props.restaurantName}
						height="160"
						image={props.restaurantURL}
					/>
					<CardContent >
						<Typography gutterBottom variant="h5" component="h4">
							{props.restaurantName}
						</Typography>
						<div><br />
						<Typography style={{height:"25px",display:"block"}}variant="subtitle1" >
							{props.restaurantFoodCategories}
						</Typography>
						<br /><br />
						</div>
					</CardContent>		
					<div className="rating-container">
								<div className="rating-stars">
									<span><i className="fa fa-star"></i></span>
									<span style={{fontSize:"90%", marginLeft:"5%"}}> {props.restaurantCustomerRating} ({props.restaurantNumberCustRated})</span>
								</div>
								<div className="avg-price">
									<span><i className="fa fa-inr"></i><span style={{fontSize:"90%",fontWeight:"bold"}}>{props.averagePrice} for two </span></span>                            
								</div>
							</div>				
			</Card>
		</div>
    )

}

export default withRouter(Restaurant);
