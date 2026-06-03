// FORMULÁRIO — edita os limiares de alerta de cada métrica.
// Inputs controlados + validação + feedback de erro + persistência (AsyncStorage).
import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useMission } from '@/context/MissionContext';
import { METRICS } from '@/utils/simulation';
import { DEFAULT_THRESHOLDS } from '@/utils/alerts';
import { DEFAULT_SETTINGS } from '@/utils/storage';
import { colors, spacing, radius, fontSize } from '@/constants/theme';

// Converte os limiares (números) para um formulário de strings (o que o TextInput usa).
function toForm(thresholds) {
  const form = {};
  METRICS.forEach((m) => {
    form[m.key] = {
      warning: String(thresholds[m.key].warning),
      critical: String(thresholds[m.key].critical),
    };
  });
  return form;
}

export default function Configuracoes() {
  const { thresholds, settings, updateThresholds, updateSettings } = useMission();
  const [form, setForm] = useState(() => toForm(thresholds));
  // Nome da missão: input controlado próprio (texto, não é um limiar numérico).
  const [missionName, setMissionName] = useState(settings.missionName);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // Atualiza um campo específico (input controlado).
  function setField(key, field, text) {
    setForm((prev) => ({ ...prev, [key]: { ...prev[key], [field]: text } }));
    setSaved(false); // mexeu = "salvo" deixa de valer
  }

  // Atualiza o nome da missão (input controlado).
  function setName(text) {
    setMissionName(text);
    setSaved(false);
  }

  // Valida todos os campos. Devolve um objeto { campo: 'mensagem de erro' }.
  function validate() {
    const found = {};

    // Nome da missão: obrigatório e com tamanho mínimo.
    if (missionName.trim().length < 2) {
      found.missionName = 'Informe um nome de missão (mín. 2 caracteres).';
    }

    METRICS.forEach((m) => {
      const w = Number(form[m.key].warning);
      const c = Number(form[m.key].critical);

      // 1) precisa ser número preenchido
      if (form[m.key].warning === '' || form[m.key].critical === '' || isNaN(w) || isNaN(c)) {
        found[m.key] = 'Informe valores numéricos.';
        return;
      }
      // 2) dentro da faixa física da métrica
      if (w < m.min || w > m.max || c < m.min || c > m.max) {
        found[m.key] = `Use valores entre ${m.min} e ${m.max}.`;
        return;
      }
      // 3) ordem coerente com a direção do perigo
      if (m.direction === 'high' && !(w < c)) {
        found[m.key] = 'Atenção deve ser menor que Crítico.';
      } else if (m.direction === 'low' && !(w > c)) {
        found[m.key] = 'Atenção deve ser maior que Crítico.';
      }
    });
    return found;
  }

  function onSave() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return; // tem erro: não salva

    // tudo válido: converte de volta para números e persiste via Context.
    const result = {};
    METRICS.forEach((m) => {
      result[m.key] = {
        warning: Number(form[m.key].warning),
        critical: Number(form[m.key].critical),
      };
    });
    updateThresholds(result);
    updateSettings({ ...settings, missionName: missionName.trim() });
    setSaved(true);
  }

  function onReset() {
    setForm(toForm(DEFAULT_THRESHOLDS));
    setMissionName(DEFAULT_SETTINGS.missionName);
    setErrors({});
    setSaved(false);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      {/* Identificação da missão — preferência persistida no AsyncStorage. */}
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
          Identificação da missão
        </Text>
        <Field label="Nome da missão" value={missionName} onChangeText={setName} numeric={false} />
        {errors.missionName ? (
          <Text style={{ color: colors.critical, fontSize: fontSize.caption }}>
            {errors.missionName}
          </Text>
        ) : null}
      </View>

      <Text style={{ color: colors.textMuted, fontSize: fontSize.caption }}>
        Defina em que valor cada métrica entra em Atenção e em Crítico.
      </Text>

      {METRICS.map((metric) => (
        <View
          key={metric.key}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            borderCurve: 'continuous',
            padding: spacing.md,
            gap: spacing.sm,
          }}
        >
          <Text style={{ color: colors.text, fontSize: fontSize.body, fontWeight: '600' }}>
            {metric.label} ({metric.unit})
          </Text>

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <Field
              label="Atenção"
              value={form[metric.key].warning}
              onChangeText={(t) => setField(metric.key, 'warning', t)}
            />
            <Field
              label="Crítico"
              value={form[metric.key].critical}
              onChangeText={(t) => setField(metric.key, 'critical', t)}
            />
          </View>

          {/* Feedback de erro daquela métrica */}
          {errors[metric.key] ? (
            <Text style={{ color: colors.critical, fontSize: fontSize.caption }}>
              {errors[metric.key]}
            </Text>
          ) : null}
        </View>
      ))}

      {/* Mensagem de sucesso */}
      {saved ? (
        <Text style={{ color: colors.ok, fontSize: fontSize.body, textAlign: 'center' }}>
          ✓ Limiares salvos com sucesso.
        </Text>
      ) : null}

      <Pressable
        onPress={onSave}
        style={{
          backgroundColor: colors.primary,
          borderRadius: radius.md,
          borderCurve: 'continuous',
          padding: spacing.md,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#04111F', fontSize: fontSize.body, fontWeight: '700' }}>
          Salvar limiares
        </Text>
      </Pressable>

      <Pressable onPress={onReset} style={{ padding: spacing.sm, alignItems: 'center' }}>
        <Text style={{ color: colors.textMuted, fontSize: fontSize.body }}>
          Restaurar padrões
        </Text>
      </Pressable>
    </ScrollView>
  );
}

// Pequeno input rotulado, reutilizado para "Atenção", "Crítico" e o nome da missão.
// 'numeric' (padrão true) decide o tipo de teclado e o placeholder.
function Field({ label, value, onChangeText, numeric = true }) {
  return (
    <View style={{ flex: 1, gap: spacing.xs }}>
      <Text style={{ color: colors.textMuted, fontSize: fontSize.caption }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={numeric ? 'numeric' : 'default'}
        placeholder={numeric ? '0' : 'Ex.: Órion-7'}
        placeholderTextColor={colors.textMuted}
        style={{
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.sm,
          borderCurve: 'continuous',
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.sm,
          color: colors.text,
          fontSize: fontSize.body,
        }}
      />
    </View>
  );
}
