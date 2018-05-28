import React , {Component} from 'react';
import Task from './Task'
import {Button, Grid, Row, Col }from 'react-bootstrap';


export default class Tasks extends Component {

    renderTask = (task) => {
        return (
            <Col className="col-6" sm={6} md={6} lg={3}>
                <div className="note" key={task._id}>
                    <Task task={task}
                      onEdit={this.props.onEdit.bind(null, task._id)}
                      onDelete={this.props.onDelete.bind(null, task._id)}
                    />
                </div>
            </Col>
        )
    };

    render (){
        const tasks = this.props.items;
        return (
          <Grid className="container">
              <Row className="notes">
                  {tasks.map(this.renderTask)}
              </Row>
          </Grid>
        )
    }
}