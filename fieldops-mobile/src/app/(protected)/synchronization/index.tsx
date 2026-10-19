import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Card, colors, spacing, typography } from '@/design-system';
import { getPendingSyncCount, synchronizePendingInspections } from '@/features/inspections/mockRepository';

export default function SynchronizationScreen() {
  const [pending, setPending] = useState(getPendingSyncCount());
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const sync = async () => { setSyncing(true); await synchronizePendingInspections(); setPending(getPendingSyncCount()); setLastSync(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })); setSyncing(false); };
  useFocusEffect(useCallback(() => { setPending(getPendingSyncCount()); }, []));
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sincronização</Text>
      <Text style={styles.subtitle}>Acompanhe os dados salvos no dispositivo.</Text>
      <Card style={styles.card}><Text style={styles.value}>{pending}</Text><Text style={styles.label}>{pending === 1 ? 'operação aguardando envio' : 'operações aguardando envio'}</Text></Card>
      <Card style={styles.card}><Text style={styles.label}>Última sincronização</Text><Text style={styles.lastSync}>{lastSync ? `Hoje, ${lastSync}` : 'Ainda não realizada'}</Text></Card>
      <Button label="Sincronizar agora" onPress={() => void sync()} loading={syncing} disabled={pending === 0} />
      {pending === 0 && lastSync ? <Text style={styles.success}>Todos os dados estão sincronizados.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: -spacing.sm },
  card: { gap: spacing.xs },
  value: { ...typography.title, fontSize: 36, color: colors.navy },
  label: { ...typography.body, color: colors.textMuted },
  lastSync: { ...typography.subtitle, color: colors.text },
  success: { ...typography.body, color: colors.success, textAlign: 'center' },
});
