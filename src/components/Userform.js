import React from 'react';
import {Input} from "./Input";
import {fetchApp, makeId} from "../fetchUtils";
import Validator, {USERNAME, FIRSTNAME, LASTNAME, PASSWORD, setDataNotouched} from "../Validator";
import {getFormData} from "../formUtils";
import {ServerMsg} from "./Servermsg";

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

        this.handleSubmitForm = this.handleSubmitForm.bind(this)
    }

    componentDidMount() {
        const userForm = this.props.formRef.current
        if (userForm) { this.validator = new Validator(userForm, this.inputs) }
        // FIX checkbox checked:
        this.updateUserData(this.props.data)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data.id !== this.props.data.id) {

            this.updateUserData(this.props.data)
            for (let key in this.props.data) {
                this.validator.resetPropertiesByName(key, this.props.data[key])
            }
        /*
         * При чтении пользователей значение password не приходит,
         * дополнительная обработка: */
            if (!('password' in this.props.data)) {
                this.updateUserData({password: ''})
                this.validator.resetPropertiesByName('password', '')
            }

            this.validator.toggleDisabledBtn()
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

        const serverMsg = this.state && this.state.serverMsg && (
            <ServerMsg msg={ this.state.serverMsg }/>
        )

        return (
          <>
            <form onSubmit={ this.handleSubmitForm } ref={ this.props.formRef }>
                { inputs }
                <div className="App-buttonBox">
                    <input className="App-button" type="submit" value="Save"/>
                </div>
            </form>

            { serverMsg }
          </>
        )
    }

    handleInputChange(event) {
        const target = event.target;

        if (!target.readOnly) {
            const name = target.name;
            const value = target.type === 'checkbox' ? target.checked : target.value

            this.setState({
                [name]: value,
                'serverMsg': null
            });
            this.validator.checkValidByName(name)
            this.validator.toggleDisabledBtn()
        }
    }

    handleSubmitForm(event) {
        event.preventDefault()


        new Promise((resolve) => {
            const resultCheck = this.validator.validate()
            resolve(resultCheck)
        }).then((resultCheck) => {

            if (resultCheck) {

                const {token, updateUsers} = this.props
                const FORM = this.props.formRef.current
                const METHOD = this.state.id ? 'PATCH' : 'POST'
                let DATA = getFormData(FORM)
                let url = 'https://emphasoft-test-assignment.herokuapp.com/api/v1/users/'
                if (this.state.id) {
                    url = `${url}${this.state.id}/`
                } else {
                    const ID = makeId(4)
                    DATA.id = ID
                }

                fetchApp(url, DATA, (result) => {
                    const msg = result.detail
                    if (msg) this.setState({'serverMsg': msg})

                    updateUsers()
                    this.updateUserData(this.props.emptyUser)
                }, METHOD, token)
            }
        })
    }

    updateUserData(data) {
        this.setState({
            ...data
        })
    }
}
