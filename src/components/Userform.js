import React from 'react';
import {Input} from "./Input";
import {fetchApp} from "../fetchUtils";
import Validator, {USERNAME, FIRSTNAME, LASTNAME, PASSWORD} from "../Validator";
import {resetDataNotouched} from "../formUtils";

export default class UserForm extends React.Component {
    constructor(props) {
        super(props)

        this.inputs = [
            { name: 'id', type: 'text', id: 'userEditId', label: 'ID', readOnly: true},
            { name: 'username', type: 'text', id: 'userEditLogin', label: 'Username', validator: USERNAME, requiredView: true},
            { name: 'first_name', type: 'text', id: 'userEditFirstName', label: 'First name', validator: FIRSTNAME},
            { name: 'last_name', type: 'text', id: 'userEditLastName', label: 'Last name', validator: LASTNAME},
            { name: 'password', type: 'password', id: 'userEditPassword', label: 'Password', validator: PASSWORD, requiredView: true},
            { name: 'is_active', type: 'checkbox', id: 'userIsActive', label: 'Active', requiredView: true},
            { name: 'is_superuser', type: 'checkbox', id: 'userIsSuper', label: 'Superuser status', readOnly: true}
        ]
    }

    componentDidMount() {
        this.validator = new Validator(this.props.formRef.current, this.inputs)

        this.updateUserData(this.props.data)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data.id !== this.props.data.id) {
            this.updateUserData(this.props.data)
        }
    }

    render() {
        const inputs = this.inputs.map( opts => {
            const extendOpts = {}
            if (opts.validator) { extendOpts.validator = opts.validator }

            return <Input key={ opts.id }
                          opts={ opts }
                          {...extendOpts}
                          value={this.state && this.state[opts.name] || ''}
                          changeHandler={ (event) => {this.handleInputChange(event)}}
            /> })

        return (
            <form ref={ this.props.formRef }>
                { inputs }
                <div className="App-buttonBox">
                    <input className="App-button" type="submit" value="Save"/>
                </div>
            </form>
        )
    }

    handleInputChange(event) {
        const target = event.target;

        if (!target.readOnly) {
            const name = target.name;
            const value = target.type === 'checkbox' ? target.checked : target.value

            this.setState({
                [name]: value,
                //'serverMsg': null
            });
            this.validator.checkValidByName(name)
            resetDataNotouched(target)
        }
    }

    updateUserData(data) {
        this.setState({
            ...data
        })
    }
}