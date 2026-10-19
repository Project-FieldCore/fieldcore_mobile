import { ApiError, apiRequest } from '@/infrastructure/api/client';
import type { Session } from '@/infrastructure/storage/session';
import { dataSource } from '@/config/dataSource';

export type LoginInput = {
  email: string;
  password: string;
};

type SessionResponse = {
  accessToken: string;
  refreshToken: string;
};

const DEMO_USER = {
  email: 'tecnico@fieldcore.local',
  password: 'FieldOps123!',
};

const MOCK_SESSION: Session = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function login(input: LoginInput): Promise<Session> {
  if (dataSource === 'mock') {
    await wait(350);
    if (
      input.email.trim().toLowerCase() !== DEMO_USER.email ||
      input.password !== DEMO_USER.password
    ) {
      throw new ApiError('E-mail ou senha inválidos.', 401);
    }

    return MOCK_SESSION;
  }

  return apiRequest<SessionResponse>('/auth/login', { method: 'POST', body: input });
}

export function refreshSession(refreshToken: string): Promise<Session> {
  if (dataSource === 'mock') {
    return Promise.resolve(MOCK_SESSION);
  }

  return apiRequest<SessionResponse>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
}
