import React, { useState, useEffect } from 'react';
import { Raffle } from '../types';
import { ArrowLeft, Minus, Plus, ShoppingCart, ShieldCheck, Trophy, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ShareButtons from './ShareButtons';
import CheckoutModal from './CheckoutModal';
import { useAuth } from '../context/AuthContext';

interface DetailViewProps {
  raffle: Raffle;
  onBack: () => void;
}

// Deterministic pseudo-random status for tickets based on index and sold ratio
const isTicketSold = (index: number, ratio: number) => {
   const x = Math.sin(index + 1) * 10000;
   return (x - Math.floor(x)) < ratio;
};

const TicketStatusGrid: React.FC<{ total: number; sold: number }> = ({ total, sold }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const totalPages = Math.ceil(total / itemsPerPage);
  
  const ratio = sold / total;

  const startIndex = (currentPage - 1) * itemsPerPage;
  
  const currentTickets = Array.from({ length: itemsPerPage }, (_, i) => {
    const ticketIndex = startIndex + i;
    if (ticketIndex >= total) return null;
    
    return {
      number: ticketIndex.toString().padStart(4, '0'),
      status: isTicketSold(ticketIndex, ratio) ? 'sold' : 'available'
    };
  }).filter(Boolean) as { number: string; status: 'sold' | 'available' }[];

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors">
       <div className="flex justify-between items-center mb-4">
         <h4 className="font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
            Mapa de Cotas
         </h4>
         <div className="flex gap-4 text-xs font-bold">
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-white dark:bg-gray-800 border border-raio-purple/50 rounded-sm"></div>
                <span className="text-gray-500 dark:text-gray-400">Disponível</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-sm"></div>
                <span className="text-gray-400 dark:text-gray-500">Vendido</span>
            </div>
         </div>
       </div>

       <div className="grid grid-cols-10 gap-1 sm:gap-2 mb-4">
          {currentTickets.map(ticket => (
            <div 
              key={ticket.number}
              className={`aspect-square rounded flex items-center justify-center text-[10px] sm:text-xs font-bold transition-colors select-none ${
                ticket.status === 'sold'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-raio-purple border border-raio-purple/30'
              }`}
              title={`Número ${ticket.number} - ${ticket.status === 'sold' ? 'Vendido' : 'Disponível'}`}
            >
              {ticket.status === 'sold' ? 'X' : ticket.number}
            </div>
          ))}
       </div>
       
       {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-2 border-t border-gray-100 dark:border-gray-700 mt-4">
          <button 
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
            Página {currentPage} de {totalPages}
          </span>
          
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

const DetailView: React.FC<DetailViewProps> = ({ raffle, onBack }) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuth();

  const remainingTickets = raffle.totalTickets - raffle.soldTickets;
  const isSoldOut = remainingTickets === 0;
  const isFinished = raffle.status === 'finished';

  // Ensure quantity doesn't exceed available on mount or update
  useEffect(() => {
    if (remainingTickets === 0) {
      setTicketQuantity(0);
    } else if (ticketQuantity > remainingTickets) {
      setTicketQuantity(remainingTickets);
    }
  }, [remainingTickets]);

  const increment = () => {
    if (ticketQuantity < remainingTickets) {
      setTicketQuantity(prev => prev + 1);
    }
  };

  const decrement = () => {
    setTicketQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) {
      setTicketQuantity(1);
    } else if (val > remainingTickets) {
      setTicketQuantity(remainingTickets);
    } else {
      setTicketQuantity(val);
    }
  };

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const totalCost = ticketQuantity * raffle.price;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-raio-blue dark:hover:text-raio-blue font-bold mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Voltar para Rifas
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Image & Details */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-[2rem] shadow-lg transition-colors relative">
            <img 
              src={raffle.image} 
              alt={raffle.title} 
              className={`w-full h-80 sm:h-96 object-cover rounded-[1.5rem] ${isSoldOut || isFinished ? 'grayscale' : ''}`}
            />
            {isFinished && (
               <div className="absolute inset-0 bg-black/60 rounded-[1.5rem] flex items-center justify-center">
                 <span className="text-white text-4xl font-display font-bold uppercase border-4 border-white p-4 -rotate-12">Encerrado</span>
               </div>
            )}
            {isSoldOut && !isFinished && (
               <div className="absolute inset-0 bg-black/60 rounded-[1.5rem] flex items-center justify-center">
                 <span className="text-raio-yellow text-4xl font-display font-bold uppercase border-4 border-raio-yellow p-4 -rotate-12">Esgotado</span>
               </div>
            )}
          </div>
          
          <div className="bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 rounded-2xl p-6 transition-colors">
            <h3 className="font-display font-bold text-xl text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
              <Trophy className="text-raio-yellow" />
              Descrição do Prêmio
            </h3>
            <p className="text-blue-900/80 dark:text-gray-300 leading-relaxed">
              {raffle.description}
            </p>
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-gray-700 text-xs text-blue-800/60 dark:text-gray-500">
              <p>Este sorteio é regulamentado pela Lei Federal nº 5.768/71.</p>
              <p>Certificado de Autorização SEAE/ME nº {raffle.authCode}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Purchase Action */}
        <div className="space-y-6">
          <div>
            <span className="inline-block bg-raio-purple/10 dark:bg-raio-purple/20 text-raio-purple font-bold px-3 py-1 rounded-full text-sm mb-2">
              {raffle.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-800 dark:text-white mb-2 transition-colors">
              {raffle.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Sorteio pela Loteria Federal no dia <span className="text-raio-blue">{new Date(raffle.drawDate).toLocaleDateString('pt-BR')}</span>
            </p>
            <p className="mt-2 text-sm font-bold text-raio-blue">
              Restam apenas {remainingTickets} cotas!
            </p>
          </div>

          {!isSoldOut && !isFinished ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 dark:text-gray-400 font-bold">Preço por cota</span>
                <span className="text-3xl font-display font-bold text-raio-blue">
                  R$ {raffle.price.toFixed(2)}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-6 transition-colors">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Quantos números da sorte você quer?
                </label>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button 
                    onClick={decrement}
                    disabled={ticketQuantity <= 1}
                    className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-raio-blue dark:hover:border-raio-blue hover:text-raio-blue transition-colors disabled:opacity-50"
                  >
                    <Minus size={20} />
                  </button>
                  <input 
                    type="number"
                    value={ticketQuantity}
                    onChange={handleQuantityChange}
                    className="w-20 text-center font-display font-bold text-2xl text-gray-800 dark:text-white bg-transparent outline-none border-b-2 border-gray-200 focus:border-raio-blue [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button 
                    onClick={increment}
                    disabled={ticketQuantity >= remainingTickets}
                    className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-raio-blue dark:hover:border-raio-blue hover:text-raio-blue transition-colors disabled:opacity-50"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {[5, 10, 20, 50].map(qty => (
                    qty <= remainingTickets && (
                      <button
                        key={qty}
                        onClick={() => setTicketQuantity(prev => Math.min(prev + qty, remainingTickets))}
                        className="px-3 py-1 rounded-lg text-xs font-bold transition-all bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-raio-blue dark:hover:border-raio-blue active:scale-95"
                      >
                        +{qty}
                      </button>
                    )
                  ))}
                  {remainingTickets > 0 && remainingTickets < 10 && (
                     <button
                      onClick={() => setTicketQuantity(remainingTickets)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-raio-yellow text-gray-800 hover:bg-yellow-400 shadow-sm animate-pulse"
                    >
                      Comprar Restantes ({remainingTickets})
                    </button>
                  )}
                </div>
              </div>

              {/* Total & Button */}
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-gray-100 dark:border-gray-700 pb-4 transition-colors">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Total a pagar</span>
                  <span className="text-4xl font-display font-bold text-gray-800 dark:text-white">
                    R$ {totalCost.toFixed(2)}
                  </span>
                </div>
                
                <button 
                  onClick={handleBuyClick}
                  className="w-full bg-raio-green hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  <ShoppingCart size={24} />
                  Comprar Números
                </button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                  <ShieldCheck size={14} />
                  <span>Pagamento 100% Seguro via PIX ou Cartão</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 text-center border-2 border-gray-200 dark:border-gray-700">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">
                {isFinished ? 'Sorteio Encerrado' : 'Cotas Esgotadas'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isFinished 
                  ? 'Este sorteio já foi realizado. Confira a página de ganhadores.' 
                  : 'Infelizmente todas as cotas foram vendidas. Fique atento às próximas rifas!'}
              </p>
            </div>
          )}
          
          {/* Social Sharing */}
          <ShareButtons title={raffle.title} url={window.location.href} />

          {/* Paginated Ticket Grid */}
          <TicketStatusGrid total={raffle.totalTickets} sold={raffle.soldTickets} />
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        raffle={raffle}
        quantity={ticketQuantity}
        total={totalCost}
      />
    </div>
  );
};

export default DetailView;