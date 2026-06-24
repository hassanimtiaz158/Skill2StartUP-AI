export default function Badge({ children, inverted = false, className = '' }) {
  return (
    <span className={`inline-flex items-center border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${inverted ? 'border-[#F5F3EE] text-[#F5F3EE]' : 'border-[#0A0A0A] text-[#0A0A0A]'} ${className}`}>
      {children}
    </span>
  );
}
