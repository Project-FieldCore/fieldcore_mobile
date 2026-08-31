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

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    setErrorMessage(null);
    // Redefinição real (email + code + password) chega com a integração da API na Sprint 2.
    router.replace('/login');
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
          <Text style={styles.greeting}>Nova senha</Text>
          <Text style={styles.subtitle}>Crie uma nova senha para acessar sua conta</Text>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <TextField
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Nova senha"
            />
            <TextField
              icon="lock-closed-outline"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirmar nova senha"
            />

            <Button label="Redefinir senha" onPress={handleSubmit} />
          </View>

          <Text style={styles.backLink} onPress={() => router.back()}>
            Voltar
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
  errorBanner: {
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
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
