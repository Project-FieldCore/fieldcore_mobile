import { Tabs } from 'expo-router';

import { colors } from '@/design-system';
import { RouteGuard } from '@/features/auth/RouteGuard';

export default function ProtectedLayout() {
  return (
    <RouteGuard requiresAuthentication>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Início' }} />
      <Tabs.Screen name="inspections/index" options={{ title: 'Inspeções' }} />
      <Tabs.Screen name="inspections/[id]" options={{ href: null }} />
      <Tabs.Screen name="inspections/[id]/checklist" options={{ href: null }} />
      <Tabs.Screen name="inspections/[id]/summary" options={{ href: null }} />
      <Tabs.Screen name="synchronization/index" options={{ title: 'Sincronização' }} />
    </Tabs>
    </RouteGuard>
  );
}
