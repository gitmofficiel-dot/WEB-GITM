import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Server, CalendarDays, AlertTriangle, Users, 
  CheckCircle, Clock, Search, Wrench, 
  Package, Database, LayoutDashboard, Monitor, Cpu, Plus, Edit, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SupervisorDashboard() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Data
  const [inventory, setInventory] = useState([
    { id: 1, item: 'NVIDIA Jetson Nano', quantity: 15, status: 'In Stock' },
    { id: 2, item: 'Raspberry Pi 4', quantity: 3, status: 'Low Stock' },
    { id: 3, item: 'LIDAR Sensors', quantity: 0, status: 'Out of Stock' }
  ]);

  const [bookings, setBookings] = useState([
    { id: 1, team: 'Alpha Robotics', room: 'AI Lab 1', time: '10:00 - 12:00', date: 'Today', status: 'Active' },
    { id: 2, team: 'Vision Team', room: 'Hardware Lab', time: '14:00 - 16:00', date: 'Today', status: 'Pending' }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, message: 'Server rack 2 temperature high', type: 'warning', time: '10 mins ago' },
    { id: 2, message: '3D Printer Maintenance due', type: 'info', time: '2 hours ago' }
  ]);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div whileHover={{ y: -5 }} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-${color}-500 group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-[#1e3a5f] dark:text-white">{value}</h3>
          <p className={`text-sm mt-2 font-medium ${trend.startsWith('+') || trend.startsWith('Ok') ? 'text-emerald-500' : 'text-amber-500'}`}>
            {trend}
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'overview', icon: LayoutDashboard, label: lang === 'ar' ? 'نظرة عامة' : 'Overview' },
    { id: 'inventory', icon: Package, label: lang === 'ar' ? 'المخزون' : 'Inventory' },
    { id: 'schedule', icon: CalendarDays, label: lang === 'ar' ? 'حجوزات المعامل' : 'Lab Schedule' },
    { id: 'maintenance', icon: Wrench, label: lang === 'ar' ? 'الصيانة' : 'Maintenance Alerts' }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up pb-10 min-h-screen">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0">
        <div className="glass-card rounded-3xl p-4 sticky top-24 border border-amber-200 dark:border-slate-800">
          <div className="mb-6 px-2">
            <h2 className="text-xl font-orbitron font-bold gradient-text">{lang === 'ar' ? 'المشرف' : 'Supervisor'}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{lang === 'ar' ? 'إدارة المعامل والمعدات' : 'Lab & Equipment Management'}</p>
          </div>
          <nav className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    isActive 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 translate-x-2' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'animate-pulse' : ''} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 w-full"
          >
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard title={lang === 'ar' ? 'المعدات المتاحة' : 'Hardware Inv.'} value="342" icon={Cpu} color="blue" trend="98% Functional" />
                  <StatCard title={lang === 'ar' ? 'حجوزات المعمل' : 'Lab Bookings'} value="8" icon={CalendarDays} color="emerald" trend="Today" />
                  <StatCard title={lang === 'ar' ? 'تنبيهات الصيانة' : 'Maintenance'} value="2" icon={AlertTriangle} color="amber" trend="Action Required" />
                  <StatCard title={lang === 'ar' ? 'الفرق النشطة' : 'Active Teams'} value="12" icon={Users} color="purple" trend="+2 this week" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Alerts Panel */}
                  <div className="glass-card rounded-3xl p-6 border border-amber-200/50 dark:border-amber-900/30">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <AlertTriangle className="text-amber-500" size={24}/> {lang === 'ar' ? 'أحدث التنبيهات' : 'Recent Alerts'}
                    </h3>
                    <div className="space-y-3">
                      {alerts.map(alert => (
                        <div key={alert.id} className={`p-4 rounded-xl border flex items-start gap-3 ${alert.type === 'warning' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}>
                          {alert.type === 'warning' ? <AlertTriangle size={20} className="text-red-500 shrink-0"/> : <Wrench size={20} className="text-blue-500 shrink-0"/>}
                          <div>
                            <p className={`font-bold ${alert.type === 'warning' ? 'text-red-700 dark:text-red-400' : 'text-blue-700 dark:text-blue-400'}`}>{alert.message}</p>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock size={12}/> {alert.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Bookings Quick View */}
                  <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                      <Monitor className="text-emerald-500" size={24}/> {lang === 'ar' ? 'المعامل النشطة' : 'Active Labs'}
                    </h3>
                    <div className="space-y-4">
                      {bookings.filter(b => b.status === 'Active').map(booking => (
                        <div key={booking.id} className="flex justify-between items-center p-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                          <div>
                            <h4 className="font-bold text-[#1e3a5f] dark:text-white">{booking.room}</h4>
                            <p className="text-sm text-slate-500">{booking.team}</p>
                          </div>
                          <span className="text-sm font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-lg">
                            {booking.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INVENTORY TAB */}
            {activeTab === 'inventory' && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <Package className="text-blue-500" size={24}/> {lang === 'ar' ? 'إدارة المخزون والمعدات' : 'Inventory Management'}
                  </h3>
                  <div className="flex gap-2">
                    <div className="relative hidden md:block">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <button className="btn-primary bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Plus size={16}/> {lang === 'ar' ? 'إضافة معدات' : 'Add Item'}</button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-xs">
                        <th className="p-3 font-bold">Item Name</th>
                        <th className="p-3 font-bold text-center">Quantity</th>
                        <th className="p-3 font-bold">Status</th>
                        <th className="p-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {inventory.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-bold text-[#1e3a5f] dark:text-white flex items-center gap-2">
                            <Cpu size={16} className="text-slate-400"/> {item.item}
                          </td>
                          <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">{item.quantity}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-[10px] rounded uppercase font-bold ${
                              item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-600' :
                              item.status === 'Low Stock' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                            }`}>{item.status}</span>
                          </td>
                          <td className="p-3 text-right">
                            <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Edit size={16}/></button>
                            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SCHEDULE TAB */}
            {activeTab === 'schedule' && (
              <div className="glass-card rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[#1e3a5f] dark:text-white">
                    <CalendarDays className="text-purple-500" size={24}/> {lang === 'ar' ? 'جدول المعامل' : 'Lab Schedule'}
                  </h3>
                </div>
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div>
                        <h4 className="font-bold text-[#1e3a5f] dark:text-white text-lg">{booking.room}</h4>
                        <p className="text-sm text-slate-500 flex items-center gap-2"><Users size={14}/> {booking.team} • <CalendarDays size={14}/> {booking.date}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <span className="text-slate-600 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-sm">{booking.time}</span>
                        {booking.status === 'Pending' ? (
                          <div className="flex gap-2">
                            <button className="bg-emerald-100 text-emerald-600 hover:bg-emerald-200 p-2 rounded-lg"><CheckCircle size={18}/></button>
                            <button className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-lg"><Trash2 size={18}/></button>
                          </div>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold">Approved</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MAINTENANCE TAB */}
            {activeTab === 'maintenance' && (
              <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-full flex items-center justify-center mb-4">
                  <Wrench size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] dark:text-white mb-2">
                  {lang === 'ar' ? 'إدارة الصيانة الشاملة' : 'Comprehensive Maintenance'}
                </h3>
                <p className="text-slate-500 mb-6 max-w-md">
                  {lang === 'ar' ? 'سجل طلبات الصيانة وأوقات الفحص الدوري للمعدات.' : 'Log maintenance requests and routine inspection times for all equipment.'}
                </p>
                <button className="btn-primary bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                  <Plus size={18} /> {lang === 'ar' ? 'إنشاء تذكرة صيانة' : 'Create Maintenance Ticket'}
                </button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}