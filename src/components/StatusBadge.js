// Selo colorido de status (NORMAL / ATENÇÃO / CRÍTICO).
// Reutilizado no banner da Home e onde precisar resumir um nível.
import { View, Text } from 'react-native';
import Pulse from '@/components/Pulse';
import { colors, radius, spacing, fontSize } from '@/constants/theme';
import { LEVELS } from '@/utils/alerts';

// Mapa nível -> cor + rótulo. Centraliza a aparência de cada status.
const META = {
  [LEVELS.OK]: { color: colors.ok, label: 'NORMAL' },
  [LEVELS.WARNING]: { color: colors.warning, label: 'ATENÇÃO' },
  [LEVELS.CRITICAL]: { color: colors.critical, label: 'CRÍTICO' },
};

export default function StatusBadge({ level, label }) {
  const meta = META[level] || META[LEVELS.OK];
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        // cor + '22' = mesma cor com ~13% de opacidade (fundo suave do selo).
        backgroundColor: meta.color + '22',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.sm,
        borderCurve: 'continuous',
      }}
    >
      {/* O ponto pulsa quando o status não é NORMAL (atenção/crítico). */}
      <Pulse active={level !== LEVELS.OK}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: meta.color }} />
      </Pulse>
      <Text style={{ color: meta.color, fontSize: fontSize.caption, fontWeight: '700' }}>
        {label || meta.label}
      </Text>
    </View>
  );
}
