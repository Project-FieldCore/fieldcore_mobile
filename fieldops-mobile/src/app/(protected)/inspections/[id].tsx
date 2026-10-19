import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, colors, EmptyState, LoadingState, spacing, typography } from '@/design-system';
import { getInspection, type Inspection } from '@/features/inspections/mockRepository';

export default function InspectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [inspection, setInspection] = useState<Inspection | null | undefined>();

  useEffect(() => { void getInspection(id).then(setInspection); }, [id]);

  if (inspection === undefined) return <LoadingState title="Carregando inspeção..." />;
  if (!inspection) return <EmptyState title="Inspeção não encontrada" description="Volte à lista e selecione outra inspeção." />;

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <Text style={styles.title}>{inspection.equipment}</Text>
      <Text style={styles.client}>{inspection.client}</Text>
      <Card style={styles.card}>
        <Detail label="Local" value={inspection.site} />
        <Detail label="Agendamento" value={inspection.scheduledAt} />
        <Detail label="Prioridade" value={priorityLabel[inspection.priority]} />
        <Detail label="Status" value={statusLabel[inspection.status]} />
      </Card>
      <Text style={styles.sectionTitle}>Instruções</Text>
      <Text style={styles.instructions}>{inspection.instructions}</Text>
      <Button label="Iniciar checklist" onPress={() => router.push(`/inspections/${inspection.id}/checklist`)} />
      <Button label="Voltar para inspeções" variant="secondary" onPress={() => router.back()} />
    </ScrollView>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}
const priorityLabel = { HIGH: 'Alta', MEDIUM: 'Média', LOW: 'Baixa' };
const statusLabel = { ASSIGNED: 'Atribuída', IN_PROGRESS: 'Em andamento', SUBMITTED: 'Enviada', PENDING_SYNC: 'Aguardando sincronização' };
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.lg, gap: spacing.md }, title: { ...typography.title, color: colors.text }, client: { ...typography.body, color: colors.textMuted, marginTop: -spacing.sm }, card: { gap: spacing.md }, label: { ...typography.caption, color: colors.textMuted }, value: { ...typography.body, color: colors.text, marginTop: spacing.xs }, sectionTitle: { ...typography.subtitle, color: colors.text }, instructions: { ...typography.body, color: colors.textMuted, lineHeight: 21 } });
