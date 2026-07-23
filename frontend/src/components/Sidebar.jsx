import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BarChart2,
  TrendingUp,
  Settings,
  PieChart,
  ClipboardList
} from 'lucide-react';

const links = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/predictions', label: 'Predictions', icon: BarChart2 },
  { to: '/retention', label: 'Retention', icon: TrendingUp },
  { to: '/analytics', label: 'Analytics', icon: PieChart },
  { to: '/reports', label: 'Reports', icon: ClipboardList },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => (
  <motion.aside
    initial={{ x: -40, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="fixed left-0 top-0 h-screen w-72
               bg-[#0F172A]/90
               backdrop-blur-xl
               border-r border-white/10
               px-5 py-6
               overflow-y-auto"
  >
    {/* Logo */}
    <div className="mb-10">
      <h1 className="text-2xl font-bold text-white">
        Churn<span className="text-cyan-400">AI</span>
      </h1>

      <p className="text-sm text-gray-400 mt-1">
        Retention Intelligence Platform
      </p>
    </div>

    {/* Navigation */}
    <nav>
      <ul className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
                `
              }
            >
              <Icon size={18} />
              <span className="font-medium">
                {label}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>

    {/* Bottom status card */}
    <div className="mt-10">
      <div className="glass-card p-4">
        <p className="text-xs text-gray-400 mb-2">
          AI Prediction Engine
        </p>

        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-sm text-emerald-400">
            Operational
          </span>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Monitoring customer churn and retention signals.
        </p>
      </div>
    </div>
  </motion.aside>
);

export default Sidebar;