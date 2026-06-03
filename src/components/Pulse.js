// Animação reutilizável: faz o filho "pulsar" (escala) em loop enquanto active=true.
// Propósito claro: chamar a atenção do operador para estados de alerta — um ponto
// que pulsa é percebido na visão periférica, ao contrário de uma cor estática.
// Usa a Animated API nativa do React Native (sem libs extras = sem config de Babel).
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function Pulse({ active = true, children, style }) {
  // useRef guarda o MESMO Animated.Value entre renders (não recria a cada frame).
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sem alerta: garante a escala normal e não anima (poupa bateria/CPU).
    if (!active) {
      scale.stopAnimation();
      scale.setValue(1);
      return;
    }

    // Loop infinito: cresce um pouco e volta, criando o "batimento".
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.25, duration: 650, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();

    // Faxina: para a animação quando 'active' muda ou o componente sai de cena.
    return () => loop.stop();
  }, [active, scale]);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
  );
}
