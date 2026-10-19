import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, colors, spacing, typography } from '@/design-system';
import { completeInspection } from '@/features/inspections/mockRepository';

export default function SummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [completed, setCompleted] = useState(false);
  const confirm = async () => { await completeInspection(id); setCompleted(true); };
  if (completed) return <View style={styles.center}><Text style={styles.title}>Inspeção concluída</Text><Text style={styles.description}>Salva no dispositivo e aguardando sincronização.</Text><Button label="Voltar para inspeções" onPress={() => router.replace('/inspections')} /></View>;
  return <ScrollView contentContainerStyle={styles.content}><Text style={styles.title}>Resumo da inspeção</Text><Text style={styles.description}>Revise o preenchimento antes de concluir.</Text><Card style={styles.card}><Text style={styles.label}>Checklist</Text><Text style={styles.value}>Todos os itens obrigatórios foram respondidos.</Text></Card><Card style={styles.card}><Text style={styles.label}>Sincronização</Text><Text style={styles.value}>A conclusão será salva localmente e enviada quando a sincronização estiver disponível.</Text></Card><Button label="Confirmar conclusão" onPress={() => void confirm()} /><Button label="Voltar ao checklist" variant="secondary" onPress={() => router.back()} /></ScrollView>;
}
const styles = StyleSheet.create({ content: { flexGrow: 1, padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background }, center: { flex: 1, justifyContent: 'center', padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background }, title: { ...typography.title, color: colors.text }, description: { ...typography.body, color: colors.textMuted }, card: { gap: spacing.xs }, label: { ...typography.subtitle, color: colors.text }, value: { ...typography.body, color: colors.textMuted, lineHeight: 21 } });
