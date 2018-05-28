import React, {Component} from 'react';
import {Button, Grid, Row, Col }from 'react-bootstrap';


export default class Task extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editing : false
        }
    }
    render () {
        const editing = this.state.editing;
        return (
            <Row>{ editing ? this.renderEdit() : this.renderTask() }</Row>
        )
    }

    renderEdit = () => {
        return (
            <textarea
                type="text"
                className="edit-input"
                autoFocus={true}
                defaultValue={this.props.task.description}
                onBlur={this.finishEdit}
                onKeyPress={this.checkEnter}></textarea>
        )
    };

    renderTask = () => {
        const onDelete = this.props.onDelete;
        return (
                <Col className="col-12">
                    <Col className="col-10">
                        <span onClick={this.edit} className="task-body">{this.props.task.description}</span>
                    </Col>
                        {  onDelete ? this.renderDelete() : null}
                </Col>
        )
    };

    renderDelete(){
        return (
            <Col className="col-2 no-padding">
                <button className="delete-btn" onClick={this.props.onDelete}>{'\u232B'}</button>
            </Col>
        )
    }

    edit = () => {
        this.setState({
            editing : true
        })
    }

    checkEnter = (e) => {
        if(e.key === "Enter") {
            this.finishEdit(e);
        }
    }

    finishEdit = (e) => {
        this.props.onEdit(e.target.value);
        this.setState({
            editing : false
        })
    }


}