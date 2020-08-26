export const getFormData = (form) => {
    let data = {}
    for (const input of form.elements){
        if (input.type !== 'submit' && input.type !== 'button') {
            data[input.name] = form[input.name].value
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

export const DATASET_TOUCH_PROP = 'data-notouched'
export const resetDataNotouched = (element) => {
    if (element.dataset.notouched) {
        element.dataset.notouched = false
    }
}
