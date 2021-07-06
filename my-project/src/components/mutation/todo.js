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
mutation($task: String) {
    todoDelete(task:$task) {
        task
        complited
    }
}
`