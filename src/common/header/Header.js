
import "./Header.css";
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { Component } from "react";
import Input from "@material-ui/core/Input";
import Button from '@material-ui/core/Button';
import Fastfood from '@material-ui/icons/Fastfood';
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Menu from '@material-ui/core/Menu';
import { Link } from 'react-router-dom';
import FormHelperText from '@material-ui/core/FormHelperText';
import AccountCircle from '@material-ui/icons/AccountCircle';
import validator from 'validator'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

const styles = {
  searchField: {
    width: "80%",
    color: "white"
  },
  headerLogo: {
    color: '#FFFFFF',
    fontSize: 32,
  },
  formControl: {
    width: "90%"
  }
}

const TabContainer = function (props) {
  return (
    <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
      {props.children}
    </Typography>
  );
}


TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

class Header extends Component {
  constructor() {
    super();
    this.state = {
      invalidContactNo: "required",
      invalidPassword: "required",
      username: "",
      password: "",
      loginErrorMsg: "",
      usernameRequired: "dispNone",
      passwordRequired: "dispNone",
      loginError: "dispNone",
      loginErrCode: "",
      firstname: "",
      lastname: "",
      loggedIn: sessionStorage.getItem('access-token') == null ? false : true,
      snackBarMsg: "",
      email: "",
      mobile: "",
      signUpPassword: "",
      emailRequired: "dispNone",
      firstnameRequired: "dispNone",
      lastnameRequired: "dispNone",
      mobileRequired: "dispNone",
      signUpPasswordRequired: "dispNone",
      registrationSuccess: false,
      signupError: "dispNone",
      signUpErrorMsg: "",
      signUpErrCode: "",
      anchorEl: null,
      isSnackBarOpen: false,
      isMenuOpen: false,
      isModalOpen: false,
      showUserProfile: false,
      value: 0,
      invalidSignUpFirstname: "required",
      invalidSignUpLastname: "required",
      invalidSignUpEmail: "required",
      invalidSignUpPassword: "required",
      invalidSignUpContactNo: "required",
    }
  }

  changeUsernameHandler = (e) => {
    this.setState({ username: e.target.value })
  }
  changePasswordHandler = (e) => {
    this.setState({ password: e.target.value })
  }
  changeEmailHandler = (e) => {
    this.setState({ email: e.target.value })
  }
  changeFirstNameHandler = (e) => {
    this.setState({ firstname: e.target.value })
  }
  changeLastNameHandler = (e) => {
    this.setState({ lastname: e.target.value })
  }
  changeMobileHandler = (e) => {
    this.setState({ mobile: e.target.value })
  }
  changeSignUpPasswordHandler = (e) => {
    this.setState({ signUpPassword: e.target.value })
  }

  resetLoginOutputs = () => {
    this.setState({ invalidContactNo: "required" });
    this.setState({ invalidPassword: "required"});
    this.setState({ loginErrCode: "" });
    this.setState({ loginErrorMsg: "" });
    this.setState({ usernameRequired: "dispNone" });
    this.setState({ passwordRequired: "dispNone" });
    this.setState({ loginError: "dispNone" });
  }

  validateLoginInputs = () => {
    // validating the inputs
    // before that reset the login inputs
    this.resetLoginOutputs()
    this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
    this.state.password === "" ? this.setState({ passwordRequired: "dispBlock" }) : this.setState({ passwordRequired: "dispNone" });
    //checking if username and password fields are null if so just return
    if (this.state.username === "" || this.state.password === "") {
      return false 
    } else {
      // validating the contact number or username
      let cno = this.state.username;
      if (cno.length !== 10 ||  !(/^\d{10}$/.test(cno)) ) {
        this.setState({ usernameRequired: "dispBlock" });
        this.setState({ invalidContactNo: "Invalid Contact" })
        return false
      }
    }
    return true
  }


  //Login functionality
  loginClickHandler = () => {
    // validating login inputs
    if (!this.validateLoginInputs()) {
        return
    }
    let that = this;
    let loginData = null
    let xhrLogin = new XMLHttpRequest();
    xhrLogin.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        let loginResponse = JSON.parse(xhrLogin.response);
        if (loginResponse.code === 'ATH-001' || loginResponse.code === 'ATH-002') {
          that.setState({ loginError: "dispBlock" });
          that.setState({ loginErrCode: loginResponse.code });
          that.setState({ loginErrorMsg: loginResponse.message });
        } else {
          sessionStorage.setItem('uuid', JSON.parse(this.responseText).id);
          sessionStorage.setItem('access-token', xhrLogin.getResponseHeader('access-token'));
          sessionStorage.setItem('firstName', JSON.parse(this.responseText).first_name);
          that.setState({ firstname: JSON.parse(this.responseText).first_name });
          that.setState({ loggedIn: true });
          that.closeOnlyModalHandler();
          that.setState({ snackBarMsg: "Logged in successfully!" });
          that.postLoginHandler();
        }
      }
    })
    xhrLogin.open("POST", this.props.baseUrl + "customer/login");
    xhrLogin.setRequestHeader("authorization", "Basic " + window.btoa(this.state.username + ":" + this.state.password));
    xhrLogin.setRequestHeader("Content-Type", "application/json");
    xhrLogin.setRequestHeader("Cache-Control", "no-cache");
    xhrLogin.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhrLogin.send(loginData);
  }

  resetSignUpOutputs = () => {
    this.setState({ signUpErrorMsg: "" });
    this.setState({ signUpErrCode: "" });
    this.setState({ signupError: "dispNone" });
    this.setState({ emailRequired: "dispNone" });
    this.setState({ firstnameRequired: "dispNone" });
    this.setState({ lastnameRequired: "dispNone" });
    this.setState({ mobileRequired: "dispNone" });
    this.setState({ signUpPasswordRequired: "dispNone" });
    this.setState({ invalidSignUpFirstname: "required"});
    this.setState({ invalidSignUpLastname: "required"});
    this.setState({ invalidSignUpEmail: "required"});
    this.setState({ invalidSignUpPassword: "required"});
    this.setState({ invalidSignUpContactNo: "required"});
  }

  validateEmail = () => {
    let email = this.state.email;
    let isValidEmail = email.length > 0 ? (validator.isEmail(email) ? true : false) : false
    isValidEmail ? this.setState({ emailRequired: "dispNone" }) : 
                   this.setState({ emailRequired: "dispBlock", invalidSignUpEmail : "Invalid Email"});
    return isValidEmail
  }

  validateSignupPassword = () => {
    let password = this.state.signUpPassword;
    let isValidPassword = password.length > 0 ? (validator.isStrongPassword(password) ? true : false) : false
    isValidPassword ? this.setState({ signUpPasswordRequired: "dispNone" }) : 
                      this.setState({ signUpPasswordRequired: "dispBlock", 
                      invalidSignUpPassword : "Password must contain at least one capital letter, one small letter, one number, and one special character"});
    return isValidPassword
  }

  validateContactnoSignUp = () => {
    let contactno = this.state.mobile;
    let isValidContactno = contactno.length > 0 ? (validator.isMobilePhone(contactno) && contactno.length === 10 ? true : false) : false
    isValidContactno ? this.setState({ mobileRequired: "dispNone" }) : 
                       this.setState({ mobileRequired: "dispBlock", invalidSignUpContactNo: "Contact No. must contain only numbers and must be 10 digits long"})
    return isValidContactno;
  }

  validateSignUpInputs = () => {
    // first reset the outputs to default
    this.resetSignUpOutputs();
    this.state.firstname === "" ? this.setState({ firstnameRequired: "dispBlock" }) : this.setState({ firstnameRequired: "dispNone" });
    this.state.email === "" ? this.setState({ emailRequired: "dispBlock" }) : this.setState({ emailRequired: "dispNone" });
    this.state.signUpPassword === "" ? this.setState({ signUpPasswordRequired: "dispBlock" }) : this.setState({ signUpPasswordRequired: "dispNone" });
    this.state.mobile === "" ? this.setState({ mobileRequired: "dispBlock" }) : this.setState({ mobileRequired: "dispNone" });
    
    if (this.state.firstname === "" || this.state.email === "" || this.state.signUpPassword === "" || this.state.mobile === "") {
      return false 
    } else {
      let isSignupEmailValid = this.validateEmail();
      let isSignupPasswordValid = this.validateSignupPassword();
      let isSignupContactnoValid = this.validateContactnoSignUp();
      if (!(isSignupEmailValid && isSignupPasswordValid && isSignupContactnoValid)) {
        return false
      }
    }
    return true

  }


  //Signup handler
  signUpClickHandler = () => {
    //validating the signup outputs

    // validating login inputs
    if (!this.validateSignUpInputs()) {
       return
    }

    let that = this;
    let dataSignup = {
      'first_name': this.state.firstname,
      'last_name': this.state.lastname,
      'email_address': this.state.email,
      'password': this.state.signUpPassword,
      'contact_number': this.state.mobile,
    };

    let xhrSignup = new XMLHttpRequest();
    xhrSignup.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        let signupResponse = JSON.parse(this.response);
        if (signupResponse.code === 'SGR-001'
          || signupResponse.code === 'SGR-002'
          || signupResponse.code === 'SGR-003'
          || signupResponse.code === 'SGR-004') {
          that.setState({ signupError: "dispBlock" });

          that.setState({ signUpErrCode: signupResponse.code });
          that.setState({ signUpErrorMsg: signupResponse.message });

        } else {
          that.setState({ registrationSuccess: true });
          that.setState({ snackBarMsg: "Registered successfully! Please login now!" });
          that.postSignUpHandler();
        }
      }
    })

    xhrSignup.open("POST", this.props.baseUrl + "customer/signup");
    xhrSignup.setRequestHeader("Content-Type", "application/json");
    xhrSignup.setRequestHeader("Cache-Control", "no-cache");
    xhrSignup.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhrSignup.send(JSON.stringify(dataSignup));
  }

  // initializes all states when modal is clicked
  openModalHandler = () => {
    this.setState({ isModalOpen: true });
    this.setState({ value: 0 });
    this.setState({ email: "" });
    this.setState({ firstname: "" });
    this.setState({ lastname: "" });
    this.setState({ mobile: "" });
    this.setState({ signUpPassword: "" });
    this.setState({ username: ""});
    this.setState({ password: ""});
    this.resetLoginOutputs();
    this.resetSignUpOutputs();
    if(this.props.changeBadgeVisibility){
      this.props.changeBadgeVisibility();
  }
  }

  //Close only modal and keep snack bar open
  closeOnlyModalHandler = () => {
    this.setState({ isModalOpen: false });
    this.setState({ isSnackBarOpen: true });
    if(this.props.changeBadgeVisibility){
            this.props.changeBadgeVisibility();
        }
  }

  //Close modal and snack bar
  closeHandler = () => {
    this.setState({ isModalOpen: false });
    this.setState({ isSnackBarOpen: false });
    if(this.props.changeBadgeVisibility)
    {
      this.props.changeBadgeVisibility();
      }
  }

  // handler to toggle between signup and login tabs
  changeTabHandler = (event, value) => {
    this.setState({ value });
  }

  // handler post sigup
  postSignUpHandler = () => {
    this.setState({ isSnackBarOpen: true });
    this.setState({ isModalOpen: true });
    this.setState({ value: 0 });
  }

  // handler post login
  postLoginHandler = () => {
    this.setState({ isSnackBarOpen: true });
    this.setState({ isModalOpen: false });
    this.setState({ value: 0 });
  }

  openMenuHandler = (event) => {
    this.setState({
      isMenuOpen: true,
    });
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  //Closing the menu handler
  closeMenuHandler = () => {
    this.setState({
      isMenuOpen: false
    });
  }

  //Dropdown menu handler
  handleClose = () => {
    this.setState({
      open: false,
      showUserProfile: !this.state.showUserProfile
    })
  }

  closeSnackBarHandler = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ isSnackBarOpen: false })
  }

  //logout handler
  logoutClickHandler = () => {
    sessionStorage.clear();
    this.props.history.push({
      pathname: "/"
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="header-top-container">
        <div className="header-main-container">
          <div className="header-logo-container"><Fastfood className={classes.headerLogo} /></div>
          {this.props.showSearch &&
            <div className="header-search-container">
              <div className="search-icon">
                <SearchIcon style={{ color: "#FFFFFF" }} />
              </div>
              <Input
                onChange={this.props.searchRestaurants.bind(this)}
                className={classes.searchField}
                placeholder="Search by Restaurant Name"
              />
            </div>
          }
          {!this.state.loggedIn ?
            <div>
              <Button style={{ fontSize: "100%" }} variant="contained" color="default" onClick={this.openModalHandler}><AccountCircle /><span style={{ marginLeft: "2%" }}>Login</span></Button>
            </div>
            :
            <div>
              <Button style={{ textTransform: "capitalize", fontSize: "120%", background: " #263238", color: "lightgrey" }} onClick={this.openMenuHandler}><AccountCircle /><span style={{ paddingLeft: "3%" }}>  {sessionStorage.getItem("firstName")}</span></Button>
              <div>
                <Menu
                  className="loggedInMenu"
                  id="logged-in-menu"
                  keepMounted
                  open={this.state.isMenuOpen}
                  onClose={this.closeMenuHandler}
                  anchorEl={this.state.anchorEl}>
                  <MenuItem onClick={this.handleClose}><Link to="/profile" style={{ textDecoration: 'none', color: "black" }}>My Profile</Link></MenuItem>
                  <MenuItem onClick={this.props.logoutHandler}>Logout</MenuItem>
                </Menu>

              </div>
            </div>}
        </div>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.isModalOpen}
          contentLabel="Login"
          onRequestClose={this.closeHandler}
          style={customStyles}>
          <Tabs className="tabs" value={this.state.value} onChange={this.changeTabHandler}>
            <Tab label="LOGIN" />
            <Tab label="SIGNUP" />
          </Tabs>
          {this.state.value === 0 &&
            <TabContainer>

              <FormControl required className={classes.formControl}>

                <InputLabel htmlFor="username"> Contact No. </InputLabel>
                <Input id="username" type="text" username={this.state.username} value={this.state.username} onChange={this.changeUsernameHandler} />
                <FormHelperText className={this.state.usernameRequired}><span className="red">{this.state.invalidContactNo}</span></FormHelperText>

              </FormControl><br /><br />

              <FormControl required className={classes.formControl}>

                <InputLabel htmlFor="password"> Password </InputLabel>
                <Input id="password" type="password" value={this.state.password} onChange={this.changePasswordHandler} />
                <FormHelperText className={this.state.passwordRequired}><span className="red">{this.state.invalidPassword}</span></FormHelperText>

              </FormControl><br /><br />
              {this.state.loginErrCode === "ATH-001" || this.state.loginErrCode === "ATH-002" ?
                  <FormControl className={classes.formControl}>
                    <Typography variant="subtitle1" color="error" className={this.state.loginError} align="left">{this.state.loginErrorMsg}</Typography>
                  </FormControl> : ""}
              <Button variant="contained" color="primary" onClick={this.loginClickHandler} className={classes.formControl}>LOGIN</Button>
            </TabContainer>}

          {this.state.value === 1 && <TabContainer>
            <form>
              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="firstname">First Name</InputLabel>
                <Input id="firstname" type="text" onChange={this.changeFirstNameHandler} value={this.state.firstname} />
                <FormHelperText className={this.state.firstnameRequired}><span className="red">{this.state.invalidSignUpFirstname}</span></FormHelperText>
              </FormControl><br /><br />

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                <Input id="lastname" type="text" onChange={this.changeLastNameHandler} value={this.state.lastname} />
              </FormControl><br /><br />

              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input id="email" type="email" onChange={this.changeEmailHandler} value={this.state.email} />
                <FormHelperText className={this.state.emailRequired}><span className="red">{this.state.invalidSignUpEmail}</span></FormHelperText>
                {this.state.signUpErrCode === "SGR-002" ?
                  <FormControl className={classes.formControl}>
                    <Typography variant="subtitle1" color="error" className={this.state.signupError} align="left">Invalid Email</Typography>
                  </FormControl> : ""}
              </FormControl><br /><br />

              <FormControl required aria-describedby="name-helper-text" className={classes.formControl}>
                <InputLabel htmlFor="signUpPassword">Password</InputLabel>
                <Input type="password" id="signUpPassword" value={this.state.signUpPassword} onChange={this.changeSignUpPasswordHandler} />
                <FormHelperText className={this.state.signUpPasswordRequired}><span className="red">{this.state.invalidSignUpPassword}</span></FormHelperText>
                {this.state.signUpErrCode === "SGR-004" ?
                  <FormControl className={classes.formControl}>
                    <Typography variant="subtitle1" color="error" className={this.state.signupError} align="left">Password must contain at least one capital letter, one small letter, one number, and one special character</Typography>
                  </FormControl> : ""}
              </FormControl><br /><br />

              <FormControl required className={classes.formControl}>

                <InputLabel htmlFor="mobile">Contact No.</InputLabel>
                <Input id="mobile" type="number" onChange={this.changeMobileHandler} value={this.state.mobile} />
                <FormHelperText className={this.state.mobileRequired}><span className="red">{this.state.invalidSignUpContactNo}</span></FormHelperText>

                {this.state.signUpErrCode === "SGR-003" ?
                  <FormControl className={classes.formControl}>
                    <Typography variant="subtitle1" color="error" className={this.state.signupError} align="left">Contact No. must contain only numbers and must be 10 digits long</Typography>
                  </FormControl> : ""}

                {this.state.signUpErrCode === "SGR-001" ?
                  <FormControl className={classes.formControl}>
                    <Typography variant="subtitle1" color="error" className={this.state.signupError} align="left">{this.state.signUpErrorMsg}</Typography>
                  </FormControl> : ""}
              </FormControl>
              <br /><br /><br /><br />
              <Button variant="contained" color="primary" onClick={this.signUpClickHandler} className={classes.formControl}> SIGNUP </Button>
            </form>
          </TabContainer>}
        </Modal>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.isSnackBarOpen}
          autoHideDuration={6000}
          onClose={this.closeSnackBarHandler}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id" className="red">{this.state.snackBarMsg}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.closeSnackBarHandler}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}
export default withStyles(styles)(Header);
