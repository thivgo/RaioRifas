import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Raffle } from '../types';
import { MOCK_RAFFLES } from '../constants';

interface RaffleContextType {
  raffles: Raffle[];
  addRaffle: (raffle: Raffle) => void;
  updateRaffle: (id: string, updates: Partial<Raffle>) => void;
  deleteRaffle: (id: string) => void;
  getRaffleById: (id: string) => Raffle | undefined;
}

const RaffleContext = createContext<RaffleContextType | undefined>(undefined);

export const RaffleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [raffles, setRaffles] = useState<Raffle[]>(() => {
    // Tenta carregar do localStorage ao iniciar
    const saved = localStorage.getItem('raffles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar rifas:', e);
        return MOCK_RAFFLES;
      }
    }
    return MOCK_RAFFLES;
  });

  // Salva no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('raffles', JSON.stringify(raffles));
  }, [raffles]);

  const addRaffle = (raffle: Raffle) => {
    setRaffles(prev => [...prev, raffle]);
  };

  const updateRaffle = (id: string, updates: Partial<Raffle>) => {
    setRaffles(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRaffle = (id: string) => {
    setRaffles(prev => prev.filter(r => r.id !== id));
  };

  const getRaffleById = (id: string) => {
    return raffles.find(r => r.id === id);
  };

  return (
    <RaffleContext.Provider value={{ raffles, addRaffle, updateRaffle, deleteRaffle, getRaffleById }}>
      {children}
    </RaffleContext.Provider>
  );
};

export const useRaffles = () => {
  const context = useContext(RaffleContext);
  if (!context) {
    throw new Error('useRaffles must be used within a RaffleProvider');
  }
  return context;
};