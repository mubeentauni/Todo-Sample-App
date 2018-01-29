import alt from '../lib/alt';
import TasskActions from '../actions/TaskActions';
import CONSTANTS from '../utils/constants';
import Helpers from '../utils/helpers';
import * as $ from "axios";

class TaskStore {
    constructor(){
        this.bindActions(TasskActions);
        this.tasks = [];
    }

    resetStore() {
        this.setState({task: []});
    } 

    read(){
        let _this = this;
        const tasks = [];
        $.get(`${CONSTANTS.API_URL}/todo/${localStorage.getItem('userId')}` , Helpers.getHeader() )
            .then(function(res) {
                let alltasks = res.data;
                _this.setState({
                    tasks : tasks.concat(alltasks)
                })
            })
    }

    create(task){
        let _this = this;
        const newTask = {
          description: task.task,
          userid: localStorage.getItem('userId')
        };
        const tasks = this.tasks;
        $.post(`${CONSTANTS.API_URL}todo/create`,
        newTask, Helpers.getHeader())
            .then(function(res) {
                let task = res.data;
                newTask['_id'] = task._id;
                _this.setState({
                    tasks : tasks.concat(newTask)
                })
            })
    }

    findTask(id) {
        const tasks = this.tasks;
        const taskIndex = tasks.findIndex((task) => task._id === id);
        if(taskIndex < 0) {
            console.warn("Failed to find task", tasks, id);
        }
        return taskIndex;
    }

    updateTaskDescription(index, taskDescription) {
      let tasks = this.tasks;
      tasks[index].description = taskDescription;
      this.setState({tasks: tasks});
    }

    update(obj){
        let id = obj.id;
        let task = obj.task;
        let _this = this;
        const tasks = this.tasks;
        const taskIndex = this.findTask(id);
        if(taskIndex < 0) { return }

        $.put(`${CONSTANTS.API_URL}todo/update/${id}`,
            { description: task,
              userid: localStorage.getItem('userId')}, Helpers.getHeader())
            .then(function(res) {
                _this.updateTaskDescription(taskIndex, task);
            }, function(err) {
                console.log("Error updating :", id, err);
            })

        tasks[taskIndex].task = task;

        this.setState({
            tasks : tasks
        })
    }
    delete(id) {
        let _this = this;
        const tasks = this.tasks;
        const taskIndex = this.findTask(id);
        const userId = localStorage.getItem('userId');

        if(taskIndex < 0) { return }

        $.delete(`${CONSTANTS.API_URL}todo/${userId}/${id}`, Helpers.getHeader())
            .then(function(res) {
                console.info("Deleted", id);
                  _this.setState({
                      tasks : tasks.slice(0, taskIndex).concat(tasks.slice(taskIndex + 1))
                  })
            }, function(err) {
                console.log("Error deleting :", id, err);
            })


    }


}

export default alt.createStore(TaskStore , "TaskStore");
