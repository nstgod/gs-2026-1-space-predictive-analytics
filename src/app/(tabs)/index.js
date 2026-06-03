// HOME — Dashboard principal: status geral da missão + todos os indicadores.
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import ScreenContainer from '@/components/ScreenContainer';
import IndicatorCard from '@/components/IndicatorCard';
import StatusBadge from '@/components/StatusBadge';
import { useMission } from '@/context/MissionContext';
import { METRICS } from '@/utils/simulation';
import { LEVELS } from '@/utils/alerts';
import { colors, spacing, radius, fontSize } from '@/constants/theme';

export default function Home() {
  const { readings, thresholds, alerts, settings } = useMission();

  // Status geral = o pior nível presente entre os alertas ativos.
  const overall = alerts.some((a) => a.level === LEVELS.CRITICAL)
    ? LEVELS.CRITICAL
    : alerts.length > 0
    ? LEVELS.WARNING
    : LEVELS.OK;

  const overallText =
    overall === LEVELS.CRITICAL
      ? 'Atenção máxima: parâmetros críticos detectados.'
      : overall === LEVELS.WARNING
      ? 'Operação com pontos de atenção.'
      : 'Todos os sistemas nominais.';

  return (
    <ScreenContainer>
      {/* Banner de status geral */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderCurve: 'continuous',
          padding: spacing.lg,
          gap: spacing.sm,
        }}
      >
        <Text style={{ color: colors.textMuted, fontSize: fontSize.caption }}>
          STATUS DA MISSÃO
        </Text>
        <Text style={{ color: colors.text, fontSize: fontSize.heading, fontWeight: '700' }}>
          {settings.missionName}
        </Text>
        <StatusBadge level={overall} />
        <Text style={{ color: colors.text, fontSize: fontSize.body }}>{overallText}</Text>

        <Link href="/alertas" style={{ color: colors.primary, fontSize: fontSize.body, marginTop: spacing.xs }}>
          {alerts.length} alerta(s) ativo(s) →
        </Link>
      </View>

      <Text style={{ color: colors.text, fontSize: fontSize.title, fontWeight: '700' }}>
        Indicadores
      </Text>

      {/* Grade com todos os indicadores (2 por linha) */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {METRICS.map((metric) => (
          <IndicatorCard
            key={metric.key}
            metric={metric}
            value={readings[metric.key]}
            thresholds={thresholds}
            style={{ flexBasis: '47%', flexGrow: 1 }}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}
