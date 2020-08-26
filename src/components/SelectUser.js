import React from 'react';

export function SelectUser(props) {
    const options = props.usersSet.map(
        (user, index) => <option value={ ++index } key={`user_${user.id}`} >{user.username}</option>
    )

    return (
        <div className="App-selectBox">
            <select className="App-select" value={props.value} onChange={ props.changeHandler }>
                <option value={ 0 }>--</option>
                {options}
            </select>
        </div>
    )
}
