import { getInputsForValidation } from './formUtils'

const CLASSNAME_ERRORFIELD = 'App-errorField'
const CLASSNAME_ERRORMSG = 'App-errorMsg'
export const DATASET_VALID_PROP = 'data-valid'
const getDataValid = (element) => element.dataset.valid
const setDataValid = (element, checkValue) => {
    if (element.dataset.valid) {
        element.dataset.valid = checkValue
    }
}

export const USERNAMESIMPLE = 'username_simple'
export const USERNAME = 'username'
export const REQUIRED = 'required'
export const PASSWORD = 'password'
export const FIRSTNAME = 'firstname'
export const LASTNAME = 'lastname'

const ERROR_MSGS = {
    'required': 'This field may not be blank.',
    'minl': (count) => `Minimal length this field ${count}`,
    'maxl': (count) => `Maximal length this field ${count}`,
    'nopattern': 'Value does not match pattern',
}

export default class Validator {
    constructor(form, inputs){
        this.form = form
        this.submitbtn = form.querySelector('[type="submit"]')
        this.checkers = getInputsForValidation(inputs)

        this.initValidation()
        this.toggleDisabledBtn()
    }

    get valid (){
        return this.checkers.reduce( (resultCheck, currentInput) => {
            const { fieldName } = currentInput
            return resultCheck && getDataValid(this.form[fieldName]) === 'true'
        }, true )
    }

    minLength(count, value) {
        return value.length >= count
    }

    maxLength(count, value) {
        return value.length <= count
    }

    required(value) {console.log(this, arguments)
        return !!value.trim().length
    }

    regExp(pattern, value) {
        return new RegExp(pattern).test(value)
    }

    initValidation = () => {
        const DEFAULT_MINLENGTH = 1
        const DEFAULT_MAXLENGTH = 150

        this.checkers.forEach( check => {
            const field = this.form[check.fieldName]
            let checkersSet, msgSet = []

            switch (check.checkName) {
                case REQUIRED: checkersSet = [this.required]
                    msgSet = [ERROR_MSGS.required]; break

                case USERNAMESIMPLE: checkersSet = [
                    this.required,
                    this.minLength.bind(this, DEFAULT_MINLENGTH),
                    this.maxLength.bind(this, DEFAULT_MAXLENGTH),
                ]
                msgSet = [ERROR_MSGS.required, ERROR_MSGS.minl(DEFAULT_MINLENGTH), ERROR_MSGS.maxl(DEFAULT_MAXLENGTH)];
                break

                case USERNAME: checkersSet = [
                    this.required,
                    this.minLength.bind(this, DEFAULT_MINLENGTH),
                    this.maxLength.bind(this, DEFAULT_MAXLENGTH),
                    this.regExp.bind(this, '^[\\w.@+-]+$')
                ];
                msgSet = [
                    ERROR_MSGS.required,
                    ERROR_MSGS.minl(DEFAULT_MINLENGTH),
                    ERROR_MSGS.maxl(DEFAULT_MAXLENGTH),
                    'Letters, digits and @/./+/-/_ only'
                ]
                break

                case PASSWORD: checkersSet = [
                    this.minLength.bind(this, DEFAULT_MINLENGTH),
                    this.maxLength.bind(this, 128),
                    this.regExp.bind(this, '^(?=.*[A-Z])(?=.*\\d).{8,}$')
                ];
                msgSet = [
                    ERROR_MSGS.minl(DEFAULT_MINLENGTH),
                    ERROR_MSGS.maxl(128),
                    ERROR_MSGS.nopattern
                ]
                break

                case FIRSTNAME: checkersSet = [
                    this.maxLength.bind(this, 30),
                ]
                msgSet = [ERROR_MSGS.maxl(30),]
                break

                case LASTNAME: checkersSet = [
                    this.maxLength.bind(this, DEFAULT_MAXLENGTH),
                ]
                msgSet = [ERROR_MSGS.maxl(DEFAULT_MAXLENGTH)]
                break

                default: checkersSet = []
            }

            field.checkers = checkersSet
            field.msgSet = msgSet
            field.errorBox = field.nextElementSibling
        })
    }

    checkValidByName(fieldName) {
        const field = this.form[fieldName]
        if (field.checkers) {
            const countCheckers = field.checkers.length
            for (let index = 0; index < countCheckers; index++) {
                const checkResult = field.checkers[index](field.value)
                setDataValid(field, checkResult)
                if (checkResult === false) {
                    field.classList.add(CLASSNAME_ERRORFIELD)
                    field.errorBox.classList.add(CLASSNAME_ERRORMSG)
                    field.errorBox.innerHTML = field.msgSet[index]
                    index = countCheckers
                } else {
                    field.classList.remove(CLASSNAME_ERRORFIELD)
                    field.errorBox.classList.remove(CLASSNAME_ERRORMSG)
                    field.errorBox.innerHTML = ''
                }
            }
        }
        this.toggleDisabledBtn()
    }

    toggleDisabledBtn() {
        if (this.submitbtn) {
            this.submitbtn.disabled = !this.valid
        }
    }
}