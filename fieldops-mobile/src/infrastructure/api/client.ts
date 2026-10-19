import type { Session } from '@/infrastructure/storage/session';

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
const REQUEST_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  body?: unknown;
  headers?: Record<string, string>;
  session?: Session | null;
};

function assertApiBaseUrl(): string {
  if (!apiBaseUrl) {
    throw new ApiError('A URL da API não foi configurada. Defina EXPO_PUBLIC_API_URL.');
  }

  return apiBaseUrl;
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string; code?: string };
    return data.message ?? data.code ?? 'Não foi possível concluir esta operação.';
  } catch {
    return 'Não foi possível concluir esta operação.';
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, session, ...requestOptions } = options;
  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${assertApiBaseUrl()}${path}`, {
      ...requestOptions,
      signal: abortController.signal,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('A conexão com o servidor excedeu 15 segundos. Tente novamente.');
    }

    throw new ApiError('Não foi possível conectar ao servidor. Verifique a URL da API e a rede.');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new ApiError(await getErrorMessage(response), response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
