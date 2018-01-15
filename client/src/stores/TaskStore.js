import alt from '../lib/alt';
import TasskActions from '../actions/TaskActions';
import * as $ from "axios";

class TaskStore {
    constructor(){
        this.bindActions(TasskActions);
        this.tasks = [];
    }

    read(){
        let _this = this;
        const tasks = this.tasks;
        // replace todomvc on line 14 with your APP ID found in your Stamplay App Dashboard.
        $.get("https://todoapptauni.stamplayapp.com/api/cobject/v1/newtask" ,{params: {select:'task'}} )
            .then(function(res) {
                let alltasks = res.data.data;
                _this.setState({
                    tasks : tasks.concat(alltasks)
                })
            })
    }

    create(task){
        let _this = this;
        const tasks = this.tasks;
        $.post("https://todoapptauni.stamplayapp.com/api/cobject/v1/newtask", task)
            .then(function(res) {
                let task = res.data;
                _this.setState({
                    tasks : tasks.concat(task)
                })
            })
    }

    findTask(id) {
        const tasks = this.tasks;
        const taskIndex = tasks.findIndex((task) => task.id === id);
        if(taskIndex < 0) {
            console.warn("Failed to find task", tasks, id);
        }
        return taskIndex;
    }

    update(obj){
        let id = obj.id;
        let task = obj.task;
        let _this = this;
        const tasks = this.tasks;
        const taskIndex = this.findTask(id);

        if(taskIndex < 0) { return }

        $.put("https://todoapptauni.stamplayapp.com/api/cobject/v1/newtask/" + id, { task : task })
            .then(function(res) {
                console.info("Updated", id);
            }, function(err) {
                console.err("Error updating :", id, err);
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

        if(taskIndex < 0) { return }

        $.delete("https://todoapptauni.stamplayapp.com/api/cobject/v1/newtask/" + id)
            .then(function(res) {
                console.info("Deleted", id);
            }, function(err) {
                console.err("Error deleting :", id, err);
            })

        this.setState({
            tasks : tasks.slice(0, taskIndex).concat(tasks.slice(taskIndex + 1))
        })

    }


}

export default alt.createStore(TaskStore , "TaskStore");