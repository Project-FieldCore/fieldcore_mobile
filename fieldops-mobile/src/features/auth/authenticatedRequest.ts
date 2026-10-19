import { apiRequest, ApiError } from '@/infrastructure/api/client';
import { useAuthStore } from './store';

/**
 * Executes an authenticated request and retries it once after a successful token refresh.
 * Services outside authentication should use this helper instead of calling apiRequest directly.
 */
export async function authenticatedRequest<T>(path: string, options: Parameters<typeof apiRequest>[1] = {}) {
  const initialSession = useAuthStore.getState().session;

  try {
    return await apiRequest<T>(path, { ...options, session: initialSession });
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) {
      throw error;
    }

    const refreshedSession = await useAuthStore.getState().refresh();
    if (!refreshedSession) {
      throw error;
    }

    return apiRequest<T>(path, { ...options, session: refreshedSession });
  }
}
