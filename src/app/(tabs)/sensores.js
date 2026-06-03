// DASHBOARD DE SENSORES — temperatura, pressão e radiação + gráfico em tempo real.
import { View, Text } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import IndicatorCard from '@/components/IndicatorCard';
import MiniLineChart from '@/components/MiniLineChart';
import { useMission } from '@/context/MissionContext';
import { METRICS } from '@/utils/simulation';
import { colors, spacing, radius, fontSize } from '@/constants/theme';

export default function Sensores() {
  const { readings, thresholds, history } = useMission();
  const metrics = METRICS.filter((m) => m.category === 'sensores');
  const temperature = METRICS.find((m) => m.key === 'temperature');

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

      {/* Painel do gráfico de temperatura */}
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
          Temperatura — leituras recentes
        </Text>
        <MiniLineChart
          data={history.temperature}
          min={temperature.min}
          max={temperature.max}
          color={colors.primary}
        />
      </View>
    </ScreenContainer>
  );
}
