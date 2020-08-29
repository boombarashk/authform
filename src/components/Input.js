import React from 'react';
import { DATASET_VALID_PROP, DATASET_TOUCH_PROP } from "../Validator";

export function Input(props) {
    const {id, type, name, label, readOnly, validator, requiredView} = props.opts
    const inputProps = { id, type, name, readOnly }
    if (validator) {
        inputProps[DATASET_VALID_PROP] = false
        inputProps[DATASET_TOUCH_PROP] = props.value.length > 0 ? false : true
    }
    const valueProps = (type === 'checkbox') ? { checked: props.value} : {value: props.value}

    const requiredSpan = requiredView ? <span className="App-required">*</span> : null

    return (
      <div className="App-inputBox">
          <label htmlFor={id} className={`App-label ${readOnly ? 'App-label--readonly' : ''}`}>{ label }
              {requiredSpan}
          </label>
          <input className="App-inputText"
                 { ...inputProps }
                 { ...valueProps }
                 onChange={ props.changeHandler }/>
          <div className="App-gap"></div>
      </div>
    )
}
