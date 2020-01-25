import React, { useState, useEffect } from 'react';
import "./select.css";

export const Select = ({ placeholder, options, defaultValue, onChange }) => {
  const [value, setValue] = useState(defaultValue); // { label: "Foo", value: 'foo' }
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    onChange(value);
  }, [value, onChange])
  
  return (
    <div className="select" onClick={() => setOpen(open ? false : true)}>
      {!value
        ? <div className="select-placeholder">{placeholder}</div>
        : <div className="select-value">{value.label}</div>
      }
      <div className={`select-options ${open ? 'open' : ''}`}>
        {options.map(option => {
          return <div className="select-option" key={option.value} onClick={() => setValue(option)}>{option.label}</div>
        })}
      </div>
    </div>
  )
}
