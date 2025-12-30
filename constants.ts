import { Raffle } from './types';

export const MOCK_RAFFLES: Raffle[] = [
  {
    id: '1',
    title: 'PlayStation 5 + God of War Ragnarök',
    description: 'O console mais desejado do momento! Gráficos incríveis em 4K, SSD ultrarrápido e controle tátil imersivo.',
    price: 0.50,
    totalTickets: 10000,
    soldTickets: 8450,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1000&auto=format&fit=crop',
    drawDate: '2024-06-15',
    authCode: 'SEAE/ME 01.1234/2024',
    category: 'Eletrônicos',
    status: 'active',
    instantWinNumbers: ['1234', '5678', '9012'],
    instantPrizeText: 'R$ 100,00 no PIX',
    soldNumbers: ['1234'] // Simulating that 1234 was already found
  },
  {
    id: '2',
    title: 'Honda CG 160 Titan 0km',
    description: 'A moto mais vendida do Brasil. Economia, robustez e design esportivo para o seu dia a dia. Documentação inclusa.',
    price: 1.99,
    totalTickets: 15000,
    soldTickets: 3200,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop',
    drawDate: '2024-06-20',
    authCode: 'SEAE/ME 01.1235/2024',
    category: 'Veículos',
    status: 'active',
    instantWinNumbers: [],
    instantPrizeText: '',
    soldNumbers: []
  },
  {
    id: '3',
    title: 'iPhone 15 Pro Max - 256GB',
    description: 'Titânio aeroespacial, chip A17 Pro e o sistema de câmera mais poderoso em um iPhone.',
    price: 0.35,
    totalTickets: 20000,
    soldTickets: 15980,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
    drawDate: '2024-06-10',
    authCode: 'SEAE/ME 01.1236/2024',
    category: 'Eletrônicos',
    status: 'active',
    instantWinNumbers: [],
    instantPrizeText: '',
    soldNumbers: []
  },
  {
    id: '4',
    title: 'PIX de R$ 5.000,00 na Conta',
    description: 'Dinheiro na mão para você usar como quiser. Pagar contas, viajar ou investir!',
    price: 0.15,
    totalTickets: 50000,
    soldTickets: 4500,
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=1000&auto=format&fit=crop',
    drawDate: '2024-07-01',
    authCode: 'SEAE/ME 01.1237/2024',
    category: 'Dinheiro',
    status: 'coming_soon',
    instantWinNumbers: [],
    instantPrizeText: '',
    soldNumbers: []
  }
];