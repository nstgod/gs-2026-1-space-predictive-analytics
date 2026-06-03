// Mini gráfico de barras que mostra a tendência de uma série de leituras.
// Feito só com Views (sem libs externas) para rodar em qualquer plataforma.
import { View } from 'react-native';
import { colors } from '@/constants/theme';

export default function MiniLineChart({ data = [], min = 0, max = 100, color = colors.primary, height = 90 }) {
  // Evita divisão por zero se min === max.
  const range = max - min || 1;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height }}>
      {data.map((value, index) => {
        // Normaliza o valor para 0..1 (altura proporcional). Mínimo de 5% só
        // para a barra nunca sumir totalmente quando o valor é o menor possível.
        const ratio = Math.max(0.05, Math.min(1, (value - min) / range));
        // Barras mais recentes (à direita) ficam mais opacas = sensação de "agora".
        const opacity = data.length > 1 ? 0.35 + 0.65 * (index / (data.length - 1)) : 1;
        return (
          <View
            key={index}
            style={{
              flex: 1,
              height: `${ratio * 100}%`,
              backgroundColor: color,
              opacity,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            }}
          />
        );
      })}
    </View>
  );
}
