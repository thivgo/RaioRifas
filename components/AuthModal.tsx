import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Lock, LogIn, Phone, FileText } from 'lucide-react';

const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', cpf: '', phone: '' });

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = login(formData.email, formData.password);
      if (success) {
        closeAuthModal();
      } else {
        alert('Credenciais inválidas. Tente admin/admin ou crie uma conta.');
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.cpf || !formData.phone) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      register(formData.name, formData.email, formData.password, formData.cpf, formData.phone);
      closeAuthModal();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="font-display font-bold text-2xl text-gray-800 dark:text-white mb-2">
              {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isLogin ? 'Entre para gerenciar suas rifas' : 'Preencha os dados para participar'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Nome Completo"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-raio-blue transition-colors dark:text-white"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="CPF (000.000.000-00)"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-raio-blue transition-colors dark:text-white"
                    value={formData.cpf}
                    onChange={e => setFormData({...formData, cpf: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Telefone / WhatsApp"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-raio-blue transition-colors dark:text-white"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="E-mail"
                required
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-raio-blue transition-colors dark:text-white"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="Senha"
                required
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-raio-blue transition-colors dark:text-white"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-raio-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-6"
            >
              <LogIn size={20} />
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-500 dark:text-gray-400">
              {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-raio-purple font-bold ml-1 hover:underline"
              >
                {isLogin ? 'Cadastre-se' : 'Faça Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;