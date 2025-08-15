export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      className={`h-12 w-full rounded-xl border border-grayB px-4
                  focus:outline-none focus:ring-2 focus:ring-black/20 ${className}`}
      {...rest}
    />
  );
}
