// src/services/subestacaoService.ts
import api from '../services/api';

export const fetchSubestacoes = async () => {
  try {
    const response = await api.get('/Subestacao');  // Supondo que sua API tenha essa rota
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar subestações', error);
    throw error;
  }
};
