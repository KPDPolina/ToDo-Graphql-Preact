// import { h } from 'preact';
// import { Router } from 'preact-router';

// import Header from './header';

// // Code-splitting is automated for `routes` directory
// import Home from '../routes/home';
// import Profile from '../routes/profile';

// const App = () => (
// 	<div id="app">
// 		<Header />
// 		<Router>
// 			<Home path="/" />
// 			<Profile path="/profile/" user="me" />
// 			<Profile path="/profile/:user" />
// 		</Router>
// 	</div>
// )

// export default App;

import { useMutation, useQuery} from '@apollo/client';
import { ADD_TODO, DELETE_TODO } from './mutation/todo.js';
import { GET_ALL_TODOS } from './query/todo.js';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

function App() {

  const {data, loading, refetch} = useQuery(GET_ALL_TODOS)
  const [newTodo] = useMutation(ADD_TODO)
  const [delTodo] = useMutation(DELETE_TODO)
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

  const deleteTodo = (todotask) =>{
    // e.preventDefault();
    delTodo({
      variables: {
        task: todotask,
    }
    })
    // getAll(e);
  }

  const addTodo = (e) =>{
    e.preventDefault();
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
   
    return (
      <div style="padding: 20px">
        ToDo
      <div>
        <form>
          <span>Task:</span> 
          <input value={todotask} onChange={e => setTodotask(e.target.value)} type="text" />
            <button onClick={(e) => addTodo(e)}>Создать todo</button>
        </form>        
      </div>
      <div className="todoList">
        {todos.map(todo =>
            // eslint-disable-next-line react/jsx-key
            <div>
              <div>{todo.task}
              <button onClick={() => deleteTodo()}>Удалить todo</button>
              </div>
            </div>
          )}
      </div>

    </div>
    );
}
export default App;



  // // Add `name` to the initial state
  // state = { value: '', name: 'world' }

  // onInput = ev => {
  //   this.setState({ value: ev.target.value });
  // }

  // // Add a submit handler that updates the `name` with the latest input value
  // onSubmit = ev => {
  //   // Prevent default browser behavior (aka don't submit the form here)
  //   ev.preventDefault();

  //   this.setState({ name: this.state.value });
  // }

  // render() {
  //   return (
  //     <div>
  //       <h1>Hello, {this.state.name}!</h1>
  //       <form onSubmit={this.onSubmit}>
  //         <input type="text" value={this.state.value} onInput={this.onInput} />
  //         <button type="submit">Update</button>
  //       </form>
  //     </div>
  //   );
  // }