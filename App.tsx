import React from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { RaffleProvider, useRaffles } from './context/RaffleContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import RaffleCard from './components/RaffleCard';
import SupportChat from './components/SupportChat';
import DetailView from './components/DetailView';
import AdminDashboard from './pages/AdminDashboard';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { Ticket, Shield, Heart, Trophy, Lock, Moon, Sun, User, LogOut, Home, LogIn } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, openAuthModal, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] dark:bg-gray-900 transition-colors duration-300 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors duration-300 border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="bg-gradient-to-br from-raio-blue to-raio-purple p-2 rounded-xl text-white shadow-md transform group-hover:rotate-12 transition-transform">
              <Ticket size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-gray-800 dark:text-white leading-none transition-colors">
                Raio<span className="text-raio-blue">Rifas</span>
              </h1>
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase">Sorteios Rápidos</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-4 md:gap-6 text-sm font-bold text-gray-600 dark:text-gray-300">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-raio-yellow transition-colors"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => navigate('/')} className="hover:text-raio-blue transition-colors">Início</button>
              
              {isAdmin && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-raio-purple dark:hover:text-raio-purple transition-colors"
                >
                  <Lock size={14} /> Admin
                </button>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                   <button 
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 bg-raio-purple text-white px-5 py-2 rounded-full hover:bg-violet-700 transition-colors shadow-md hover:shadow-lg"
                   >
                     <User size={16} />
                     <span className="max-w-[100px] truncate">{user?.name}</span>
                   </button>
                   <button 
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-raio-red transition-colors"
                    title="Sair"
                   >
                     <LogOut size={20} />
                   </button>
                </div>
              ) : (
                <button 
                  onClick={openAuthModal}
                  className="bg-raio-purple text-white px-5 py-2 rounded-full hover:bg-violet-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Entrar / Criar Conta
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 flex justify-around items-center px-2 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-colors">
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl w-16 transition-colors ${isActive('/') ? 'text-raio-blue bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Início</span>
        </button>

        {isAdmin && (
          <button 
            onClick={() => navigate('/admin')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl w-16 transition-colors ${isActive('/admin') ? 'text-raio-purple bg-purple-50 dark:bg-purple-900/20' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <Lock size={24} strokeWidth={isActive('/admin') ? 2.5 : 2} />
            <span className="text-[10px] font-bold mt-1">Admin</span>
          </button>
        )}

        {isAuthenticated ? (
          <button 
            onClick={() => navigate('/profile')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl w-16 transition-colors ${isActive('/profile') ? 'text-raio-purple bg-purple-50 dark:bg-purple-900/20' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <User size={24} strokeWidth={isActive('/profile') ? 2.5 : 2} />
            <span className="text-[10px] font-bold mt-1">Perfil</span>
          </button>
        ) : (
          <button 
            onClick={openAuthModal}
            className="flex flex-col items-center justify-center p-2 rounded-xl w-16 text-gray-400 dark:text-gray-500"
          >
            <LogIn size={24} />
            <span className="text-[10px] font-bold mt-1">Entrar</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-black text-gray-300 py-12 mt-12 transition-colors duration-300 border-t border-gray-700 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <h3 className="font-display font-bold text-2xl text-white mb-4">RaioRifas</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                A plataforma mais rápida e segura para você concorrer a prêmios incríveis. Sorteios auditados.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Ajuda</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Regulamento</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Pagamento</h4>
              <div className="flex gap-2">
                 <div className="bg-gray-700 dark:bg-gray-800 px-3 py-1 rounded text-xs font-bold">PIX</div>
                 <div className="bg-gray-700 dark:bg-gray-800 px-3 py-1 rounded text-xs font-bold">Cartão</div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-gray-700/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-600 dark:border-gray-800">
                <div className="flex items-start gap-3">
                   <Shield className="text-green-400 shrink-0" />
                   <div>
                     <h5 className="font-bold text-white text-sm">Site Seguro</h5>
                     <p className="text-xs text-gray-400 mt-1">Todas as transações são criptografadas.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 dark:border-gray-800 pt-8 text-center text-xs text-gray-500">
            <p className="mb-2">
              <strong>ATENÇÃO:</strong> A venda de rifas é uma atividade regulamentada no Brasil. Este site opera sob autorização da SEAE/ME.
              É proibida a venda para menores de 18 anos.
            </p>
            <p>&copy; 2024 RaioRifas Ltda. CNPJ: 00.000.000/0001-00. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <SupportChat />
      <AuthModal />
    </div>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { raffles } = useRaffles();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-[#F7F9FC] dark:from-gray-800 dark:to-gray-900 pb-12 pt-8 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-raio-yellow/20 dark:bg-raio-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-raio-blue/10 dark:bg-raio-blue/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm mb-6 animate-in fade-in slide-in-from-top-4 duration-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Mais de R$ 250.000,00 em prêmios entregues!
          </span>
          
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-gray-900 dark:text-white mb-6 leading-tight transition-colors">
            Prêmios incríveis ao <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-raio-blue to-raio-purple">
              seu alcance
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed transition-colors">
            Participe de sorteios legalizados de eletrônicos, veículos e prêmios em dinheiro. Segurança e rapidez para toda a família.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm font-bold text-gray-700 dark:text-gray-200">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-5 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <Shield className="text-raio-blue" size={20} />
              <span>100% Legalizado</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-5 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <Trophy className="text-raio-yellow" size={20} />
              <span>Sorteio pela Federal</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-5 py-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
              <Heart className="text-raio-red" size={20} />
              <span>Parte destinada à doação</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-white transition-colors">Rifas em Destaque</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Escolha seu prêmio favorito e boa sorte!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {raffles.filter(r => r.status !== 'finished').map(raffle => (
            <RaffleCard 
              key={raffle.id} 
              raffle={raffle} 
              onClick={(id) => navigate(`/raffle/${id}`)} 
            />
          ))}
        </div>
      </section>
      
      {/* How it works */}
      <section className="bg-white dark:bg-gray-800 py-16 border-y border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-white transition-colors">Como Participar?</h2>
            <p className="text-gray-500 dark:text-gray-400 transition-colors">É muito simples e rápido concorrer.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-blue-50 dark:bg-gray-700 text-raio-blue rounded-2xl flex items-center justify-center mb-4 text-2xl font-bold font-display shadow-sm transition-colors">1</div>
               <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Escolha o Prêmio</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm px-8">Navegue pelas rifas ativas e escolha o prêmio que você mais deseja.</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-yellow-50 dark:bg-gray-700 text-raio-yellow rounded-2xl flex items-center justify-center mb-4 text-2xl font-bold font-display shadow-sm transition-colors">2</div>
               <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Selecione os Números</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm px-8">Escolha seus números da sorte ou deixe o sistema escolher aleatoriamente.</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-green-50 dark:bg-gray-700 text-green-500 rounded-2xl flex items-center justify-center mb-4 text-2xl font-bold font-display shadow-sm transition-colors">3</div>
               <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Aguarde o Sorteio</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm px-8">O sorteio é realizado pela Loteria Federal na data marcada. Boa sorte!</p>
             </div>
          </div>
        </div>
      </section>
    </>
  );
};

const RaffleDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getRaffleById } = useRaffles();
  
  const id = location.pathname.split('/').pop();
  const raffle = id ? getRaffleById(id) : undefined;

  if (!raffle) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Rifa não encontrada</div>;

  return <DetailView raffle={raffle} onBack={() => navigate('/')} />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RaffleProvider>
          <HashRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/raffle/:id" element={<RaffleDetailPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/profile" element={<UserProfile />} />
              </Routes>
            </Layout>
          </HashRouter>
        </RaffleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;