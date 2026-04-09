const CheckboxWrapper = ({ children, className = '' }) => {
  const wrapperClassName = ['checkbox_wrapper', className].filter(Boolean).join(' ');

  return <div className={wrapperClassName}>{children}</div>;
};

export default CheckboxWrapper;
