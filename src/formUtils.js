export const getFormData = (form) => {
    let data = {}
    for (const input of form.elements){
        if (input.type !== 'submit' && input.type !== 'button') {
            data[input.name] = (input.type !== 'checkbox')
                ? form[input.name].value
                : form[input.name].checked
        }
    }
    return data
}

export const getInputsForValidation = (inputsArray) => {
    return inputsArray.filter(input => input.validator).map( input => {
        return {
            fieldName: input.name,
            checkName: input.validator,
        }
    })
}

export const setToken = (value) => {
    if (value) {
        const expiredDate = new Date(new Date().getTime() + 3600 * 1000)
        localStorage.setItem('expiredDate', expiredDate)
        localStorage.setItem('token', value)
    } else {
        localStorage.clear()
    }
}
export const getToken = () => {
    const expiredDate = localStorage.getItem('expiredDate')
    if (expiredDate) {
        if (new Date() < new Date(expiredDate)) {
            return localStorage.getItem('token')
        } else {
            localStorage.clear()
        }
    }
    return null
}

export const getStorageUsername = () => localStorage.getItem('username')
export const setStorageUsername = (name) => localStorage.setItem('username', name)
