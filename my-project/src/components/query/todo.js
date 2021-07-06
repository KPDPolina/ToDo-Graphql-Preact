
import {gql} from '@apollo/client'

export const GET_ALL_TODOS = gql`
query{
    todoEvery{
      _id
      task
      complited
    } 
  }

`