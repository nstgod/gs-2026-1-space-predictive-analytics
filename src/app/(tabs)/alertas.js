// TELA DE ALERTAS — lista os alertas ativos gerados automaticamente pelos limiares.
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '@/components/ScreenContainer';
import AlertItem from '@/components/AlertItem';
import { useMission } from '@/context/MissionContext';
import { colors, spacing, radius, fontSize } from '@/constants/theme';

export default function Alertas() {
  const { alerts } = useMission();

  return (
    <ScreenContainer>
      <Text style={{ color: colors.textMuted, fontSize: fontSize.caption }}>
        Gerados automaticamente quando uma leitura cruza um limiar configurado.
      </Text>

      {alerts.length === 0 ? (
        // Estado vazio: tudo nominal.
        <View
          style={{
            alignItems: 'center',
            gap: spacing.sm,
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderCurve: 'continuous',
            padding: spacing.xl,
          }}
        >
          <Ionicons name="checkmark-circle" size={48} color={colors.ok} />
          <Text style={{ color: colors.text, fontSize: fontSize.title, fontWeight: '700' }}>
            Tudo nominal
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: fontSize.body, textAlign: 'center' }}>
            Nenhum parâmetro fora dos limites no momento.
          </Text>
        </View>
      ) : (
        alerts.map((alert) => <AlertItem key={alert.key} alert={alert} />)
      )}
    </ScreenContainer>
  );
}
