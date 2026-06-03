// Camada de PERSISTÊNCIA: salva/lê dados que precisam sobreviver ao fechar o app.
// Esconde os detalhes do AsyncStorage (texto, async) do resto do código.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_THRESHOLDS } from './alerts';

// A "chave" é como o nome de uma gaveta. Por que guardar numa constante?
// Porque uso o mesmo nome pra salvar E pra ler. Se eu digitasse a string nos dois
// lugares e errasse uma letra, salvaria numa gaveta e leria de outra (vazia).
const THRESHOLDS_KEY = '@spa:thresholds';
// Gaveta separada para as preferências da missão (nome do operador, etc.).
const SETTINGS_KEY = '@spa:settings';

// Preferências padrão usadas na primeira vez que o app abre (nada salvo ainda).
export const DEFAULT_SETTINGS = {
  missionName: 'Órion-7',
};

// Salva os limiares. É async porque escrever no disco do celular leva um tempinho.
export async function saveThresholds(thresholds) {
  try {
    // AsyncStorage só guarda texto → converto o objeto em string JSON.
    await AsyncStorage.setItem(THRESHOLDS_KEY, JSON.stringify(thresholds));
  } catch (error) {
    // Se falhar (raro), não quero derrubar o app. Aviso no console e sigo.
    console.warn('Falha ao salvar limiares:', error);
  }
}

// Lê os limiares salvos. Devolve um objeto pronto pra usar.
export async function loadThresholds() {
  try {
    const stored = await AsyncStorage.getItem(THRESHOLDS_KEY);
    // Se 'stored' for null, é a PRIMEIRA vez que o app abre (nada salvo ainda).
    // Nesse caso devolvo os padrões — assim o app sempre tem limiares válidos.
    if (stored === null) return DEFAULT_THRESHOLDS;
    // Tinha algo salvo → desfaço o JSON, voltando a ser objeto.
    return JSON.parse(stored);
  } catch (error) {
    // Se a leitura/parse falhar, caio nos padrões em vez de quebrar.
    console.warn('Falha ao carregar limiares:', error);
    return DEFAULT_THRESHOLDS;
  }
}

// Salva as preferências da missão (mesma lógica dos limiares: objeto -> JSON).
export async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Falha ao salvar configurações:', error);
  }
}

// Lê as preferências salvas. O spread com DEFAULT_SETTINGS garante que, se eu
// adicionar um campo novo no futuro, dados antigos não fiquem com ele 'undefined'.
export async function loadSettings() {
  try {
    const stored = await AsyncStorage.getItem(SETTINGS_KEY);
    if (stored === null) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch (error) {
    console.warn('Falha ao carregar configurações:', error);
    return DEFAULT_SETTINGS;
  }
}
