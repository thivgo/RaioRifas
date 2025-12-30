import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateSupportResponse = async (
  userMessage: string, 
  history: { role: string; text: string }[]
): Promise<string> => {
  if (!apiKey) {
    return "Desculpe, o sistema de chat está indisponível no momento (Chave API não configurada).";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Formatting history for context, though we use a single turn generation for simplicity with context injection
    const contextPrompt = `
      Você é o "Raio", o assistente virtual ágil e inteligente do site "RaioRifas".
      O site vende rifas online de prêmios variados (eletrônicos, motos, dinheiro, carros).
      
      IMPORTANTE - INFORMAÇÕES LEGAIS:
      - Todas as rifas são legalizadas e autorizadas pela SEAE/ME (Secretaria de Acompanhamento Econômico).
      - O sorteio é realizado pela Loteria Federal.
      - É proibida a venda para menores de 18 anos.
      
      TONALIDADE:
      - Fale de forma objetiva, animada e segura. Use emojis moderadamente.
      - Ajude os clientes a entenderem como comprar, dúvidas sobre segurança e detalhes dos sorteios.
      
      Histórico da conversa:
      ${history.map(h => `${h.role}: ${h.text}`).join('\n')}
      
      Usuário: ${userMessage}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: contextPrompt,
    });

    return response.text || "Ops! Tive um pequeno problema para pensar na resposta. Pode tentar de novo?";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Estou com dificuldades técnicas no momento. Por favor, verifique a página de 'Como Funciona'.";
  }
};