import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRaffles } from '../context/RaffleContext';
import { Ticket, ShoppingBag, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface TicketPaginationProps {
  tickets: string[];
  instantWinNumbers?: string[];
}

const TicketPagination: React.FC<TicketPaginationProps> = ({ tickets, instantWinNumbers = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTickets = tickets.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {currentTickets.map(num => {
          const isWinner = instantWinNumbers.includes(num);
          return (
            <span 
              key={num} 
              className={`px-3 py-1 rounded-lg font-bold text-sm shadow-sm flex items-center gap-1 transition-transform ${
                isWinner 
                  ? 'bg-yellow-400 text-black ring-2 ring-yellow-200 scale-110 z-10' 
                  : 'bg-raio-purple text-white'
              }`}
              title={isWinner ? 'Cota Premiada!' : 'Minha Cota'}
            >
              {num} {isWinner && '🏆'}
            </span>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-2 border-t border-gray-100 dark:border-gray-800 mt-4">
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

const UserProfile: React.FC = () => {
  const { user, purchases } = useAuth();
  const { getRaffleById } = useRaffles();

  if (!user) {
    return <div className="p-8 text-center text-gray-500">Você precisa estar logado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-raio-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Olá, {user.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
           <ShoppingBag className="text-raio-purple" />
           <h2 className="text-xl font-bold text-gray-800 dark:text-white">Minhas Rifas</h2>
        </div>

        {purchases.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            Você ainda não comprou nenhuma cota. Que tal escolher seu prêmio?
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {purchases.map(purchase => {
              const raffle = getRaffleById(purchase.raffleId);
              const instantWinNumbers = raffle?.instantWinNumbers || [];
              const hasWin = purchase.ticketNumbers.some(num => instantWinNumbers.includes(num));

              return (
                <div key={purchase.id} className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${hasWin ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}>
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                        {purchase.raffleTitle}
                        {hasWin && <span className="bg-yellow-400 text-black text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Zap size={10} fill="currentColor" /> PREMIADA</span>}
                      </h3>
                      <p className="text-xs text-gray-400">{new Date(purchase.date).toLocaleDateString()} • {purchase.quantity} cotas</p>
                    </div>
                    <div className="mt-2 md:mt-0 font-bold text-raio-blue">
                      R$ {purchase.totalPrice.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                      <Ticket size={12} /> Seus Números da Sorte ({purchase.ticketNumbers.length})
                    </div>
                    
                    <TicketPagination 
                      tickets={purchase.ticketNumbers} 
                      instantWinNumbers={instantWinNumbers}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;