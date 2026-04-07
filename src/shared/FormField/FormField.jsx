import styles from './FormField.module.scss';

const FormField = ({
  autoComplete,
  id,
  label,
  name,
  onChange,
  placeholder,
  required = true,
  type,
  value,
}) => {
  return (
    <label className={styles.field} htmlFor={id ?? name}>
      <span className={styles.label}>{label}</span>
      <input
        autoComplete={autoComplete}
        className={styles.input}
        id={id ?? name}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
};

export default FormField;
