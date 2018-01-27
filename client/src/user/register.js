import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import Helpers from '../utils/helpers';
import { Redirect } from 'react-router-dom';
import './user.css';
import UserActions from "../actions/UserActions";
import UserStore from "../stores/UserStore";



class Register extends Component {

    constructor(props) {
        super(props);
        this.registerData = {
            firstname: '',
            lastname: '',
            useremail: '',
            password: ''
        };

        this.requiredFields = ['useremail', 'password'];

        this.validationConfig = [
            { name: "useremail", validators: { required: true, email: true }, messages: { required: "Email is Required", email: "Invalid Email" } },
            { name: "password", validators: { required: true }, messages: { required: "Password is Required" } },
            {name: "firstname", validators: {required: false}, messages: {}},
            {name: "lastname", validators: {required: false}, messages: {}},
        ];

        this.state = {
            redirectToLogin: false,
            validation: {},
            showError: false,
            userStore: UserStore.getState()
        }
    }

    componentDidMount() {
        UserStore.listen(this.storeChanged);
    }

    storeChanged = (state) => {
        this.setState({userStore: state});
    };

    redirectLoginPage() {
        this.setState({ redirectToLogin: true });
    }

    handleInput(field, data) {
        this.registerData[field] = data;
        this.setState({ showError: !this.handleValidation() });
    }

    handleValidation() {
        const validator = Helpers.checkValidation(this.validationConfig, this.registerData);
        this.setState({ validation: validator.data });
        return validator.isValid;
    }

    handleFormSubmit(event) {
        const self = this;
        const payload = this.registerData;
        if (this.handleValidation()) {
            UserActions.register(this.registerData);
        } else {
            this.setState({ showError: true });
        }
    }

    render() {
        let {
            showError,
            validation,
            redirectToLogin,
            userStore
        } = this.state;

        if (redirectToLogin) {
            return <Redirect to='/login' />;
        }

        if(!!userStore && userStore.isRegistered )
            return <Redirect to='/login' />;

        return (

            <div>
                <AppBar
                    title="Register"
                    showMenuIconButton={false}
                />
                <TextField
                    hintText="Enter your First Name"
                    floatingLabelText="First Name"
                    onChange={(event, newValue) => this.handleInput('firstname', newValue)}
                />
                <br />
                {showError && validation.firstname.length > 0 ?
                    validation.firstname.map((key, index)=> {
                        return <div key={index}><span className="require-error">{key}</span><br /></div>
                    }): ''
                }
                <TextField
                    hintText="Enter your Last Name"
                    floatingLabelText="Last Name"
                    onChange={(event, newValue) => this.handleInput('lastname', newValue)}
                />
                <br />
                {showError && validation.lastname.length > 0 ?
                    validation.lastname.map((key, index)=> {
                        return <div key={index}><span className="require-error">{key}</span><br /></div>
                    }): ''
                }
                <TextField
                    hintText="Enter your Email"
                    floatingLabelText="Email"
                    onChange={(event, newValue) => this.handleInput('useremail', newValue)}
                />
                <br />
                {showError && validation.useremail.length > 0 ?
                    validation.useremail.map((key, index)=> {
                        return <div key={index}><span className="require-error">{key}</span><br /></div>
                    }): ''
                }
                <TextField
                    type="password"
                    hintText="Enter your Password"
                    floatingLabelText="Password"
                    onChange={(event, newValue) => this.handleInput('password', newValue)}
                />
                <br />
                {showError && validation.password.length > 0 ?
                    validation.password.map((key, index)=> {
                        return <div key={index}><span className="require-error">{key}</span><br /></div>
                    }): ''
                }
                <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleFormSubmit(event)} />
                <br />
                Already registered, Login Now
                <br />
                <RaisedButton label={"Login"} secondary={true} style={style} onClick={(event) => this.redirectLoginPage()} />
            </div>
        );
    }
}

const style = {
    margin: 15,
};


export default Register;