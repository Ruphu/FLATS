import React from 'react';
import styles from './Checkbox.module.scss';

const Checkbox = ({ name, value, label, checked, onChange }) => {
  const id = `${name}-${value}`;
  
  return (
    <div className={styles.checkbox_wrapper}>
      <input
        id={id}
        className={styles.checkbox_input}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className={styles.checkbox_label}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;