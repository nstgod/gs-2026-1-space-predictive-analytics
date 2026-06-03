// Casca padrão de toda tela: fundo espacial + scroll com safe area automática.
// Centraliza o layout para todas as telas ficarem consistentes.
import { ScrollView } from 'react-native';
import { colors, spacing } from '@/constants/theme';

export default function ScreenContainer({ children }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl }}
      // Ajusta sozinho o espaço do header/tab bar (evita conteúdo escondido).
      contentInsetAdjustmentBehavior="automatic"
    >
      {children}
    </ScrollView>
  );
}
