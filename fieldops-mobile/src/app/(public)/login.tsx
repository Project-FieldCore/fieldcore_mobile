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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!email || !password) {
      setErrorMessage('Preencha e-mail e senha para continuar.');
      return;
    }

    setErrorMessage(null);
    // Navegação de demonstração; substituir por login real (API + Secure Store) na Sprint 2
    router.replace('/home');
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
          <Text style={styles.greeting}>Olá!</Text>
          <Text style={styles.subtitle}>Entre com suas credenciais para continuar</Text>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <TextField
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="E-mail"
            />
            <TextField
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Senha"
            />

            <Text style={styles.forgotPasswordLink} onPress={() => router.push('/forgot-password')}>
              Esqueceu a senha?
            </Text>

            <Button label="Entrar" onPress={handleSubmit} />
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
  forgotPasswordLink: {
    ...typography.caption,
    color: colors.navy,
    textAlign: 'right',
  },
  backLink: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
});
