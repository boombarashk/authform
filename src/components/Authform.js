import React from 'react';
import {Input} from "./Input";
import {fetchApp} from "../fetchUtils";
import Validator, { USERNAMESIMPLE, REQUIRED } from "../Validator";
import { getFormData, setToken as setStorageToken, setStorageUsername } from "../formUtils";
import {ServerMsg} from "./Servermsg";

export default class AuthForm extends React.Component {
    constructor(props) {
        super(props)

        this.inputs = [
            { name: 'username', type: 'text', id: 'userLogin', label: 'Username', validator: USERNAMESIMPLE, requiredView: true},
            { name: 'password', type: 'password', id: 'userPassword', label: 'Password', validator: REQUIRED, requiredView: true}
        ]

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
    }

    componentDidMount() {
        const authForm = this.props.formRef.current
        if (authForm) { this.validator = new Validator(authForm, this.inputs) }
    }

    render() {
        if (this.props.token) return null;

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
            <ServerMsg msg={ this.state.serverMsg }
                       classNameModify="App-serverMsg--error"
            />
        )

        return(
            <>
            <form onSubmit={ this.handleSubmitForm } ref={ this.props.formRef }>
                { inputs }
                <div className="App-buttonBox">
                    <input className="App-button" type="submit" value="Send"/>
                </div>
            </form>

            { serverMsg }
            </>
        )
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: target.value,
            'serverMsg': null
        });
        this.validator.checkValidByName(name)
        this.validator.toggleDisabledBtn()
    }

    handleSubmitForm(event) {
        event.preventDefault()

        new Promise((resolve) => {
            const resultCheck = this.validator.validate()
            resolve(resultCheck)
        }).then((resultCheck) => {
            if (resultCheck) {
                fetchApp('https://emphasoft-test-assignment.herokuapp.com/api-token-auth/',
                    getFormData(this.props.formRef.current), (result) => {
                        let msg = null
                        if (result['non_field_errors']) {
                            msg = result['non_field_errors'].join('\n')
                        }
                        this.setState({'serverMsg': msg})

                        if (result.token) {
                            setStorageToken(result.token)
                            this.props.setStateToken(result.token)
                            setStorageUsername(this.state.username)
                            this.props.setUsername(this.state.username)
                        }
                    })
            }

            this.validator.toggleDisabledBtn()
        })
    }
}
