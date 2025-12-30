import React from 'react';
import { Raffle } from '../types';
import { Ticket, Calendar, Zap } from 'lucide-react';

interface RaffleCardProps {
  raffle: Raffle;
  onClick: (id: string) => void;
}

const RaffleCard: React.FC<RaffleCardProps> = ({ raffle, onClick }) => {
  const percentage = Math.round((raffle.soldTickets / raffle.totalTickets) * 100);
  const isFinished = raffle.status === 'finished';
  const isSoldOut = raffle.soldTickets >= raffle.totalTickets;
  const hasInstantPrizes = raffle.instantWinNumbers && raffle.instantWinNumbers.length > 0;

  return (
    <div 
      onClick={() => onClick(raffle.id)}
      className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border-2 border-transparent hover:border-raio-blue dark:hover:border-raio-blue hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={raffle.image} 
          alt={raffle.title} 
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isFinished || isSoldOut ? 'grayscale' : ''}`}
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 dark:text-white shadow-sm flex items-center gap-1">
          <Ticket size={14} className="text-raio-purple" />
          R$ {raffle.price.toFixed(2)}/cota
        </div>
        
        {hasInstantPrizes && !isFinished && !isSoldOut && (
          <div className="absolute bottom-3 left-3 bg-raio-yellow text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 animate-pulse">
            <Zap size={14} className="fill-current" />
            <span>Prêmios Instantâneos</span>
          </div>
        )}

        {raffle.status === 'coming_soon' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-raio-yellow text-gray-900 px-4 py-2 rounded-xl font-bold font-display -rotate-6 transform shadow-lg">Em Breve</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <span className="text-xs font-bold text-raio-purple uppercase tracking-wider mb-1 block">
          {raffle.category}
        </span>
        <h3 className="text-xl font-display font-bold text-gray-800 dark:text-white leading-tight mb-2 line-clamp-2 transition-colors">
          {raffle.title}
        </h3>
        
        <div className="mt-auto">
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold transition-colors">
              <span>Progresso</span>
              <span>{Math.min(percentage, 100)}%</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden transition-colors">
              <div 
                className="h-full bg-gradient-to-r from-raio-blue to-teal-300 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm border-t border-gray-100 dark:border-gray-700 pt-3 transition-colors">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
              <Calendar size={16} />
              <span>Sorteio: {new Date(raffle.drawDate).toLocaleDateString('pt-BR')}</span>
            </div>
            
            {isFinished ? (
              <span className="text-gray-400 dark:text-gray-500 font-bold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">Encerrado</span>
            ) : isSoldOut ? (
              <span className="text-yellow-600 dark:text-yellow-400 font-bold bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-lg">Esgotado</span>
            ) : (
              <button className="bg-raio-green hover:bg-green-700 text-white px-4 py-1.5 rounded-lg font-bold transition-colors text-sm shadow-md">
                Participar
              </button>
            )}
          </div>
          
          <div className="mt-2 text-[10px] text-gray-400 dark:text-gray-600 text-center transition-colors">
             Aut. {raffle.authCode}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaffleCard;