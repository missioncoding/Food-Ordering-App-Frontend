import React, { Component } from "react";
import Header from "../../common/header/Header";
import "./Checkout.css";
import "font-awesome/css/font-awesome.min.css";


import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import FilledInput from "@material-ui/core/FilledInput";
import Divider from "@material-ui/core/Divider";
import { Redirect } from "react-router-dom";



const styles = (theme) => ({
  stepper: {
    //Style for the stepper
    "padding-top": "0px",
    "@media (max-width:600px)": {
      padding: "0px",
    },
  },
  tab: {
    //Style for the tab
    "font-weight": 500,
    "@media (max-width:600px)": {
      width: "50%",
    },
  },
  gridList: {
    //Style for the Grid List
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  gridListTile: {
    //Style for the Grid list tile .
    textAlign: "left",
    margin: "30px 0px 20px 0px",
    "border-style": "solid",
    "border-width": "0.5px 3px 3px 0.5px",
    "border-radius": "10px",
    padding: "8px",
  },
  addressCheckButton: {
    // Style fro the address check button
    float: "right",
  },
  saveAddressForm: {
    //Style for the save address form
    width: "60%",
    padding: "20px",
    textAlign: "left",
  },
  formControl: {
    //Style for the formcontrol
    width: "200px",
  },
  selectField: {
    //Style for the select field
    width: "100%",
  },
  formButton: {
    // Style for the button in the form
    "font-weight": 400,
    width: "150px",
  },
  gridContent: {
    width: "fit-content",
    height: "fit-content",
  },
  actionsContainer: {
    //Style for the action container in the stepper
    marginBottom: theme.spacing(2),
  },
  button: {
    //style for the button in the stepper
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  resetContainer: {
    // Style for the reset container
    padding: theme.spacing(3),
  },
  summaryHeader: {
    //Style for the summary heading
    "margin-left": "10px",
    "margin-right": "10px",
  },
  cardContent: {
    //Style for the Order summary card content
    "padding-top": "0px",
    "margin-left": "10px",
    "margin-right": "10px",
  },
  restaurantName: {
    //Style for the restaurant name
    "font-size": "18px",
    color: "rgb(85,85,85)",
    margin: "10px 0px 10px 0px",
  },
  menuItemName: {
    //Style for the menu item in the summary card
    "margin-left": "10px",
    color: "grey",
  },
  itemQuantity: {
    // Style for the Item quantity
    "margin-left": "auto",
    "margin-right": "30px",
    color: "grey",
  },

  applyButton: {
    //Style for the apply button
    height: "40px",
  },
  divider: {
    //Style for the divider
    margin: "10px 0px",
  },
  placeOrderButton: {
    //Style for the Place order button in the order card
    "font-weight": "400",
  },
});

// Custom component created for the use in the tab
const TabContainer = function (props) {
  return (
    <Typography className={props.className} component="div">
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      steps: this.getSteps(),
      value: 0,
      addresses: [],
      noOfColumn: 3,
      isLoggedIn:
        sessionStorage.getItem("access-token") === null ? false : true,
      selectedAddress: "",
      flatBuildingName: "",
      flatBuildingNameRequired: "dispNone",
      locality: "",
      localityRequired: "dispNone",
      city: "",
      cityRequired: "dispNone",
      selectedState: "",
      stateRequired: "dispNone",
      pincode: "",
      pincodeRequired: "dispNone",
      pincodeHelpText: "dispNone",
      states: [],
      accessToken: sessionStorage.getItem("access-token"),
      selectedPayment: "",
      payment: [],
      snackBarOpen: false,
      snackBarMessage: "",
      cartItems: [],
      restaurantDetails: [],
      coupon: null,
      couponName: ""
    };
  }

  //This method is called to get the array of steps name.
  getSteps = () => {
    return ["Delivery", "Payment"];
  };

  //This method handles change in the tabs.
  tabsChangeHandler = (event, value) => {
    this.setState({
      value,
    });
  };

  // This method is called when the save address button is clicked from the address form
  saveAddressClickHandler = () => {
    if (this.saveAddressFormValid()) {
      //checking the form validity is right only then the api call is made
      let newAddressData = JSON.stringify({
        //Creating data of address to be sent to the end point.
        city: this.state.city,
        flat_building_name: this.state.flatBuildingName,
        locality: this.state.locality,
        pincode: this.state.pincode,
        state_uuid: this.state.selectedState,
      });

      let xhrSaveAddress = new XMLHttpRequest();
      let that = this;

      xhrSaveAddress.addEventListener("readystatechange", function () {
        if (xhrSaveAddress.readyState === 4 && xhrSaveAddress.status === 201) {
          that.setState({
            ...that.state,
            value: 0,
          });
          that.getAllAddress();
        }
      });

      xhrSaveAddress.open("POST", this.props.baseUrl + "address");
      xhrSaveAddress.setRequestHeader(
        "authorization",
        "Bearer " + this.state.accessToken
      );
      xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
      xhrSaveAddress.send(newAddressData);
    }
  };

  //This method checks the validity of the form submitted.
  saveAddressFormValid = () => {
    let flatBuildingNameRequired = "dispNone";
    let cityRequired = "dispNone";
    let localityRequired = "dispNone";
    let stateRequired = "dispNone";
    let pincodeRequired = "dispNone";
    let pincodeHelpText = "dispNone";
    let saveAddressFormValid = true;

    if (this.state.flatBuildingName === "") {
      //checking if the flatBuildingName is not empty
      flatBuildingNameRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.locality === "") {
      //checking if the locality is not empty
      localityRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.selectedState === "") {
      //checking if the selectedState is not empty
      stateRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.city === "") {
      //checking if the city is not empty
      cityRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.pincode === "") {
      //checking if the pincode is not empty
      pincodeRequired = "dispBlock";
      saveAddressFormValid = false;
    }
    if (this.state.pincode !== "") {
      var pincodePattern = /^\d{6}$/;
      if (!this.state.pincode.match(pincodePattern)) {
        //checking the format of the pincode
        pincodeHelpText = "dispBlock";
        saveAddressFormValid = false;
      }
    }
    this.setState({
      ...this.state,
      flatBuildingNameRequired: flatBuildingNameRequired,
      cityRequired: cityRequired,
      localityRequired: localityRequired,
      stateRequired: stateRequired,
      pincodeRequired: pincodeRequired,
      pincodeHelpText: pincodeHelpText,
    });

    return saveAddressFormValid;
  };

  //This method handles change in the input of FlatBuildingNameChangeHandler
  inputFlatBuildingNameChangeHandler = (event) => {
    this.setState({
      ...this.state,
      flatBuildingName: event.target.value,
    });
  };

  //This method handles change in the input of locality
  inputLocalityChangeHandler = (event) => {
    this.setState({
      ...this.state,
      locality: event.target.value,
    });
  };

  //This method handles change in the input of city
  inputCityChangeHandler = (event) => {
    this.setState({
      ...this.state,
      city: event.target.value,
    });
  };

  //This method handles change in the input of state
  selectSelectedStateChangeHandler = (event) => {
    this.setState({
      ...this.state,
      selectedState: event.target.value,
    });
  };

  //This method handles change in the input of pincode
  inputPincodeChangeHandler = (event) => {
    this.setState({
      ...this.state,
      pincode: event.target.value,
    });
  };

  //This method is called when back button is clicked in the stepper
  backButtonClickHandler = () => {
    let activeStep = this.state.activeStep;
    activeStep--;
    this.setState({
      ...this.state,
      activeStep: activeStep,
    });
  };

  //This method is called when the change button in the stepper is called
  changeButtonClickHandler = () => {
    this.setState({
      ...this.state,
      activeStep: 0,
    });
  };

  //This method is called when next button is clicked in the stepper.
  nextButtonClickHandler = () => {
    if (this.state.value === 0) {
      if (this.state.selectedAddress !== "") {
        let activeStep = this.state.activeStep;
        activeStep++;
        this.setState({
          ...this.state,
          activeStep: activeStep,
        });
      } else {
        this.setState({
          ...this.state,
          snackBarOpen: true,
          snackBarMessage: "Select Address",
        });
      }
    }
    if (this.state.activeStep === 1) {
      if (this.state.selectedPayment === "") {
        let activeStep = this.state.activeStep;
        this.setState({
          ...this.state,
          activeStep: activeStep,
          snackBarOpen: true,
          snackBarMessage: "Select Payment",
        });
      }
    }
  };

  // This Method is called when the address is selected from the existing address tab
  addressSelectedClickHandler = (addressId) => {
    let addresses = this.state.addresses;
    let selectedAddress = "";
    addresses.forEach((address) => {
      if (address.id === addressId) {
        address.selected = true;
        selectedAddress = address.id;
      } else {
        address.selected = false;
      }
    });
    this.setState({
      ...this.state,
      addresses: addresses,
      selectedAddress: selectedAddress,
    });
  };

  //This is called when a radio button is selected  in the payment
  radioChangeHandler = (event) => {
    this.setState({
      ...this.state,
      selectedPayment: event.target.value,
    });
  };

  //This method handles the snackbar close call
  snackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      ...this.state,
      snackBarMessage: "",
      snackBarOpen: false,
    });
  };

  componentDidMount() {
    if (this.state.isLoggedIn) {
      //Calling getAllAddress function to get all the address of the customer.
      this.getAllAddress();
      this.setState({ cartItems: this.props.history.location.state.cartItems });
      this.setState({ restaurantDetails: this.props.history.location.state.restaurantDetails });
      //API call to get all states
      let statesData = null;
      let xhrStates = new XMLHttpRequest();
      let that = this;
      xhrStates.addEventListener("readystatechange", function () {
        if (xhrStates.readyState === 4 && xhrStates.status === 200) {
          let states = JSON.parse(xhrStates.responseText).states;
          that.setState({
            ...that.state,
            states: states,
          });
        }
      });
      xhrStates.open("GET", this.props.baseUrl + "states");
      xhrStates.send(statesData);

      //API call to get all payment methods
      let paymentData = null;
      let xhrPayment = new XMLHttpRequest();
      xhrPayment.addEventListener("readystatechange", function () {
        if (xhrPayment.readyState === 4 && xhrPayment.status === 200) {
          let payment = JSON.parse(xhrPayment.responseText).paymentMethods;
          that.setState({
            ...that.state,
            payment: payment,
          });
        }
      });
      xhrPayment.open("GET", this.props.baseUrl + "payment");
      xhrPayment.send(paymentData);

      window.addEventListener("resize", this.getGridListColumn); //Adding a event listening on the  to change the no of columns for the grid.
    }
  }

  // Updates the column no as per the screen size.
  getGridListColumn = () => {
    if (window.innerWidth <= 600) {
      this.setState({
        ...this.state,
        noOfColumn: 2,
      });
    } else {
      this.setState({
        ...this.state,
        noOfColumn: 3,
      });
    }
  };

  //This method returns Subtotal.
  getSubTotal = () => {
    let subTotal = 0;
    this.state.cartItems.forEach((cartItem) => {
      subTotal = subTotal + cartItem.totalAmount;
    });
    return subTotal;
  };


  //This method returns net amount.
  getNetAmount = () => {
    let netAmount = this.getSubTotal();
    return netAmount;
  };

  getAllAddress = () => {
    let data = null;
    let that = this;
    let xhrAddress = new XMLHttpRequest();

    xhrAddress.addEventListener("readystatechange", function () {
      if (xhrAddress.readyState === 4 && xhrAddress.status === 200) {
        let addresses = [];
        let responseAddresses = JSON.parse(xhrAddress.responseText).addresses;
        if (responseAddresses !== null) {
          responseAddresses.forEach((responseAddress) => {
            let address = {
              id: responseAddress.id,
              city: responseAddress.city,
              flatBuildingName: responseAddress.flat_building_name,
              locality: responseAddress.locality,
              pincode: responseAddress.pincode,
              state: responseAddress.state,
              selected: false,
            };
            addresses.push(address);
          });
        }
        that.setState({
          ...that.state,
          addresses: addresses,
        });
      }
    });

    xhrAddress.open("GET", this.props.baseUrl + "address/customer");
    xhrAddress.setRequestHeader(
      "authorization",
      "Bearer " + this.state.accessToken
    );
    xhrAddress.send(data);
  };

  // This method is called when the placeOrderButton is Clicked.
  placeOrderButtonClickHandler = () => {
    let item_quantities = [];
    this.state.cartItems.forEach((cartItem) => {
      item_quantities.push({
        item_id: cartItem.id,
        price: cartItem.totalAmount,
        quantity: cartItem.quantity,
      });
    });
    let newOrderData = JSON.stringify({
      //Creating the data as required.
      address_id: this.state.selectedAddress,
      bill: Math.floor(Math.random() * 100),
      coupon_id: this.state.coupon !== null ? this.state.coupon.id : "",
      discount: this.state.discount !== null ? this.state.discount : "",
      item_quantities: item_quantities,
      payment_id: this.state.selectedPayment,
      restaurant_id: this.state.restaurantDetails.id,
    });
    let that = this;
    let xhrOrder = new XMLHttpRequest();
    xhrOrder.addEventListener("readystatechange", function () {
      if (xhrOrder.readyState === 4) {
        if (xhrOrder.status === 201) {
          let responseOrder = JSON.parse(xhrOrder.responseText);
          that.setState({
            ...that.state,
            snackBarOpen: true,
            snackBarMessage:
              "Order placed successfully! Your order ID is " + responseOrder.id,
          });
        } else {
          that.setState({
            ...that.state,
            snackBarOpen: true,
            snackBarMessage: "Unable to place your order! Please try again!",
          });
        }
      }
    });
    xhrOrder.open("POST", this.props.baseUrl + "order");
    xhrOrder.setRequestHeader(
      "authorization",
      "Bearer " + this.state.accessToken
    );
    xhrOrder.setRequestHeader("Content-Type", "application/json");
    xhrOrder.send(newOrderData);
  };

  //This method is called every time the page is rendered to check if the customer is logged in if not then redirected to the home page.
  redirectToHome = () => {
    if (!this.state.isLoggedIn) {
      return <Redirect to="/" />;
    }
  };
  logoutHandler = () => {
    sessionStorage.clear();
    this.props.history.push({
      pathname: '/'
    });
    window.location.reload();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.redirectToHome() /*This method is called to check if logged in or not else redirected to home.*/}
        <Header history={this.props.history}
          logoutHandler={this.logoutHandler}
        />
        <div className="checkout-container">
          <div className="stepper-container">
            <Stepper
              activeStep={this.state.activeStep}
              orientation="vertical"
              className={classes.stepper}
            >
              {this.state.steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {index === 0 ? (
                      <div className="address-container">
                        <Tabs
                          className="address-tabs"
                          value={this.state.value}
                          onChange={this.tabsChangeHandler}
                        >
                          <Tab
                            label="EXISTING ADDRESS"
                            className={classes.tab}
                          />
                          <Tab label="NEW ADDRESS" className={classes.tab} />
                        </Tabs>
                        {this.state.value === 0 && (
                          <TabContainer>
                            {this.state.addresses.length === 0 ? (
                              <Typography variant="h6" color="textSecondary">
                                There are no saved addresses! You can save an
                                address using the 'New Address' tab or using
                                your 'Profile' menu option.
                              </Typography>
                            ) : (
                              <GridList
                                className={classes.gridList}
                                cols={this.state.noOfColumn}
                                spacing={2}
                                cellHeight="auto"
                              >
                                {this.state.addresses.map((address) => (
                                  <GridListTile
                                    className={classes.gridListTile}
                                    key={address.id}
                                    style={{
                                      borderColor: address.selected
                                        ? "rgb(224,37,96)"
                                        : "white",
                                    }}
                                  >
                                    <div className="grid-list-tile-container">
                                      <Typography
                                        variant="body1"
                                        component="p"
                                        className={classes.gridContent}
                                      >
                                        {address.flatBuildingName}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        component="p"
                                        className={classes.gridContent}
                                      >
                                        {address.locality}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        component="p"
                                        className={classes.gridContent}
                                      >
                                        {address.city}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        component="p"
                                        className={classes.gridContent}
                                      >
                                        {address.state.state_name}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        component="p"
                                        className={classes.gridContent}
                                      >
                                        {address.pincode}
                                      </Typography>
                                      <IconButton
                                        className={classes.addressCheckButton}
                                        onClick={() =>
                                          this.addressSelectedClickHandler(
                                            address.id
                                          )
                                        }
                                      >
                                        <CheckCircleIcon
                                          style={{
                                            color: address.selected
                                              ? "green"
                                              : "grey",
                                          }}
                                        />
                                      </IconButton>
                                    </div>
                                  </GridListTile>
                                ))}
                              </GridList>
                            )}
                          </TabContainer>
                        )}
                        {this.state.value === 1 && (
                          <TabContainer className={classes.saveAddressForm}>
                            <FormControl
                              required
                              className={classes.formControl}
                            >
                              <InputLabel htmlFor="flat-building-name">
                                Flat / Building No.
                              </InputLabel>
                              <Input
                                id="flat-building-name"
                                className="input-fields"
                                flatbuildingname={this.state.flatBuildingName}
                                fullWidth={true}
                                onChange={
                                  this.inputFlatBuildingNameChangeHandler
                                }
                                value={this.state.flatBuildingName}
                              />
                              <FormHelperText
                                className={this.state.flatBuildingNameRequired}
                              >
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl className={classes.formControl}>
                              <InputLabel htmlFor="locality">
                                Locality
                              </InputLabel>
                              <Input
                                id="locality"
                                className="input-fields"
                                locality={this.state.locality}
                                fullWidth={true}
                                onChange={this.inputLocalityChangeHandler}
                                value={this.state.locality}
                              />
                              <FormHelperText
                                className={this.state.localityRequired}
                              >
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl
                              required
                              className={classes.formControl}
                            >
                              <InputLabel htmlFor="city">City</InputLabel>
                              <Input
                                id="city"
                                className="input-fields"
                                type="text"
                                city={this.state.city}
                                fullWidth={true}
                                onChange={this.inputCityChangeHandler}
                                value={this.state.city}
                              />
                              <FormHelperText
                                className={this.state.cityRequired}
                              >
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl
                              required
                              className={classes.formControl}
                            >
                              <InputLabel htmlFor="state">State</InputLabel>
                              <Select
                                id="state"
                                className={classes.selectField}
                                state={this.state.selectedState}
                                onChange={this.selectSelectedStateChangeHandler}
                                MenuProps={{
                                  style: {
                                    marginTop: "50px",
                                    maxHeight: "300px",
                                  },
                                }}
                                value={this.state.selectedState}
                              >
                                {this.state.states.map((state) => (
                                  <MenuItem value={state.id} key={state.id}>
                                    {state.state_name}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText
                                className={this.state.stateRequired}
                              >
                                <span className="red">required</span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl
                              required
                              className={classes.formControl}
                            >
                              <InputLabel htmlFor="pincode">Pincode</InputLabel>
                              <Input
                                id="pincode"
                                className="input-fields"
                                pincode={this.state.pincode}
                                fullWidth={true}
                                onChange={this.inputPincodeChangeHandler}
                                value={this.state.pincode}
                              />
                              <FormHelperText
                                className={this.state.pincodeRequired}
                              >
                                <span className="red">required</span>
                              </FormHelperText>
                              <FormHelperText
                                className={this.state.pincodeHelpText}
                              >
                                <span className="red">
                                  Pincode must contain only numbers and must be
                                  6 digits long
                                </span>
                              </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <br />
                            <Button
                              variant="contained"
                              className={classes.formButton}
                              color="secondary"
                              onClick={this.saveAddressClickHandler}
                            >
                              SAVE ADDRESS
                            </Button>
                          </TabContainer>
                        )}
                      </div>
                    ) : (
                      <div className="payment-container">
                        <FormControl
                          component="fieldset"
                          className={classes.radioFormControl}
                        >
                          <FormLabel component="legend">
                            Select Mode of Payment
                          </FormLabel>
                          <RadioGroup
                            aria-label="payment"
                            nmae="payment"
                            value={this.state.selectedPayment}
                            onChange={this.radioChangeHandler}
                          >
                            {this.state.payment.map((payment) => (
                              <FormControlLabel
                                key={payment.id}
                                value={payment.id}
                                control={<Radio />}
                                label={payment.payment_name}
                              ></FormControlLabel>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
                    )}
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={this.state.activeStep === 0}
                          onClick={this.backButtonClickHandler}
                          className={classes.button}
                        >
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.nextButtonClickHandler}
                          className={classes.button}
                        >
                          {this.state.activeStep === this.state.steps.length - 1
                            ? "Finish"
                            : "Next"}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {this.state.activeStep === this.state.steps.length && (
              <Paper square elevation={0} className={classes.resetContainer}>
                <Typography>
                  View the summary and place your order now!
                </Typography>
                <Button
                  onClick={this.changeButtonClickHandler}
                  className={classes.button}
                >
                  Change
                </Button>
              </Paper>
            )}
          </div>
          <div className="summary-container">
            <Card className={classes.summary}>
              <CardHeader
                title="Summary"
                titleTypographyProps={{
                  variant: "h5",
                }}
                className={classes.summaryHeader}
              />
              <CardContent className={classes.cardContent}>
                <Typography
                  variant="subtitle1"
                  component="p"
                  className={classes.restaurantName}
                >
                  {this.state.restaurantDetails.name}
                </Typography>
                {this.state.cartItems.map((cartItem) => (
                  <div className="menu-item-container" key={cartItem.id}>
                    <i
                      className="fa fa-stop-circle-o"
                      aria-hidden="true"
                      style={{
                        color:
                          cartItem.itemType === "NON_VEG"
                            ? "#BE4A47"
                            : "#5A9A5B",
                      }}
                    ></i>
                    <Typography
                      variant="subtitle1"
                      component="p"
                      className={classes.menuItemName}
                      id="summary-menu-item-name"
                    >
                      {cartItem.name[0].toUpperCase() + cartItem.name.slice(1)}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      component="p"
                      className={classes.itemQuantity}
                    >
                      {cartItem.quantity}
                    </Typography>
                    <div className="summary-item-price-container">
                      <i
                        className="fa fa-inr"
                        aria-hidden="true"
                        style={{ color: "grey" }}
                      ></i>
                      <Typography
                        variant="subtitle1"
                        component="p"
                        className={classes.itemPrice}
                        id="summary-item-price"
                      >
                        {cartItem.totalAmount.toFixed(2)}
                      </Typography>
                    </div>
                  </div>
                ))}

                <Divider className={classes.divider} />
                <div className="label-amount-container">
                  <Typography
                    variant="subtitle2"
                    component="p"
                    className={classes.netAmount}
                  >
                    Net Amount
                  </Typography>
                  <div className="amount">
                    <i
                      className="fa fa-inr"
                      aria-hidden="true"
                      style={{ color: "grey" }}
                    ></i>
                    <Typography
                      variant="subtitle1"
                      component="p"
                      className={classes.itemPrice}
                      id="summary-net-amount"
                    >
                      {this.getNetAmount().toFixed(2)}
                    </Typography>
                  </div>
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={true}
                  className={classes.placeOrderButton}
                  onClick={this.placeOrderButtonClickHandler}
                >
                  PLACE ORDER
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <div>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={this.state.snackBarOpen}
            autoHideDuration={4000}
            onClose={this.snackBarClose}
            TransitionComponent={this.state.transition}
            ContentProps={{
              "aria-describedby": "message-id",
            }}
            message={<span id="message-id">{this.state.snackBarMessage}</span>}
            action={
              <IconButton color="inherit" onClick={this.snackBarClose}>
                <CloseIcon />
              </IconButton>
            }
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Checkout);