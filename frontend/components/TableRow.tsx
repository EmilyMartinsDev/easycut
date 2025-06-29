import { ReactNode } from 'react';

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export function TableRow({ children, className = '' }: TableRowProps) {
  return (
    <tr className={`hover:bg-gray-50 transition-colors ${className}`}>
      {children}
    </tr>
  );
}