// DASHBOARD DE COMUNICAÇÃO — sinal e latência + gráfico da qualidade do sinal.
import { View, Text } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import IndicatorCard from '@/components/IndicatorCard';
import MiniLineChart from '@/components/MiniLineChart';
import { useMission } from '@/context/MissionContext';
import { METRICS } from '@/utils/simulation';
import { colors, spacing, radius, fontSize } from '@/constants/theme';

export default function Comunicacao() {
  const { readings, thresholds, history } = useMission();
  const metrics = METRICS.filter((m) => m.category === 'comunicacao');
  const signal = METRICS.find((m) => m.key === 'signal');

  return (
    <ScreenContainer>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {metrics.map((metric) => (
          <IndicatorCard
            key={metric.key}
            metric={metric}
            value={readings[metric.key]}
            thresholds={thresholds}
            style={{ flexBasis: '47%', flexGrow: 1 }}
          />
        ))}
      </View>

      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          borderCurve: 'continuous',
          padding: spacing.md,
          gap: spacing.sm,
        }}
      >
        <Text style={{ color: colors.text, fontSize: fontSize.body, fontWeight: '600' }}>
          Qualidade do sinal — leituras recentes
        </Text>
        <MiniLineChart
          data={history.signal}
          min={signal.min}
          max={signal.max}
          color={colors.accent}
        />
      </View>
    </ScreenContainer>
  );
}
