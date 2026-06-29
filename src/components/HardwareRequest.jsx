import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Package, Search, Calendar, CheckCircle2, AlertTriangle, Scan, Camera } from 'lucide-react';
import { toast } from '../utils/toast';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

const HardwareRequest = () => {
  const { lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerProgress, setScannerProgress] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', itemCode: '', duration: '7' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [borrowRequests, setBorrowRequests] = useState([
    { id: 1, name: 'STM32 Nucleo F401RE', code: 'MCU-F401-01', requester: 'Yassine', returnDate: '2026-06-25', status: 'APPROVED' },
    { id: 2, name: 'Rigol DS1054Z Oscilloscope', code: 'OSC-RGL-02', requester: 'Sara', returnDate: '2026-06-21', status: 'PENDING' }
  ]);

  useEffect(() => {
    // Listen for latest requests
    const q = query(collection(db, 'hardware_requests'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const reqs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBorrowRequests(reqs);
      }
    });
    return () => unsubscribe();
  }, []);

  const inventory = [
    { id: 'mcu-stm32', name: 'STM32 Nucleo F401RE', desc: 'ARM Cortex-M4 development board for firmware design.', code: 'MCU-F401-01', total: 10, available: 6, category: 'MCU' },
    { id: 'osc-rigol', name: 'Rigol DS1054Z Oscilloscope', desc: '50 MHz 4 channels digital storage oscilloscope.', code: 'OSC-RGL-02', total: 3, available: 1, category: 'Test' },
    { id: 'sensor-lidar', name: 'RPLIDAR A1 2D LiDAR Scanner', desc: '360 degree laser range scanner for SLAM mapping.', code: 'LIDAR-A1-09', total: 4, available: 3, category: 'Sensor' },
    { id: 'lora-sx1276', name: 'SX1276 LoRa Transceiver Module', desc: '868/915 MHz long-range wireless communication RF chip.', code: 'RF-SX1276-15', total: 15, available: 12, category: 'RF' },
    { id: 'jetson-nano', name: 'NVIDIA Jetson Nano Developer Kit', desc: 'AI developer board for edge GPU analytics.', code: 'SBC-JTSN-04', total: 5, available: 2, category: 'SBC' }
  ];

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startScannerSim = () => {
    setScannerOpen(true);
    setScannerProgress(0);
    
    // Simulate camera scanner loading and scanning barcode
    const interval = setInterval(() => {
      setScannerProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setScannerOpen(false);
            // Auto fill barcode
            const randomItem = inventory[Math.floor(Math.random() * inventory.length)];
            setFormData(f => ({ ...f, itemCode: randomItem.code }));
            setSelectedItem(randomItem);
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.itemCode) {
      toast.warning(lang === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة!' : 'Please fill all required fields!');
      return;
    }

    const matchedItem = inventory.find(i => i.code === formData.itemCode);
    const itemName = matchedItem ? matchedItem.name : 'Unknown Device';

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, 'hardware_requests'), {
        name: itemName,
        code: formData.itemCode,
        requester: formData.name,
        email: formData.email,
        returnDate: new Date(Date.now() + parseInt(formData.duration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'PENDING',
        createdAt: serverTimestamp()
      });

      setFormData({ name: '', email: '', itemCode: '', duration: '7' });
      setSelectedItem(null);
      toast.success(lang === 'ar' ? 'تم تسجيل طلب الإعارة العتادية وهو في انتظار المراجعة.' : 'Hardware loan request submitted successfully.');
    } catch (error) {
      console.error(error);
      toast.error(lang === 'ar' ? 'حدث خطأ أثناء الإرسال.' : 'Error submitting request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 grid-bg px-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#00FF87]/10 text-[#00FF87] border border-[#00FF87]/20 uppercase tracking-wider mb-3 inline-block">
            {lang === 'ar' ? 'مخزن العتاد الرقمي' : 'Hardware Request & Inventory'}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1e3a5f] dark:text-white font-orbitron tracking-wide mb-4 uppercase">
            {lang === 'ar' ? 'نظام إعارة الأجهزة والمعدات' : 'Hardware Request System'}
          </h2>
          <div className="w-20 h-1 bg-[#00FF87] mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-cyber-muted text-sm leading-relaxed">
            {lang === 'ar' 
              ? 'تسمح هذه البوابة للطلاب والمهندسين بحجز واستعارة أجهزة الفحص، والمتحكمات، والحساسات من مختبرات المجموعة لتنفيذ مشاريعهم.' 
              : 'Allows students and engineers to request loans for oscilloscopes, microcontrollers, and sensors from the GITM inventory.'}
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inventory Catalogue (Left/col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-4 rounded-xl glass border border-[#3A506B]/20 flex items-center space-x-2 rtl:space-x-reverse bg-cyan-50 dark:bg-black/20">
              <Search className="text-slate-400 dark:text-cyber-muted" size={16} />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث عن جهاز (مثال: STM32, LiDAR)...' : 'Search hardware (e.g. STM32, LiDAR)...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs flex-1 text-[#1e3a5f] dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInventory.map(item => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setFormData(f => ({ ...f, itemCode: item.code }));
                  }}
                  className={`p-5 rounded-xl border transition-spring cursor-pointer flex flex-col justify-between ${
                    selectedItem?.id === item.id 
                      ? 'border-[#00FF87] bg-[#00FF87]/5' 
                      : 'border-[#3A506B]/20 dark:border-white/5 bg-[#e0fcfc] dark:bg-black/20 hover:border-[#3A506B]/40'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-mono font-bold bg-[#3A506B]/20 text-[#3A506B] dark:text-[#8A99AD] px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-cyber-muted">
                        CODE: {item.code}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#1e3a5f] dark:text-white mb-2">{item.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-cyber-muted leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#3A506B]/10 dark:border-white/5 text-[10px]">
                    <span className="text-slate-400 dark:text-cyber-muted">
                      {lang === 'ar' ? `المجموع الكلي: ${item.total}` : `Total Stock: ${item.total}`}
                    </span>
                    <span className={`font-bold ${item.available > 0 ? 'text-[#00FF87]' : 'text-red-400'}`}>
                      {lang === 'ar' 
                        ? (item.available > 0 ? `متاح للإعارة: ${item.available}` : 'غير متوفر حالياً') 
                        : (item.available > 0 ? `Available: ${item.available}` : 'Out of Stock')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Requests Tracker */}
            <div className="p-6 rounded-2xl glass border border-[#3A506B]/20 bg-cyan-50 dark:bg-black/20">
              <h3 className="text-sm font-bold text-[#1e3a5f] dark:text-white uppercase tracking-wider font-orbitron mb-4">
                {lang === 'ar' ? 'سجل طلبات الاستعارة النشطة' : 'Active Hardware Loan Log'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#3A506B]/20 text-slate-400 dark:text-cyber-muted">
                      <th className="pb-2 font-bold">{lang === 'ar' ? 'اسم الجهاز' : 'Device'}</th>
                      <th className="pb-2 font-bold">{lang === 'ar' ? 'المستعير' : 'Borrower'}</th>
                      <th className="pb-2 font-bold">{lang === 'ar' ? 'تاريخ الإرجاع' : 'Return Date'}</th>
                      <th className="pb-2 font-bold">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3A506B]/10 dark:divide-white/5">
                    {borrowRequests.map(req => (
                      <tr key={req.id} className="text-[#2d507b] dark:text-cyber-text">
                        <td className="py-2.5 font-bold">{req.name}</td>
                        <td className="py-2.5">{req.requester}</td>
                        <td className="py-2.5">{req.returnDate}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            req.status === 'APPROVED' ? 'bg-[#00FF87]/15 text-[#00FF87]' : 'bg-yellow-500/15 text-yellow-400'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Borrow Form panel (Right/col-span-4) */}
          <div className="lg:col-span-4 p-6 rounded-2xl glass border border-[#3A506B]/20 bg-cyan-50 dark:bg-black/20 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#1e3a5f] dark:text-white uppercase tracking-wider font-orbitron">
                {lang === 'ar' ? 'طلب إعارة عتاد جديد' : 'New Loan Request'}
              </h3>
              <Package size={18} className="text-[#00FF87]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-right rtl:text-right ltr:text-left text-xs">
              <div>
                <label className="block text-slate-400 dark:text-cyber-muted mb-1">{lang === 'ar' ? 'اسم الطالب / المهندس' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  placeholder={lang === 'ar' ? 'مثال: سارة الفاسي' : 'e.g. Sara Fassi'}
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-[#3A506B]/20 dark:border-white/5 bg-[#e0fcfc] dark:bg-black/40 text-[#1e3a5f] dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-cyber-muted mb-1">{lang === 'ar' ? 'البريد الإلكتروني المهني' : 'Work Email'}</label>
                <input
                  type="email"
                  required
                  placeholder="name@gitm.ma"
                  value={formData.email}
                  onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-[#3A506B]/20 dark:border-white/5 bg-[#e0fcfc] dark:bg-black/40 text-[#1e3a5f] dark:text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 dark:text-cyber-muted mb-1">
                  {lang === 'ar' ? 'رمز الباركود للجهاز' : 'Device Barcode/Code'}
                </label>
                <div className="flex space-x-2 rtl:space-x-reverse items-center">
                  <input
                    type="text"
                    required
                    placeholder="e.g. MCU-F401-01"
                    value={formData.itemCode}
                    onChange={(e) => setFormData(f => ({ ...f, itemCode: e.target.value }))}
                    className="flex-1 p-2.5 rounded-lg border border-[#3A506B]/20 dark:border-white/5 bg-[#e0fcfc] dark:bg-black/40 text-[#1e3a5f] dark:text-white outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={startScannerSim}
                    className="p-2.5 rounded-lg bg-[#3A506B]/20 border border-[#3A506B]/30 hover:border-[#00FF87]/50 text-[#00FF87] hover:bg-[#00FF87]/10 transition-all"
                    title={lang === 'ar' ? 'مسح باركود' : 'Scan Barcode'}
                  >
                    <Scan size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 dark:text-cyber-muted mb-1">{lang === 'ar' ? 'مدة الإعارة المطلوبة' : 'Loan Duration'}</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData(f => ({ ...f, duration: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-[#3A506B]/20 dark:border-white/5 bg-[#e0fcfc] dark:bg-black/40 text-[#1e3a5f] dark:text-white outline-none"
                >
                  <option value="3">{lang === 'ar' ? '3 أيام' : '3 Days'}</option>
                  <option value="7">{lang === 'ar' ? 'أسبوع واحد' : '1 Week'}</option>
                  <option value="14">{lang === 'ar' ? 'أسبوعين' : '2 Weeks'}</option>
                  <option value="30">{lang === 'ar' ? 'شهر واحد' : '1 Month'}</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-[#00FF87] to-emerald-500 text-black font-black uppercase tracking-wider hover:shadow-glow-emerald transition-all text-center disabled:opacity-50"
              >
                {isSubmitting ? '...' : (lang === 'ar' ? 'إرسال طلب الإعارة العتادية' : 'Submit Loan Request')}
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Barcode Scanner Simulator Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-2xl glass border border-[#3A506B]/30 text-center space-y-6">
            <div className="flex justify-between items-center border-b border-[#3A506B]/20 pb-3">
              <span className="text-xs font-mono text-[#00FF87] font-bold">BARCODE_SCANNER_v1.0</span>
              <span className="text-white/60 font-mono text-[9px]">CONNECTING_CAMERA...</span>
            </div>

            {/* Viewfinder simulation */}
            <div className="relative aspect-square max-w-[280px] mx-auto border-2 border-dashed border-[#00FF87] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <Camera size={48} className="text-white/20 animate-pulse" />
              
              {/* Horizontal laser scan line */}
              <div 
                style={{ top: `${scannerProgress}%` }}
                className="absolute left-0 w-full h-1 bg-[#00FF87] shadow-glow-emerald transition-all duration-150"
              ></div>

              <span className="absolute bottom-2 text-[9px] font-mono text-white/50 tracking-wider">
                AUTO_FOCUS: ACTIVE
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-[#8A99AD]">
                {lang === 'ar' 
                  ? 'جاري محاكاة الوصول لكاميرا الهاتف/الحاسوب للتعرف على الرمز التلقائي.' 
                  : 'Simulating camera view feed to recognize physical device barcode.'}
              </p>
              
              {/* Progress bar */}
              <div className="w-full h-1 bg-[#e0fcfc]/5 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${scannerProgress}%` }}
                  className="h-full bg-[#00FF87] transition-all"
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HardwareRequest;
