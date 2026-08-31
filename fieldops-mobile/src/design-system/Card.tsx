import { StyleSheet, View, ViewProps } from 'react-native';

import { colors, radius, shadows, spacing } from './tokens';

export function Card({ style, children, ...viewProps }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...viewProps}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.card,
  },
});
