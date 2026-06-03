export const colors = {
  // Fundos
  background: '#05070F',   // fundo principal (quase preto, azulado)
  surface: '#0E1424',      // fundo dos cards
  surfaceAlt: '#161E33',   // cards destacados

  // Texto
  text: '#E6ECFF',         // texto principal (branco azulado)
  textMuted: '#7B86A8',    // texto secundário / legendas

  // Acentos
  primary: '#4D9DFF',      // azul "missão" (botões, destaques)
  accent: '#9B6DFF',       // roxo (gráficos, detalhes)

  // Status (usados nos alertas e indicadores)
  ok: '#3DD68C',           // verde  — tudo normal
  warning: '#FFC24B',      // amarelo — atenção
  critical: '#FF5C6C',     // vermelho — crítico

  border: '#222B45',       // linhas e bordas sutis
};

// Espaçamentos padrão (em pixels) — use sempre estes valores
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Raio de borda (cantos arredondados)
export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
};

// Tamanhos de fonte
export const fontSize = {
  caption: 12,
  body: 14,
  title: 18,
  heading: 24,
  display: 32,
};

// Exporta tudo junto também: import theme from '@/constants/theme'
export default { colors, spacing, radius, fontSize };
