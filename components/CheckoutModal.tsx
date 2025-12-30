import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, CreditCard, Banknote, QrCode, CheckCircle, Loader2, Zap, Gift } from 'lucide-react';
import { Raffle, PaymentMethod, UserData } from '../types';
import { useAuth } from '../context/AuthContext';
import { useRaffles } from '../context/RaffleContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffle: Raffle;
  quantity: number;
  total: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, raffle, quantity, total }) => {
  const navigate = useNavigate();
  const { user, addPurchase } = useAuth();
  const { updateRaffle } = useRaffles();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Info, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [loading, setLoading] = useState(false);
  const [generatedNumbers, setGeneratedNumbers] = useState<string[]>([]);
  const [instantWins, setInstantWins] = useState<string[]>([]);
  
  const [userData, setUserData] = useState<Partial<UserData>>({
    name: '',
    email: '',
    cpf: '',
    phone: ''
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPaymentMethod('pix');
      setGeneratedNumbers([]);
      setInstantWins([]);
      setLoading(false);
      
      if (user) {
        setUserData({
          name: user.name || '',
          email: user.email || '',
          cpf: user.cpf || '',
          phone: user.phone || ''
        });
      } else {
         setUserData({
          name: '',
          email: '',
          cpf: '',
          phone: ''
        });
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!userData.name || !userData.email || !userData.cpf || !userData.phone) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Generate mock tickets (make sure they are padded correctly)
        const totalTickets = raffle.totalTickets || 10000;
        const newNumbers = Array.from({length: quantity}).map(() => 
          Math.floor(Math.random() * totalTickets).toString().padStart(4, '0')
        );
        setGeneratedNumbers(newNumbers);

        // Check for Instant Wins
        const wins = newNumbers.filter(num => raffle.instantWinNumbers?.includes(num));
        setInstantWins(wins);

        // Update Global State
        if (user) {
            addPurchase({
                id: Math.random().toString(36).substr(2, 9),
                raffleId: raffle.id,
                raffleTitle: raffle.title,
                quantity: quantity,
                totalPrice: total,
                date: new Date().toISOString(),
                ticketNumbers: newNumbers
            });

            // Update Raffle Stock and Sold Numbers
            const currentSoldNumbers = raffle.soldNumbers || [];
            updateRaffle(raffle.id, {
                soldTickets: raffle.soldTickets + quantity,
                soldNumbers: [...currentSoldNumbers, ...newNumbers]
            });
        }

        setLoading(false);
        setStep(3);
      }, 2000);
    }
  };

  const handleFinish = () => {
      onClose();
      navigate('/profile');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-colors">
        
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center transition-colors">
          <div className="flex items-center gap-2">
            <Lock className="text-green-500" size={18} />
            <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">Pagamento Seguro 256-bit SSL</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-gray-800 dark:text-gray-200">
          
          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-raio-blue text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>1</div>
               <div className={`w-12 h-1 ${step >= 2 ? 'bg-raio-blue' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-raio-blue text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>2</div>
               <div className={`w-12 h-1 ${step >= 3 ? 'bg-raio-blue' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-raio-blue text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>3</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
             {/* Order Summary (Visible on Desktop) */}
             <div className="hidden sm:block w-1/3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl h-fit transition-colors">
                <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3">Resumo</h4>
                <div className="text-sm space-y-2 mb-4 text-gray-600 dark:text-gray-300">
                  <p className="line-clamp-2">{raffle.title}</p>
                  <div className="flex justify-between">
                    <span>Qtd:</span>
                    <span className="font-bold">{quantity}x</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-700 dark:text-gray-200">Total:</span>
                  <span className="font-bold text-xl text-raio-blue">R$ {total.toFixed(2)}</span>
                </div>
             </div>

             {/* Steps Content */}
             <div className="flex-1">
                {step === 1 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <h3 className="font-display font-bold text-xl text-gray-800 dark:text-white mb-2">Confirme seus Dados</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Dados da conta conectada.</p>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                      <input 
                        name="name" value={userData.name} onChange={handleInputChange}
                        className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-raio-blue outline-none transition-colors" placeholder="Ex: João Silva" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">CPF</label>
                      <input 
                        name="cpf" 
                        value={userData.cpf} 
                        onChange={handleInputChange}
                        readOnly={!!user?.cpf}
                        className={`w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-raio-blue outline-none transition-colors ${user?.cpf ? 'opacity-70 cursor-not-allowed text-gray-500' : ''}`} 
                        placeholder="000.000.000-00" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input 
                          name="email" value={userData.email} onChange={handleInputChange}
                          className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-raio-blue outline-none transition-colors" placeholder="joao@email.com" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                        <input 
                          name="phone" value={userData.phone} onChange={handleInputChange}
                          className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-raio-blue outline-none transition-colors" placeholder="(11) 99999-9999" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    <h3 className="font-display font-bold text-xl text-gray-800 dark:text-white mb-4">Pagamento</h3>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <button 
                        onClick={() => setPaymentMethod('pix')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'pix' ? 'border-raio-blue bg-blue-50 dark:bg-blue-900/30 text-raio-blue' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-400'}`}
                      >
                        <QrCode size={24} />
                        <span className="text-xs font-bold">PIX</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'credit_card' ? 'border-raio-blue bg-blue-50 dark:bg-blue-900/30 text-raio-blue' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-400'}`}
                      >
                        <CreditCard size={24} />
                        <span className="text-xs font-bold">Cartão</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('boleto')}
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'boleto' ? 'border-raio-blue bg-blue-50 dark:bg-blue-900/30 text-raio-blue' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-400'}`}
                      >
                        <Banknote size={24} />
                        <span className="text-xs font-bold">Boleto</span>
                      </button>
                    </div>

                    {paymentMethod === 'pix' && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                        <p className="text-sm text-green-800 dark:text-green-400 font-bold mb-2">Liberação Imediata!</p>
                        <p className="text-xs text-green-700 dark:text-green-500">O QR Code será gerado na próxima tela.</p>
                      </div>
                    )}
                    
                    {paymentMethod === 'credit_card' && (
                      <div className="space-y-3">
                         <input className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-sm" placeholder="Número do Cartão" />
                         <div className="grid grid-cols-2 gap-3">
                           <input className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-sm" placeholder="MM/AA" />
                           <input className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-sm" placeholder="CVV" />
                         </div>
                         <input className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-sm" placeholder="Nome Impresso no Cartão" />
                      </div>
                    )}

                    {paymentMethod === 'boleto' && (
                       <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
                        <p className="text-sm text-yellow-800 dark:text-yellow-400 font-bold mb-2">Até 3 dias úteis</p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-500">O boleto será enviado para seu e-mail.</p>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="flex flex-col items-center text-center animate-in zoom-in duration-300 py-4">
                    
                    {/* Instant Win Celebration */}
                    {instantWins.length > 0 ? (
                      <div className="w-full bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-6 mb-6 border-2 border-yellow-400 animate-pulse relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                           <Zap size={100} className="text-yellow-500" />
                        </div>
                        <Gift size={48} className="text-orange-500 mx-auto mb-2" />
                        <h3 className="font-display font-bold text-2xl text-orange-600 dark:text-orange-400 mb-1">PARABÉNS! VOCÊ GANHOU!</h3>
                        <p className="text-gray-700 dark:text-gray-200 mb-2 font-bold">Você encontrou {instantWins.length} cota(s) premiada(s)!</p>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl inline-block shadow-sm">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Prêmio</p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">{raffle.instantPrizeText || 'Prêmio Surpresa'}</p>
                        </div>
                        <div className="mt-3 flex justify-center gap-2">
                          {instantWins.map(n => (
                            <span key={n} className="bg-orange-500 text-white font-bold px-3 py-1 rounded-full shadow-sm text-sm">Cota #{n}</span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Nossa equipe entrará em contato pelo WhatsApp cadastrado.</p>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-4">
                        <CheckCircle size={48} />
                      </div>
                    )}

                    <h3 className="font-display font-bold text-2xl text-gray-800 dark:text-white mb-2">Compra Confirmada!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
                      Seus números da sorte foram reservados. Enviamos os detalhes para <strong>{userData.email}</strong>.
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 w-full mb-6 p-4">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Seus Números</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {generatedNumbers.map((num, i) => (
                          <span key={i} className={`text-xs font-bold px-2 py-1 rounded ${instantWins.includes(num) ? 'bg-yellow-400 text-black ring-2 ring-yellow-200' : 'bg-raio-purple text-white'}`}>
                            {num} {instantWins.includes(num) && '🏆'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end transition-colors">
           {step < 3 ? (
             <button 
              onClick={handleNext} 
              disabled={loading}
              className="bg-raio-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70"
            >
               {loading && <Loader2 className="animate-spin" size={20} />}
               {step === 1 ? 'Continuar para Pagamento' : 'Finalizar Compra'}
             </button>
           ) : (
             <button 
              onClick={handleFinish}
              className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all"
            >
               Ir para Meus Números
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;