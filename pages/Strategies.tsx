import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Zap, 
  Trophy, 
  Clock, 
  MoreVertical,
  Plus,
  Play,
  X,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Types
interface Strategy {
  id: number;
  name: string;
  winRate: number;
  trades: number;
  xp: number;
  tags: string[];
  status: 'Active' | 'Testing' | 'Archived';
  desc: string;
}

const INITIAL_STRATEGIES: Strategy[] = [
  {
    id: 1,
    name: "ICT Silver Bullet",
    winRate: 72,
    trades: 145,
    xp: 85,
    tags: ["Scalp", "M15"],
    status: "Active",
    desc: "Targeting fair value gaps during the AM session open. High probability setup."
  },
  {
    id: 2,
    name: "Asian Range Sweep",
    winRate: 45,
    trades: 32,
    xp: 30,
    tags: ["Reversal", "Forex"],
    status: "Testing",
    desc: "Waiting for liquidity grabs on the high/low of the Asian session."
  },
  {
    id: 3,
    name: "Golden Pocket Pullback",
    winRate: 61,
    trades: 89,
    xp: 65,
    tags: ["Fibonacci", "Trend"],
    status: "Active",
    desc: "Trend continuation entries at the 0.618 retracement level."
  }
];

const StrategyModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: Partial<Strategy>) => void; 
  initialData?: Strategy | null;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    status: 'Active',
    tags: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        desc: initialData.desc,
        status: initialData.status,
        tags: initialData.tags.join(', ')
      });
    } else {
      setFormData({ name: '', desc: '', status: 'Active', tags: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      desc: formData.desc,
      status: formData.status as any,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#162b1e] border border-gray-200 dark:border-primary/20 w-full max-w-lg rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display mb-1">
          {initialData ? 'Edit Strategy' : 'Create New Strategy'}
        </h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Define the parameters of your trading edge.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Strategy Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-50 dark:bg-[#102216] border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-emerald-600 dark:focus:border-primary focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:focus:ring-primary transition-all placeholder-gray-400"
              placeholder="e.g. Opening Range Breakout"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-[#102216] border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-emerald-600 dark:focus:border-primary focus:outline-none appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Testing">Testing</option>
                  <option value="Archived">Archived</option>
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Tags</label>
                <input 
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-[#102216] border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-emerald-600 dark:focus:border-primary focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:focus:ring-primary transition-all placeholder-gray-400"
                  placeholder="Scalp, Trend..."
                />
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Description</label>
            <textarea 
              required
              value={formData.desc}
              onChange={e => setFormData({...formData, desc: e.target.value})}
              rows={3}
              className="w-full bg-gray-50 dark:bg-[#102216] border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-emerald-600 dark:focus:border-primary focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:focus:ring-primary transition-all resize-none placeholder-gray-400"
              placeholder="Describe the entry criteria and philosophy..."
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-white/10 text-gray-600 dark:text-slate-300 font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-600 dark:bg-primary text-white dark:text-[#102216] font-bold hover:bg-emerald-700 dark:hover:bg-primary-dim shadow-sm dark:shadow-neon transition-all">
              {initialData ? 'Save Changes' : 'Create Strategy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StrategyCard = ({ 
  strategy, 
  onEdit, 
  onDelete 
}: { 
  strategy: Strategy; 
  onEdit: (s: Strategy) => void; 
  onDelete: (id: number) => void; 
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="glass-panel group relative rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/50 dark:hover:border-primary/50 hover:shadow-lg dark:hover:shadow-neon-strong hover:-translate-y-1 flex flex-col h-full">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
          strategy.status === 'Active' ? 'bg-emerald-100 dark:bg-primary/20 text-emerald-700 dark:text-primary border border-emerald-200 dark:border-primary/20' : 
          strategy.status === 'Testing' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20' :
          'bg-gray-100 dark:bg-gray-500/20 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-500/20'
        }`}>
          {strategy.status}
        </span>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-[#162b1e] border border-gray-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
              <button 
                onClick={() => { setMenuOpen(false); onEdit(strategy); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button 
                onClick={() => { setMenuOpen(false); onDelete(strategy.id); }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display mb-2 group-hover:text-emerald-600 dark:group-hover:text-primary transition-colors">{strategy.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 flex-1">{strategy.desc}</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100 dark:bg-[#102216] rounded-xl p-3 border border-gray-200 dark:border-white/5">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Win Rate</p>
          <div className="flex items-end gap-1">
            <span className={`text-xl font-bold font-display ${strategy.winRate >= 50 ? 'text-emerald-600 dark:text-primary' : 'text-red-500 dark:text-red-400'}`}>{strategy.winRate}%</span>
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-[#102216] rounded-xl p-3 border border-gray-200 dark:border-white/5">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Trades</p>
          <div className="flex items-end gap-1">
            <span className="text-xl font-bold text-gray-900 dark:text-white font-display">{strategy.trades}</span>
          </div>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500 font-bold flex items-center gap-1"><Zap size={12} className="text-yellow-500 dark:text-yellow-400" /> Mastery XP</span>
          <span className="text-gray-900 dark:text-white font-mono">Lvl {Math.floor(strategy.xp / 20) + 1}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-[#102216] rounded-full h-1.5 overflow-hidden border border-gray-200 dark:border-white/5">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-primary-dim dark:to-primary h-full rounded-full transition-all duration-1000 ease-out shadow-sm dark:shadow-[0_0_8px_rgba(19,236,91,0.4)]" 
            style={{ width: `${strategy.xp}%` }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-2">
        {strategy.tags.map((tag: string, i: number) => (
          <span key={i} className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md border border-gray-200 dark:border-white/5 uppercase tracking-wide">#{tag}</span>
        ))}
      </div>
    </div>
  );
};

const Strategies: React.FC = () => {
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState<Strategy[]>(INITIAL_STRATEGIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);

  const bestPerformer = strategies.reduce((prev, current) => (prev.winRate > current.winRate) ? prev : current, strategies[0]);

  const handleCreate = () => {
    setEditingStrategy(null);
    setIsModalOpen(true);
  };

  const handleEdit = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this strategy?')) {
      setStrategies(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSave = (data: Partial<Strategy>) => {
    if (editingStrategy) {
      // Update existing
      setStrategies(prev => prev.map(s => s.id === editingStrategy.id ? { ...s, ...data } as Strategy : s));
    } else {
      // Create new
      const newStrategy: Strategy = {
        id: Date.now(),
        name: data.name || 'New Strategy',
        desc: data.desc || '',
        status: data.status as any || 'Active',
        tags: data.tags || [],
        winRate: 0,
        trades: 0,
        xp: 0
      };
      setStrategies(prev => [...prev, newStrategy]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full min-h-screen animate-in fade-in duration-500">
      
      <StrategyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave}
        initialData={editingStrategy}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight font-display mb-2">Strategy <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-primary dark:to-primary-dim">Playbook</span></h1>
          <p className="text-gray-500 dark:text-slate-400 text-lg">Define your edge. Level up your setups.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-emerald-600 dark:bg-primary hover:bg-emerald-700 dark:hover:bg-primary-dim text-white dark:text-background-dark px-6 py-3 rounded-xl font-bold transition-all shadow-sm dark:shadow-neon transform hover:scale-105 active:scale-95"
        >
          <Plus size={20} className="stroke-[3px]" />
          Create New Strategy
        </button>
      </div>

      {/* Featured / Hero Stat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Best Performer Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-emerald-900 to-emerald-950 dark:from-[#1a2c38] dark:to-[#12141c] border border-emerald-800 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center group shadow-lg">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target size={180} className="text-white" />
          </div>
          
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
              {/* Decorative Concentric Circles */}
              <div className="size-32 rounded-full border-4 border-white/10 dark:border-indigo-500/10 flex items-center justify-center">
                  <div className="size-20 rounded-full border-4 border-white/20 dark:border-indigo-500/20 flex items-center justify-center">
                      <div className="size-8 rounded-full bg-white/30 dark:bg-indigo-500/30"></div>
                  </div>
              </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
               <Trophy className="text-yellow-400" size={18} />
               <span className="text-emerald-100 dark:text-indigo-200 font-bold tracking-widest text-xs uppercase">Best Performer</span>
            </div>
            <h2 className="text-3xl font-bold text-white font-display mb-2">{bestPerformer?.name || "No Data"}</h2>
            <p className="text-emerald-100/70 dark:text-indigo-200/60 text-sm max-w-md mb-8 leading-relaxed">
              Your highest conviction setup. Consistent profitability and excellent risk management.
            </p>
            <button 
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2 text-white font-bold text-sm bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl w-fit transition-all hover:pl-6 backdrop-blur-md border border-white/5"
            >
              <Play size={16} className="fill-white" /> View Performance
            </button>
          </div>
        </div>

        {/* Time in Market Card */}
        <div className="bg-white dark:bg-[#102216] border border-gray-200 dark:border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-sm">
           <div className="absolute inset-0 bg-emerald-50 dark:bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="size-16 rounded-full bg-emerald-100 dark:bg-primary/10 flex items-center justify-center mb-4 text-emerald-600 dark:text-primary relative z-10 group-hover:scale-110 transition-transform duration-300">
              <Clock size={32} />
           </div>
           <h3 className="text-gray-900 dark:text-white font-bold text-lg font-display relative z-10">Time in Market</h3>
           <p className="text-gray-500 text-xs mb-4 relative z-10">Most active session</p>
           <span className="text-3xl font-mono text-emerald-600 dark:text-primary font-bold relative z-10 dark:drop-shadow-[0_0_8px_rgba(19,236,91,0.5)]">NY AM</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {strategies.map(strategy => (
          <StrategyCard 
            key={strategy.id} 
            strategy={strategy} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
          />
        ))}
        
        {/* Add New Placeholder Card */}
        <button 
          onClick={handleCreate}
          className="group border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-primary hover:border-emerald-300 dark:hover:border-primary/50 hover:bg-emerald-50 dark:hover:bg-primary/5 transition-all min-h-[300px]"
        >
           <div className="size-16 rounded-full bg-gray-50 dark:bg-[#102216] group-hover:bg-emerald-100 dark:group-hover:bg-primary/20 flex items-center justify-center transition-colors border border-gray-200 dark:border-white/5 group-hover:border-emerald-200 dark:group-hover:border-primary/20">
              <Plus size={32} className="group-hover:scale-110 transition-transform" />
           </div>
           <span className="font-bold font-display tracking-wide">Add Strategy</span>
        </button>
      </div>
    </div>
  );
};

export default Strategies;