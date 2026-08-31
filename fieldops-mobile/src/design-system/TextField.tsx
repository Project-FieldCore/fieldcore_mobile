import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors, radius, spacing, typography } from './tokens';

type TextFieldProps = TextInputProps & {
  label?: string;
  errorMessage?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function TextField({
  label,
  errorMessage,
  icon,
  style,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          errorMessage ? styles.inputWrapperError : null,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={isFocused ? colors.navy : colors.textMuted}
            style={styles.icon}
          />
        ) : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />
      </View>
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
  },
  inputWrapperFocused: {
    borderColor: colors.navy,
    backgroundColor: colors.surface,
  },
  inputWrapperError: {
    borderColor: colors.danger,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    paddingVertical: spacing.md,
  },
  errorMessage: {
    ...typography.caption,
    color: colors.danger,
  },
});
