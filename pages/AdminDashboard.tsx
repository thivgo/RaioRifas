import React, { useState, useEffect } from 'react';
import { useRaffles } from '../context/RaffleContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Zap, RefreshCw, Check, Lock, AlertTriangle, X } from 'lucide-react';
import { Raffle } from '../types';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { raffles, addRaffle, updateRaffle, deleteRaffle } = useRaffles();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentRaffle, setCurrentRaffle] = useState<Partial<Raffle>>({});
  const [instantWinCount, setInstantWinCount] = useState<number>(0);
  const [showForm, setShowForm] = useState(false);
  
  // Estado para controlar o modal de confirmação de exclusão
  const [raffleToDelete, setRaffleToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleEdit = (raffle: Raffle) => {
    setCurrentRaffle(raffle);
    setInstantWinCount(raffle.instantWinNumbers?.length || 0);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleRequestDelete = (raffle: Raffle) => {
    if (raffle.soldTickets > 0) {
      alert('Não é possível excluir uma rifa que já possui cotas vendidas. Para encerrá-la, altere o status para "Encerrada" ou "Esgotada".');
      return;
    }
    setRaffleToDelete(raffle.id);
  };

  const confirmDelete = () => {
    if (raffleToDelete) {
      deleteRaffle(raffleToDelete);
      setRaffleToDelete(null);
    }
  };

  const cancelDelete = () => {
    setRaffleToDelete(null);
  };

  const handleAddNew = () => {
    setCurrentRaffle({
      id: Math.random().toString(36).substr(2, 9),
      status: 'active',
      soldTickets: 0,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop', // Default image (iPhone)
      category: 'Eletrônicos',
      authCode: 'SEAE/ME 00.0000/2024',
      instantWinNumbers: [],
      instantPrizeText: '',
      soldNumbers: []
    });
    setInstantWinCount(0);
    setIsEditing(false);
    setShowForm(true);
  };

  const generateInstantNumbers = (targetCount: number, totalTickets: number, existingNumbers: string[] = []): string[] => {
    // Inicializa o Set com os números já existentes para PRESERVAR os antigos
    const numbers = new Set<string>(existingNumbers);
    
    // Trava de segurança para não tentar criar mais números do que o total de tickets
    const safeCount = Math.min(targetCount, totalTickets);
    
    // Enquanto não atingir a quantidade desejada, adiciona novos aleatórios
    while (numbers.size < safeCount) {
      const num = Math.floor(Math.random() * totalTickets).toString().padStart(4, '0');
      numbers.add(num);
    }
    
    // Converte para array. Se o novo count for MENOR que o existente, o slice resolve removendo o excedente.
    return Array.from(numbers).slice(0, safeCount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let raffleToSave = { ...currentRaffle };

    // Logic to update instant win numbers if count changed
    const currentInstantCount = raffleToSave.instantWinNumbers?.length || 0;
    
    // Only regenerate/update if the count requested is different from what we have
    if (instantWinCount !== currentInstantCount) {
       const total = Number(raffleToSave.totalTickets) || 1000;
       const existingNumbers = raffleToSave.instantWinNumbers || [];
       
       // Passa os números existentes para a função
       raffleToSave.instantWinNumbers = generateInstantNumbers(instantWinCount, total, existingNumbers);
    }

    // Ensure soldNumbers is initialized
    if (!raffleToSave.soldNumbers) {
      raffleToSave.soldNumbers = [];
    }

    if (isEditing && raffleToSave.id) {
      updateRaffle(raffleToSave.id, raffleToSave);
    } else {
      addRaffle(raffleToSave as Raffle);
    }
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setCurrentRaffle({ ...currentRaffle, [e.target.name]: val });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Modal de Confirmação de Exclusão */}
      {raffleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-gray-700 transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Excluir Rifa?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Esta ação não pode ser desfeita. Todos os dados desta rifa serão perdidos permanentemente.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={cancelDelete}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/30 transition-colors"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-800 dark:text-white">Painel Administrativo</h1>
          <p className="text-gray-500 dark:text-gray-400">Gerencie rifas, vendas e configurações.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-raio-purple text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-violet-700 transition-colors"
        >
          <Plus size={20} /> Nova Rifa
        </button>
      </div>

      {showForm ? (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-4 transition-colors">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white border-b dark:border-gray-700 pb-2">{isEditing ? 'Editar Rifa' : 'Criar Nova Rifa'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Título do Prêmio</label>
              <input required name="title" value={currentRaffle.title || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg p-3 outline-none focus:border-raio-blue transition-colors" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
              <textarea required name="description" value={currentRaffle.description || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg p-3 outline-none focus:border-raio-blue h-24 transition-colors" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Preço da Cota (R$)</label>
              <input required type="number" step="0.01" name="price" value={currentRaffle.price || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg p-3 outline-none focus:border-raio-blue transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Total de Cotas</label>
              <input required type="number" name="totalTickets" value={currentRaffle.totalTickets || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg p-3 outline-none focus:border-raio-blue transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Data do Sorteio</label>
              <input required type="date" name="drawDate" value={currentRaffle.drawDate || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg p-3 outline-none focus:border-raio-blue transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
              <select name="category" value={currentRaffle.category || 'Eletrônicos'} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg p-3 outline-none focus:border-raio-blue transition-colors">
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Veículos">Veículos</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Status da Rifa</label>
              <select name="status" value={currentRaffle.status || 'active'} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg p-3 outline-none focus:border-raio-blue transition-colors">
                <option value="active">Ativa (Vendas Abertas)</option>
                <option value="finished">Encerrada (Sorteio Realizado)</option>
                <option value="coming_soon">Em Breve</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">URL da Imagem</label>
              <input required name="image" value={currentRaffle.image || ''} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg p-3 outline-none focus:border-raio-blue transition-colors" placeholder="https://..." />
            </div>

            {/* Instant Win Configuration */}
            <div className="col-span-2 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
               <div className="flex items-center gap-2 mb-4 text-yellow-800 dark:text-yellow-400 font-bold">
                 <Zap size={20} />
                 <h3>Configuração de Cotas Premiadas</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Quantidade de Prêmios</label>
                    <input 
                      type="number" 
                      min="0"
                      value={instantWinCount} 
                      onChange={(e) => setInstantWinCount(parseInt(e.target.value) || 0)} 
                      className="w-full bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg p-3 outline-none focus:border-raio-blue transition-colors" 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {instantWinCount > (currentRaffle.instantWinNumbers?.length || 0) 
                        ? `Adicionará ${instantWinCount - (currentRaffle.instantWinNumbers?.length || 0)} novos números.` 
                        : 'Números existentes serão mantidos.'}
                    </p>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Descrição do Prêmio</label>
                    <input 
                      name="instantPrizeText"
                      value={currentRaffle.instantPrizeText || ''} 
                      onChange={handleChange} 
                      placeholder="Ex: R$ 50,00 no PIX"
                      className="w-full bg-white dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg p-3 outline-none focus:border-raio-blue transition-colors" 
                    />
                 </div>
                 {currentRaffle.instantWinNumbers && currentRaffle.instantWinNumbers.length > 0 && (
                   <div className="col-span-2 mt-2">
                     <p className="text-xs font-bold text-gray-500 mb-2">Números Sorteados Atuais:</p>
                     <div className="flex flex-wrap gap-2">
                       {currentRaffle.instantWinNumbers.map(n => (
                         <span key={n} className="bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded font-mono font-bold">{n}</span>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
            </div>

             <div className="col-span-2 flex justify-end gap-3 mt-4">
               <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-lg text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
               <button type="submit" className="bg-raio-blue text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-blue-600">Salvar</button>
             </div>
          </form>
        </div>
      ) : null}

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-bold text-sm uppercase transition-colors">
              <tr>
                <th className="p-4">Rifa</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Vendas</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {raffles.map(raffle => {
                const percentage = (raffle.soldTickets / raffle.totalTickets) * 100;
                const isSoldOut = raffle.soldTickets >= raffle.totalTickets;
                const hasInstant = raffle.instantWinNumbers && raffle.instantWinNumbers.length > 0;
                const hasSales = raffle.soldTickets > 0;
                
                return (
                <tr key={raffle.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <img src={raffle.image} className="w-12 h-12 rounded-lg object-cover bg-gray-200 dark:bg-gray-700 shrink-0" alt="" />
                      <div>
                        <div className="font-bold text-gray-800 dark:text-white line-clamp-1 w-48 transition-colors">{raffle.title}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">{raffle.authCode}</div>
                        
                        {/* Instant Win Status Section */}
                        {hasInstant && (
                          <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded-lg border border-yellow-100 dark:border-yellow-900/30 w-fit">
                            <div className="flex items-center gap-1 text-[10px] text-yellow-800 dark:text-yellow-400 font-bold mb-1">
                              <Zap size={10} fill="currentColor" />
                              <span>Prêmios Instantâneos:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {raffle.instantWinNumbers.map(num => {
                                const isFound = raffle.soldNumbers?.includes(num);
                                return (
                                  <span 
                                    key={num} 
                                    className={`text-[10px] px-1.5 py-0.5 rounded border font-mono font-bold flex items-center gap-1 ${
                                      isFound 
                                        ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' 
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600'
                                    }`}
                                    title={isFound ? 'Encontrado!' : 'Ainda disponível'}
                                  >
                                    {num}
                                    {isFound ? <Check size={8} /> : <Lock size={8} />}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-600 dark:text-gray-300">R$ {raffle.price.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 w-32">
                      <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
                        <span>{raffle.soldTickets} / {raffle.totalTickets}</span>
                        <span>{Math.round(percentage)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                         <div className="h-full bg-raio-blue rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      raffle.status === 'finished' ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400' :
                      isSoldOut ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400' :
                      raffle.status === 'active' ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' :
                      'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                    }`}>
                      {raffle.status === 'finished' ? 'Encerrada' : isSoldOut ? 'Esgotada' : raffle.status === 'active' ? 'Ativa' : 'Em Breve'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button type="button" onClick={() => handleEdit(raffle)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"><Edit2 size={18} /></button>
                       <button 
                        type="button" 
                        onClick={() => handleRequestDelete(raffle)} 
                        disabled={hasSales}
                        title={hasSales ? "Não é possível excluir rifas com vendas" : "Excluir Rifa"}
                        className={`p-2 rounded-lg transition-colors ${hasSales ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30'}`}
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;