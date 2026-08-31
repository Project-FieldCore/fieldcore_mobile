import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { colors, spacing, typography } from './tokens';

type StateViewProps = {
  title: string;
  description?: string;
};

export function LoadingState({ title = 'Carregando...' }: Partial<StateViewProps>) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export function EmptyState({ title, description }: StateViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

type ErrorStateProps = StateViewProps & {
  onRetry?: () => void;
};

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.errorTitle]}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {onRetry ? (
        <View style={styles.retryButton}>
          <Button label="Tentar novamente" onPress={onRetry} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    textAlign: 'center',
  },
  errorTitle: {
    color: colors.danger,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.sm,
  },
});
