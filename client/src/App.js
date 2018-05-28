import React from "react";
import Tasks from './Tasks'
import { Redirect } from 'react-router-dom';
import TaskActions from "./actions/TaskActions";
import TaskStore from "./stores/TaskStore";
import UserActions from "./actions/UserActions";
import {Button, Grid, Row, Col }from 'react-bootstrap';
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          TaskStore: TaskStore.getState(),
          redirectLogin: false
        }
    }

    componentDidMount() {
        TaskStore.listen(this.storeChanged);
        TaskActions.read();
    }

    componentWillUnmount() {
        TaskStore.unlisten(this.storeChanged);
    }

    storeChanged = (state) => {
        this.setState({TaskStore: state});
    };

    addTask = () => {
        TaskActions.create({ task : "New Task (click to edit) "})
    };

    updateTask = (id, task) => {
        TaskActions.update( {id, task} )
    };

    deleteTask = (id) => {
        TaskActions.delete(id);
    };

    logout = () => {
      UserActions.logout();
      TaskActions.resetStore();
      this.setState({redirectLogin: true});
    }

    render() {
        const tasks = this.state.TaskStore.tasks;
        const redirectToLogin = this.state.redirectLogin

        if (redirectToLogin) {
            return <Redirect to='/login' />;
        }

        return (
            <Grid className="container">
                <Row className="show-grid">
                    <Col md={12}>
                        <h1 className="title">Todo App</h1>
                    </Col>
                </Row>
                <Row className="Show-grid">
                    <Col className="col-5" sm={4} md={4}>
                        <Button className="add-note" onClick={this.addTask}>
                            <span className="add-text">New Task</span>
                            <span className="add-icon">+</span>
                        </Button>
                    </Col>
                    <Col className="col-4"/>
                    <Col className="col-3" sm={4} md={4}>
                        <Button className="logout-btn add-note" onClick={this.logout}>Logout</Button>
                    </Col>
                </Row>
                <Tasks items={tasks}
                       onEdit={this.updateTask}
                       onDelete={this.deleteTask}/>
            </Grid>
        )
    }
}
