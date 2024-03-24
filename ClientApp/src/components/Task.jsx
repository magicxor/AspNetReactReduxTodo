import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { deleteTask } from '../features/taskList/actions';

const TaskRaw = props => (
  <tr>
    <td>
      {props.data.id}
    </td>
    <td>
      {props.data.description}
    </td>
    <td>
      <Button variant="danger" onClick={() => props.deleteTask(props.data.id)}>Delete</Button>
    </td>
  </tr>
);

const actionCreators = { deleteTask };

export const Task = connect(null, actionCreators)(TaskRaw);
