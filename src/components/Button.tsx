export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...rest } = props;
  return (
    <button
      className={`h-12 w-full rounded-xl bg-primary text-white font-medium
                  transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-black/30 ${className}`}
      {...rest}
    />
  );
}
