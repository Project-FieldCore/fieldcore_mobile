import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/design-system';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Início</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
});
