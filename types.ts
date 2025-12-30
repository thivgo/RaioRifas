export interface Raffle {
  id: string;
  title: string;
  description: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  image: string;
  drawDate: string;
  authCode: string; // Código de autorização SEAE/ME
  category: 'Veículos' | 'Eletrônicos' | 'Dinheiro';
  status: 'active' | 'finished' | 'coming_soon';
  instantWinNumbers: string[]; // Lista de números que dão prêmio na hora
  instantPrizeText?: string; // Descrição do prêmio (ex: R$ 50 no PIX)
  soldNumbers: string[]; // Lista de TODOS os números já vendidos desta rifa
}

export interface Ticket {
  number: number;
  status: 'available' | 'reserved' | 'sold';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';

export interface UserData {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  role: 'user' | 'admin';
}

export interface Purchase {
  id: string;
  raffleId: string;
  raffleTitle: string;
  quantity: number;
  totalPrice: number;
  date: string;
  ticketNumbers: string[];
}