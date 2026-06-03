// Linha de um alerta ativo: ícone, métrica, leitura atual e nível.
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Pulse from '@/components/Pulse';
import { colors, radius, spacing, fontSize } from '@/constants/theme';
import { LEVELS } from '@/utils/alerts';

export default function AlertItem({ alert }) {
  const isCritical = alert.level === LEVELS.CRITICAL;
  const accent = isCritical ? colors.critical : colors.warning;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderCurve: 'continuous',
        padding: spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: accent,
      }}
    >
      {/* Ícone pulsa nos alertas críticos para reforçar a urgência. */}
      <Pulse active={isCritical}>
        <Ionicons name={isCritical ? 'warning' : 'alert-circle'} size={26} color={accent} />
      </Pulse>

      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: fontSize.body, fontWeight: '600' }}>
          {alert.label}
        </Text>
        <Text selectable style={{ color: colors.textMuted, fontSize: fontSize.caption }}>
          Leitura atual: {alert.value} {alert.unit}
        </Text>
      </View>

      <Text style={{ color: accent, fontWeight: '700', fontSize: fontSize.caption }}>
        {isCritical ? 'CRÍTICO' : 'ATENÇÃO'}
      </Text>
    </View>
  );
}
