import React from 'react';
import {
  LayoutDashboard,
  Map,
  TrendingUp,
  AlertTriangle,
  Database,
  FileText,
  Settings
} from 'lucide-react';

export type NavTab =
  | 'Dashboard'
  | 'Reserve Mapping'
  | 'Production Forecast'
  | 'Shortfall Analysis'
  | 'Data & Indicators'
  | 'Reports'
  | 'Settings';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { name: NavTab; icon: React.FC<{ className?: string }> }[] = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Reserve Mapping', icon: Map },
    { name: 'Production Forecast', icon: TrendingUp },
    { name: 'Shortfall Analysis', icon: AlertTriangle },
    { name: 'Data & Indicators', icon: Database },
    { name: 'Reports', icon: FileText },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => onSelectTab(tab.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold border-b-2 border-emerald-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
