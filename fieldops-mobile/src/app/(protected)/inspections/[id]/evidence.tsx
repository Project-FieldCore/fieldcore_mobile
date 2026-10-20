import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Button, colors, spacing, typography } from '@/design-system';

export default function EvidenceScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = async () => {
    if (!cameraRef.current) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.65 });
      if (photo?.uri) setPhotoUri(photo.uri);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) return <View style={styles.center}><Text style={styles.text}>Preparando câmera...</Text></View>;
  if (!permission.granted) return <View style={styles.center}><Text style={styles.title}>Anexe uma evidência fotográfica</Text><Text style={styles.text}>A foto ajuda a documentar a condição do equipamento e ficará vinculada à inspeção.</Text><Button label="Permitir uso da câmera" onPress={() => void requestPermission()} /><Button label="Voltar" variant="secondary" onPress={() => router.back()} /></View>;

  if (photoUri) return <View style={styles.preview}><Image source={{ uri: photoUri }} style={styles.image} /><View style={styles.previewBottom}><Text style={styles.title}>Evidência capturada</Text><Text style={styles.text}>A foto será enviada junto com a inspeção quando houver sincronização.</Text><Button label="Usar esta foto" onPress={() => router.back()} /><Button label="Tirar outra foto" variant="secondary" onPress={() => setPhotoUri(null)} /></View></View>;

  return <View style={styles.cameraContainer}><CameraView ref={cameraRef} style={styles.camera} facing="back" /><View style={styles.cameraBottom}><Text style={styles.cameraText}>Fotografe o equipamento ou a não conformidade identificada.</Text><Button label="Capturar foto" loading={isCapturing} onPress={() => void capture()} /><Button label="Cancelar" variant="light" onPress={() => router.back()} /></View></View>;
}

const styles = StyleSheet.create({ cameraContainer: { flex: 1, backgroundColor: colors.navy }, camera: { flex: 1 }, cameraBottom: { padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.navy }, cameraText: { ...typography.body, color: colors.textOnDark, lineHeight: 21, textAlign: 'center' }, center: { flex: 1, padding: spacing.lg, gap: spacing.md, justifyContent: 'center', backgroundColor: colors.background }, preview: { flex: 1, backgroundColor: colors.navy }, image: { flex: 1, width: '100%' }, previewBottom: { padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.background }, title: { ...typography.title, color: colors.text }, text: { ...typography.body, color: colors.textMuted, lineHeight: 21 } });
