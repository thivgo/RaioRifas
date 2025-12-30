import React from 'react';
import { Share2, Facebook, Phone, Instagram, Copy } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const encodedText = encodeURIComponent(`Olha que incrível essa rifa da RaioRifas! ⚡ ${title}`);
  const encodedUrl = encodeURIComponent(url);

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'instagram' | 'copy') => {
    let link = '';
    switch (platform) {
      case 'whatsapp':
        link = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        window.open(link, '_blank');
        break;
      case 'facebook':
        link = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        window.open(link, '_blank');
        break;
      case 'instagram':
        // Instagram não suporta link direto via web, copiamos e abrimos o site
        navigator.clipboard.writeText(`${decodeURIComponent(encodedText)} ${url}`);
        alert('Link copiado! Abra o Instagram e cole no seu Story ou Direct.');
        window.open('https://www.instagram.com/', '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${decodeURIComponent(encodedText)} ${url}`);
        alert('Link copiado para a área de transferência!');
        break;
    }
  };

  const buttonBaseClass = "flex items-center justify-center gap-1.5 w-full py-3 px-2 rounded-lg font-bold text-sm shadow-sm hover:opacity-90 transition-all hover:-translate-y-0.5 whitespace-nowrap";

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 mt-6 transition-colors">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold text-sm">
        <Share2 size={20} />
        <span>Compartilhe com amigos</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button 
          onClick={() => handleShare('whatsapp')}
          className={`${buttonBaseClass} bg-[#25D366] text-white`}
          title="Compartilhar no WhatsApp"
        >
          <Phone size={20} className="shrink-0" /> 
          <span>WhatsApp</span>
        </button>
        <button 
          onClick={() => handleShare('facebook')}
          className={`${buttonBaseClass} bg-[#1877F2] text-white`}
          title="Compartilhar no Facebook"
        >
          <Facebook size={20} className="shrink-0" /> 
          <span>Facebook</span>
        </button>
        <button 
          onClick={() => handleShare('instagram')}
          className={`${buttonBaseClass} bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white`}
          title="Copiar link para Instagram"
        >
          <Instagram size={20} className="shrink-0" /> 
          <span>Instagram</span>
        </button>
        <button 
          onClick={() => handleShare('copy')}
          className={`${buttonBaseClass} bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500`}
          title="Copiar Link"
        >
          <Copy size={20} className="shrink-0" /> 
          <span>Copiar</span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;