const Container = ({ children, className = '' }) => {
  const containerClassName = ['container', className].filter(Boolean).join(' ');

  return <div className={containerClassName}>{children}</div>;
};

export default Container;
