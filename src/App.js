import React, { useState, useRef } from 'react';
import AuthForm from './components/Authform'
import UserForm from "./components/Userform";
import { SelectUser } from "./components/SelectUser";
import './App.css';

function App() {
  const [stateToken, setToken] = useState(null)
  const [stateUsername, setUsername] = useState(null)
  const [stateUserindex, setUserindex] = useState(0)
  const [stateUsers, setStateUsers] = useState([])
  const [needGetUsers, setNeedGetUsers] = useState(true)

  const refAuthForm = useRef(null)
  const refUserForm = useRef(null)

  if (stateToken && needGetUsers) {
      setNeedGetUsers(false)
      getUsers(stateToken, setStateUsers)
  }

  const titleBox = stateToken
      ? <div className="App-titleBox">
          <h4>Please add user or edit current from list</h4>
          <SelectUser usersSet={ stateUsers }
                      value={ stateUserindex }
                      changeHandler={ event => { setUserindex( +event.target.value )} }
          />
        </div>
      : null

  const EMPTY_USER_INPUT = {
      id: null, username: '', 'first_name': '', 'last_name': '', password: '', is_active: true, is_superuser: false
  }
  const userData = {data: (stateUserindex > 0) ? stateUsers[stateUserindex - 1] : EMPTY_USER_INPUT }
  let userForm = stateToken
      ? <UserForm token={ stateToken }
                  formRef={ refUserForm }
                  {...userData}
                  getUsers = { getUsers }
                  setStateUsers = { setStateUsers }
        />
      : null

  return (
    <div className="App">
      <header className="App-header">
          <div className="App-wrapper">Welcome { stateUsername || ''}</div>
      </header>

      <div className="App-body">
          <div className="App-wrapper">
              <AuthForm token={ stateToken }
                        setToken={ setToken }
                        setUsername={ setUsername }
                        formRef={ refAuthForm }
              />

              { titleBox }

              { userForm }
          </div>
      </div>
    </div>
  );
}

function getUsers(token, setStateUsers) {
    fetch('https://emphasoft-test-assignment.herokuapp.com/api/v1/users/', {
        method: 'GET',
        headers: {'Content-Type': 'application/json;charset=utf-8', "Authorization": `Token ${token}`}
    }).then( result => result.json())
      .then( list => { setStateUsers(list) })
}

export default App;
