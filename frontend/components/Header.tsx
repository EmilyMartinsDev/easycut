'use client';
import Link from 'next/link';
import { FiHome, FiSettings } from 'react-icons/fi';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
          EasyCut
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FiHome className="mr-1" />
            Início
          </Link>
          <Link
            href="/configuracoes"
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FiSettings className="mr-1" />
            Configurações
          </Link>
        </nav>
      </div>
    </header>
  );
}
