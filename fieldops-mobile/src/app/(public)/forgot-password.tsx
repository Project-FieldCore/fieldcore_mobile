import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import {
  BrandLogo,
  Button,
  colors,
  gradients,
  spacing,
  TextField,
  typography,
} from '@/design-system';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Envio real do código de verificação chega com a integração da API na Sprint 2.
    router.push({ pathname: '/verify-code', params: { email } });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.brand}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <BrandLogo width={230} />
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.card}>
          <Text style={styles.greeting}>Esqueceu a senha?</Text>
          <Text style={styles.subtitle}>
            Informe seu e-mail cadastrado e enviaremos um código de verificação.
          </Text>

          <View style={styles.form}>
            <TextField
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="E-mail"
            />
            <Button label="Enviar código" onPress={handleSubmit} disabled={!email} />
          </View>

          <Text style={styles.backLink} onPress={() => router.back()}>
            Voltar para o login
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: -32,
    backgroundColor: colors.surface,
    borderRadius: 32,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  greeting: {
    ...typography.title,
    color: colors.navy,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  backLink: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
});
