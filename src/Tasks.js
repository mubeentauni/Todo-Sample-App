import React , {Component} from 'react';
import Task from './Task'

export default class Tasks extends Component {

    renderTask = (task) => {
        return (
            <li className="note" key={task.id}>
                <Task task={task.task}
                      onEdit={this.props.onEdit.bind(null, task.id)}
                      onDelete={this.props.onDelete.bind(null, task.id)}
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