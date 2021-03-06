
import { useMutation, useQuery, useSubscription} from '@apollo/client';
import { ADD_TODO, DELETE_TODO, SUBSCRIPTION_TODO } from './mutation/todo.js';
import { GET_ALL_TODOS } from './query/todo.js';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function App() {

  const {data, loading, refetch} = useQuery(GET_ALL_TODOS)
  const [newTodo] = useMutation(ADD_TODO)
  const [delTodo] = useMutation(DELETE_TODO)
  // const {data: subscriptionData, loading: subscriptionLoading, error: subscriptionError} = useSubscription(SUBSCRIPTION_TODO)
  // const { subscriptionData, subscriptionLoading } = useSubscription(SUBSCRIPTION_TODO);
  const [todos, setTodos] = useState([])
  const [todotask, setTodotask] = useState('')
  // const [todocomplited, setTodocomplited] = useState(false)

  useEffect(() => {
    if(!loading){ 
      setTodos(data.todoEvery)
    }
  }, [data] )


  if(loading){
    return <h1>Loading...</h1>
  }

  const deleteTodo = (e) =>{
    e.preventDefault();
    delTodo({
      variables: {
        _id: e.target.value,
    }
    })
    getAll(e);
  }

  const addTodo = (e) =>{
    e.preventDefault();
    if(todotask === ""){console.log(`todotask is empty`); getAll(e); return 0;}
    
    newTodo({
        variables: {
            task: todotask,
            // complited: todocomplited,
        }
    }).then(({}) => {
      setTodotask('');
      // setTodocomplited(false);
    })
    getAll(e);
  }

  const getAll = (e) => {
    e.preventDefault();
    refetch();
  }

  const { data: subscriptionData, loading: subscriptionLoading } = useSubscription(SUBSCRIPTION_TODO,);

  if(subscriptionLoading) return (
    <div style="padding: 20px">
      ToDo
    <div>
      <form>
        <span>Task:</span> 
        <input value={todotask} onChange={e => setTodotask(e.target.value)} type="text" />
          <button onClick={(e) => {addTodo(e)}}>Создать todo</button>
      </form>        
    </div>

    <div className="todoList">
    {todos.map(todo =>
      // eslint-disable-next-line react/jsx-key
      <div>
        <div>{todo.task}
        <button value={todo._id} onClick={(e) => deleteTodo(e)}>Удалить todo</button>
        </div>
      </div>
    )}
  </div>

  </div>
);
  



    return (
      <div style="padding: 20px">
        ToDo
      <div>
        <form>
          <span>Task:</span> 
          <input value={todotask} onChange={e => setTodotask(e.target.value)} type="text" />
            <button onClick={(e) => {addTodo(e)}}>Создать todo</button>
        </form>        
      </div>

      <div className="todoList">
        {subscriptionData.listenTodo.map(todo =>
            // eslint-disable-next-line react/jsx-key
            <div>
              <div>{todo.task}
              <button value={todo._id} onClick={(e) => deleteTodo(e)}>Удалить todo</button>
              </div>
            </div>
          )}
      </div>

    </div>
  );
}
export default App;


