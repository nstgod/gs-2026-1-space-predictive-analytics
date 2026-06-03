// Card de um indicador da missão: nome, valor + unidade e status colorido.
// Ele mesmo decide a cor avaliando o valor contra os limiares (evaluate).
import { View, Text } from 'react-native';
import { colors, spacing, radius, fontSize } from '@/constants/theme';
import { evaluate, LEVELS } from '@/utils/alerts';

// Traduz o nível em cor e rótulo curto exibido no card.
function statusInfo(level) {
  if (level === LEVELS.CRITICAL) return { color: colors.critical, label: 'CRÍTICO' };
  if (level === LEVELS.WARNING) return { color: colors.warning, label: 'ATENÇÃO' };
  return { color: colors.ok, label: 'NORMAL' };
}

export default function IndicatorCard({ metric, value, thresholds, style }) {
  const level = evaluate(metric.key, value, thresholds);
  const { color, label } = statusInfo(level);

  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          borderCurve: 'continuous',
          padding: spacing.md,
          gap: spacing.xs,
          borderLeftWidth: 4,
          borderLeftColor: color, // faixa colorida = status num relance
        },
        style,
      ]}
    >
      <Text style={{ color: colors.textMuted, fontSize: fontSize.caption }}>{metric.label}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
        <Text
          selectable
          style={{
            color: colors.text,
            fontSize: fontSize.heading,
            fontWeight: '700',
            fontVariant: ['tabular-nums'], // números não "dançam" ao mudar
          }}
        >
          {value}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: fontSize.body, marginBottom: 3 }}>
          {metric.unit}
        </Text>
      </View>

      <View
        style={{
          alignSelf: 'flex-start',
          backgroundColor: color + '22',
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
          borderRadius: radius.sm,
          borderCurve: 'continuous',
        }}
      >
        <Text style={{ color, fontSize: fontSize.caption, fontWeight: '600' }}>{label}</Text>
      </View>
    </View>
  );
}
