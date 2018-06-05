import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import Helpers from '../utils/helpers';
import UserActions from '../actions/UserActions';
import UserStore from '../stores/UserStore';
import { Redirect } from 'react-router-dom';
import './user.css';
import {Button, Grid, Row, Col }from 'react-bootstrap';
import TaskActions from "../actions/TaskActions";
import TaskStore from "../stores/TaskStore";


class Login extends Component {

    constructor(props) {
        super(props);
        this.loginData = {
            useremail: '',
            password: ''
        };

        this.requiredFields = ['useremail', 'password'];

        this.validationConfig = [
            { name: "useremail", validators: { required: true, email: true }, messages: { required: "Email is Required", email: "Invalid Email" } },
            { name: "password", validators: { required: true }, messages: { required: "Password is Required" } },
        ];

        this.state = {
            redirectToRegister: false,
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

    redirectToRegisterPage() {
        this.setState({ redirectToRegister: true });
    }

    handleInput(field, data) {
        this.loginData[field] = data;
        this.setState({ showError: !this.handleValidation() });
    }

    handleValidation() {
        const validator = Helpers.checkValidation(this.validationConfig, this.loginData);
        this.setState({ validation: validator.data });
        return validator.isValid;
    }

    handleFormSubmit(event) {
        const self = this;
        const { cookies } = self.props;
        const payload = this.loginData;
        if (this.handleValidation()) {
            UserActions.login(this.loginData);
        } else {
            this.setState({ showError: true });
        }
    }

    render() {
        let {
            showError,
            validation,
            redirectToRegister,
            userStore
        } = this.state;

        if (redirectToRegister) {
            return <Redirect to='/register' />;
        }
        if(!!userStore && !!userStore.user && !!userStore.user.token )
            return <Redirect to='/todo' />;

        return (

            <Grid className="container">
                <Row>
                    <AppBar
                        className="App-Bar"
                        title="Login"
                        showMenuIconButton={false}
                    />
                </Row>
                <Row>
                    <Col className="col-2"  sm={3} md={4} lg={5} />
                    <Col className="col-8" md={4} >
                        <TextField
                            hintText="Enter your Email"
                            floatingLabelText="Email"
                            onChange={(event, newValue) => this.handleInput('useremail', newValue)}
                        />
                        <br />
                        {showError && validation.useremail.length > 0 ?
                            validation.useremail.map((key, index) => {
                                return <div key={index}><span className="require-error">{key}</span><br /></div>
                            }) : ''
                        }
                    </Col>
                </Row>
                <Row>
                    <Col className="col-2"  sm={3} md={4} lg={5} />
                    <Col className="col-8" md={4} >
                        <TextField
                            type="password"
                            hintText="Enter your Password "
                            floatingLabelText="Password"
                            onChange={(event, newValue) => this.handleInput('password', newValue)}
                        />
                        <br />
                        {showError && validation.password.length > 0 ?
                            validation.password.map((key, index) => {
                                return <div key={index}><span className="require-error">{key}</span><br /></div>
                            }) : ''
                        }
                    </Col>
                </Row>
                <Row>
                    <Col className="col-2" sm={3} md={4} lg={5}/>
                    <Col className="col-8" lg={7}>
                        <RaisedButton className="btn-pad" label="Submit" primary={true} style={style} onClick={(event) => this.handleFormSubmit(event)} />
                        <RaisedButton className="btn-pad" label={"Register"} secondary={true} style={style} onClick={(event) => this.redirectToRegisterPage()} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

const style = {
    margin: 15,
};


export default Login;