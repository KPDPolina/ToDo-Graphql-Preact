import {gql} from '@apollo/client'

export const ADD_TODO = gql`
mutation($task: String, $complited: Boolean) {
    todoAdd(task: $task, complited: $complited){
		task
        complited
  }
}
`
export const DELETE_TODO = gql`
mutation($_id: ID!) {
    todoDelete(_id:$_id) {
        task
        complited
    }
}
`