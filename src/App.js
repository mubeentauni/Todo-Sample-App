import React from "react";
import Tasks from './Tasks'
import TaskActions from "./actions/TaskActions";
import TaskStore from "./stores/TaskStore";
import {Button }from 'react-bootstrap';
import './App.css'

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = TaskStore.getState();
    }

    componentDidMount() {
        TaskStore.listen(this.storeChanged);
        TaskActions.read();
    }

    componentWillUnmount() {
        TaskStore.unlisten(this.storeChanged);
    }

    storeChanged = (state) => {
        this.setState(state);
    }

    addTask = () => {
        TaskActions.create({ task : "New Task (click to edit) "})
    }

    updateTask = (id, task) => {
        TaskActions.update( {id, task} )
    }

    deleteTask = (id) => {
        TaskActions.delete(id);
    }

    render() {
        const tasks = this.state.tasks;
        return (
            <div>
                <h1 className="title">Todo App</h1>
                <Button className="add-note" onClick={this.addTask}>
                    <span className="add-text">New Task</span>
                    <span className="add-icon">+</span>
                </Button>
                <Tasks items={tasks}
                       onEdit={this.updateTask}
                       onDelete={this.deleteTask}/>
            </div>
        )
    }
}