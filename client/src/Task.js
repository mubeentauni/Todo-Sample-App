import React, {Component} from 'react';


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
            <div>{ editing ? this.renderEdit() : this.renderTask() }</div>
        )
    }

    renderEdit = () => {
        return (
            <textarea
                type="text"
                className="edit-input"
                autoFocus={true}
                defaultValue={this.props.task}
                onBlur={this.finishEdit}
                onKeyPress={this.checkEnter}></textarea>
        )
    }

    renderTask = () => {
        const onDelete = this.props.onDelete;
        return (
            <div>
                <span onClick={this.edit} className="task-body">{this.props.task}</span>
                {  onDelete ? this.renderDelete() : null}
            </div>
        )
    }

    renderDelete(){
        return (
            <button className="delete-btn" onClick={this.props.onDelete}>{'\u232B'}</button>
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

    // render(){
    //     return (
    //     <div>
    //         <span> {this.props.task} </span>
    //     </div>
    //     )
    // }

}