import { useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Card, colors, spacing, typography } from '@/design-system';
import { getPendingSyncCount } from '@/features/inspections/mockRepository';
import { getPendingOperations } from '@/features/inspections/draftStore';

export default function SynchronizationScreen() {
  const [pending, setPending] = useState(getPendingSyncCount());
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState(false);
  const loadPending = useCallback(async () => { setPending((await getPendingOperations()).length); }, []);
  const sync = async () => { setSyncing(true); await new Promise((resolve) => setTimeout(resolve, 350)); setSyncNotice(true); setSyncing(false); };
  useFocusEffect(useCallback(() => { void loadPending(); }, [loadPending]));
  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.navy, colors.green]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}><Text style={styles.title}>Sincronização</Text><Text style={styles.subtitle}>Acompanhe os dados salvos no dispositivo.</Text></LinearGradient>
      <Card style={styles.card}><Text style={styles.value}>{pending}</Text><Text style={styles.label}>{pending === 1 ? 'operação aguardando envio' : 'operações aguardando envio'}</Text></Card>
      <Card style={styles.card}><Text style={styles.label}>Estado da sincronização</Text><Text style={styles.lastSync}>Aguardando conexão com o servidor</Text></Card>
      <Button label="Sincronizar agora" onPress={() => void sync()} loading={syncing} disabled={pending === 0} />
      {pending > 0 || syncNotice ? <Text style={styles.warning}>Os dados estão seguros neste dispositivo. O envio ficará disponível quando a API for integrada.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  header: { marginHorizontal: -spacing.lg, padding: spacing.lg, paddingTop: spacing.xl, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, marginBottom: spacing.sm },
  title: {
    ...typography.title,
    color: colors.textOnDark,
  },
  subtitle: { ...typography.body, color: colors.textOnDark, opacity: 0.85, marginTop: spacing.xs },
  card: { gap: spacing.xs },
  value: { ...typography.title, fontSize: 36, color: colors.navy },
  label: { ...typography.body, color: colors.textMuted },
  lastSync: { ...typography.subtitle, color: colors.text },
  success: { ...typography.body, color: colors.success, textAlign: 'center' },
  warning: { ...typography.body, color: colors.textMuted, textAlign: 'center', lineHeight: 21 },
});
