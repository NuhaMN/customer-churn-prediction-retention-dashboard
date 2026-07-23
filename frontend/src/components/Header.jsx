import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#111827] bg-opacity-90 backdrop-blur-md border-b border-[#2A2A34]">
      <div className="flex items-center space-x-3">
        <div className="text-2xl font-bold text-[#22D3EE]">AI‑Churn</div>
        <span className="text-[#A0AEC0] text-sm">Dashboard</span>
      </div>
      <div className="flex items-center space-x-4">
        <Search className="w-5 h-5 text-[#A0AEC0]" />
        <Bell className="w-5 h-5 text-[#A0AEC0]" />
        <User className="w-5 h-5 text-[#A0AEC0]" />
      </div>
    </header>
  );
}
