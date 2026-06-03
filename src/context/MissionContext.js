// O "CÉREBRO" global da missão. Junta simulação + alertas + storage num só lugar
// e entrega para todas as telas via Context API (estado global do app).
import { createContext, useContext, useState, useEffect } from 'react';
import { createInitialReadings, tickReadings, METRICS } from '@/utils/simulation';
import { buildAlerts, DEFAULT_THRESHOLDS } from '@/utils/alerts';
import {
  loadThresholds,
  saveThresholds,
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
} from '@/utils/storage';

// Quantos pontos de histórico guardar por métrica (para os gráficos).
const MAX_HISTORY = 20;

// 1) O canal. Começa null; quem dá valor a ele é o Provider, abaixo.
const MissionContext = createContext(null);

// Cria o histórico inicial: cada métrica começa com seu valor inicial.
function createInitialHistory(readings) {
  const history = {};
  METRICS.forEach((m) => {
    history[m.key] = [readings[m.key]];
  });
  return history;
}

// 2) O Provider: o componente que SEGURA o estado e o compartilha.
// 'children' = tudo que estiver "dentro" dele (todas as telas).
export function MissionProvider({ children }) {
  // Leituras atuais dos sensores. Quando muda, as telas redesenham.
  const [readings, setReadings] = useState(createInitialReadings);

  // Histórico das últimas leituras (alimenta os gráficos de linha).
  const [history, setHistory] = useState(() => createInitialHistory(createInitialReadings()));

  // Limiares. Começam no padrão e são trocados pelos salvos no boot.
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);

  // Preferências da missão (nome). Também começam no padrão e são hidratadas no boot.
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // EFEITO 1 — roda UMA vez ao abrir o app: carrega o que estava salvo no AsyncStorage
  // (limiares + preferências). As duas leituras disparam em paralelo.
  useEffect(() => {
    loadThresholds().then((saved) => setThresholds(saved));
    loadSettings().then((saved) => setSettings(saved));
  }, []);

  // EFEITO 2 — o "coração" do tempo real: a cada 1,5s gera novas leituras.
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Forma funcional: parto do valor ANTERIOR (variação suave depende dele).
      setReadings((anterior) => tickReadings(anterior));
    }, 1500);

    // Faxina: para o timer quando o componente sai de cena (evita vazamento).
    return () => clearInterval(intervalId);
  }, []);

  // EFEITO 3 — sempre que as leituras mudam, anexo o novo ponto ao histórico
  // e mantenho só os últimos MAX_HISTORY (para o gráfico não crescer infinito).
  useEffect(() => {
    setHistory((anterior) => {
      const atualizado = {};
      METRICS.forEach((m) => {
        const serie = [...(anterior[m.key] || []), readings[m.key]];
        atualizado[m.key] = serie.slice(-MAX_HISTORY);
      });
      return atualizado;
    });
  }, [readings]);

  // Alertas são CALCULADOS a partir de readings + thresholds (não guardados).
  // Assim nunca ficam dessincronizados.
  const alerts = buildAlerts(readings, thresholds);

  // O formulário chama isto para mudar um limiar: atualiza o estado E persiste.
  function updateThresholds(novos) {
    setThresholds(novos);
    saveThresholds(novos);
  }

  // Mesma ideia para as preferências da missão.
  function updateSettings(novas) {
    setSettings(novas);
    saveSettings(novas);
  }

  const value = {
    readings,
    history,
    thresholds,
    alerts,
    settings,
    updateThresholds,
    updateSettings,
  };

  return (
    <MissionContext.Provider value={value}>{children}</MissionContext.Provider>
  );
}

// 3) O atalho que cada tela usa para acessar o estado global.
export function useMission() {
  const context = useContext(MissionContext);
  if (context === null) {
    throw new Error('useMission precisa estar dentro de <MissionProvider>');
  }
  return context;
}
