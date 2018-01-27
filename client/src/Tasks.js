import React , {Component} from 'react';
import Task from './Task'

export default class Tasks extends Component {

    renderTask = (task) => {
        return (
            <li className="note" key={task._id}>
                <Task task={task}
                      onEdit={this.props.onEdit.bind(null, task._id)}
                      onDelete={this.props.onDelete.bind(null, task._id)}
                />
            </li>
        )
    }

    render (){
        const tasks = this.props.items;
        return (
          <ul className="notes">
              {tasks.map(this.renderTask)}
          </ul>
        )
    }
}