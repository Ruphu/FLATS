import React from 'react';
import styles from './RangeInput.module.scss';

const RangeInput = ({ title, nameMin, nameMax, valueMin, valueMax, onChange }) => {
  return (
    <div className={styles.range_group}>
      <h3 className={styles.range_title}>{title}</h3>
      <div className={styles.range_inputs}>
        <input 
          type="number" 
          placeholder="от"
          name={nameMin}
          value={valueMin}
          onChange={onChange}
          className={styles.range_input}
        />
        <input 
          type="number" 
          placeholder="до"
          name={nameMax}
          value={valueMax}
          onChange={onChange}
          className={styles.range_input}
        />
      </div>
    </div>
  );
};

export default RangeInput;