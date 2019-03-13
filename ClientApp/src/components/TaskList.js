import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormControl, InputGroup, Button, Alert } from 'react-bootstrap';
import { Task } from './Task';
import * as TaskListSelectors from '../features/taskList/selectors';
import { setNewTaskDescription, getTasks, addTask } from '../features/taskList/actions';

class TaskListRaw extends Component {
    componentDidMount() {
        this.props.getTasks();
    }

    render() {
        return (
            <div>
                <h1>Tasks</h1>
                <div>
                    <Alert bsStyle="danger" hidden={!this.props.error}>
                        <strong>Error: </strong> {this.props.error}
                    </Alert>
                </div>

                <InputGroup className="mb-3">
                    <FormControl placeholder="Task description" value={this.props.newTaskDescription} onChange={(e) => this.props.setNewTaskDescription(e.target.value)} />
                    <InputGroup.Append>
                        <Button variant="outline-primary" onClick={() => this.props.addTask({ description: this.props.newTaskDescription })}>Add</Button>
                    </InputGroup.Append>
                </InputGroup>

                <table className="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Description</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.tasks.map(task => {
                                return <Task key={task.id} data={task} />;
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return TaskListSelectors.getTaskListState(state);
}

const actionCreators = { setNewTaskDescription, getTasks, addTask };

export const TaskList = connect(mapStateToProps, actionCreators)(TaskListRaw);
