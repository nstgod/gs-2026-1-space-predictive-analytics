// Navegação por ABAS (Tabs do Expo Router). 5 abas, cada uma com ícone temático.
// O header de cada aba tem um botão de engrenagem que abre as configurações.
import { Tabs, Link } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { useMission } from '@/context/MissionContext';
import { LEVELS } from '@/utils/alerts';

export default function TabsLayout() {
  // Lê o estado global para mostrar o nº de alertas como "badge" na aba Alertas.
  const { alerts } = useMission();
  const total = alerts.length;
  // Se houver algum crítico, o badge fica vermelho; senão amarelo.
  const hasCritical = alerts.some((a) => a.level === LEVELS.CRITICAL);

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        // Engrenagem no canto do header -> abre o modal de configurações.
        headerRight: () => (
          <Link href="/configuracoes" asChild>
            <Pressable hitSlop={12} style={{ marginRight: 16 }}>
              <Ionicons name="settings-outline" size={22} color={colors.text} />
            </Pressable>
          </Link>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Missão',
          tabBarIcon: ({ color, size }) => <Ionicons name="planet" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="sensores"
        options={{
          title: 'Sensores',
          tabBarIcon: ({ color, size }) => <Ionicons name="thermometer" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="energia"
        options={{
          title: 'Energia',
          tabBarIcon: ({ color, size }) => <Ionicons name="battery-charging" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="comunicacao"
        options={{
          title: 'Comunicação',
          tabBarIcon: ({ color, size }) => <Ionicons name="radio" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => <Ionicons name="warning" color={color} size={size} />,
          // Badge com a contagem de alertas ativos (some quando é 0).
          tabBarBadge: total > 0 ? total : undefined,
          tabBarBadgeStyle: { backgroundColor: hasCritical ? colors.critical : colors.warning },
        }}
      />
    </Tabs>
  );
}
