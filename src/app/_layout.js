// Layout RAIZ do app. Faz duas coisas essenciais:
// 1) Envolve tudo no <MissionProvider> para o estado global chegar em todas as telas.
// 2) Define a Stack: o grupo de abas (tabs) + a tela de configurações (modal).
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MissionProvider } from '@/context/MissionContext';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <MissionProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.text,
            headerTitleStyle: { color: colors.text },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          {/* As abas não mostram header próprio da Stack (cada aba tem o seu). */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Formulário aberto como modal por cima das abas. */}
          <Stack.Screen
            name="configuracoes"
            options={{ title: 'Configurar Alertas', presentation: 'modal' }}
          />
        </Stack>
      </MissionProvider>
    </SafeAreaProvider>
  );
}
