interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionHeader({ children, className = "" }: SectionHeaderProps) {
  return (
    <h3
      className={`text-[9px] text-slate-500 uppercase tracking-wider font-semibold ${className}`}
    >
      {children}
    </h3>
  );
}
