import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

export type InspectionDraft = {
  answers: Record<string, string>;
  nonConformityDescription?: string;
};

export type PendingOperation = { inspectionId: string; createdAt: string };

const drafts = new Map<string, InspectionDraft>();
const webDraftsKey = 'fieldops.inspection-drafts';
const webOutboxKey = 'fieldops.sync-outbox';
let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('fieldops.db').then(async (database) => {
      await database.execAsync(`CREATE TABLE IF NOT EXISTS inspection_drafts (inspection_id TEXT PRIMARY KEY NOT NULL, content TEXT NOT NULL, updated_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS sync_outbox (inspection_id TEXT PRIMARY KEY NOT NULL, created_at TEXT NOT NULL);`);
      return database;
    });
  }
  return databasePromise;
}

function readWebDrafts(): Record<string, InspectionDraft> {
  if (typeof localStorage === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(webDraftsKey) ?? '{}') as Record<string, InspectionDraft>; } catch { return {}; }
}

function writeWebDrafts(value: Record<string, InspectionDraft>) {
  if (typeof localStorage !== 'undefined') localStorage.setItem(webDraftsKey, JSON.stringify(value));
}

export function saveInspectionDraft(id: string, draft: InspectionDraft) {
  drafts.set(id, draft);
  void persistInspectionDraft(id, draft);
}

export function getInspectionDraft(id: string): InspectionDraft | undefined {
  return drafts.get(id);
}

export function clearInspectionDraft(id: string) {
  drafts.delete(id);
  void removePersistedInspectionDraft(id);
}

export async function hydrateInspectionDraft(id: string): Promise<InspectionDraft | undefined> {
  if (Platform.OS === 'web') {
    const draft = readWebDrafts()[id];
    if (draft) drafts.set(id, draft);
    return draft;
  }
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ content: string }>('SELECT content FROM inspection_drafts WHERE inspection_id = ?', id);
  if (!row) return undefined;
  const draft = JSON.parse(row.content) as InspectionDraft;
  drafts.set(id, draft);
  return draft;
}

async function persistInspectionDraft(id: string, draft: InspectionDraft) {
  if (Platform.OS === 'web') {
    writeWebDrafts({ ...readWebDrafts(), [id]: draft });
    return;
  }
  const database = await getDatabase();
  await database.runAsync('INSERT OR REPLACE INTO inspection_drafts (inspection_id, content, updated_at) VALUES (?, ?, ?)', id, JSON.stringify(draft), new Date().toISOString());
}

async function removePersistedInspectionDraft(id: string) {
  if (Platform.OS === 'web') {
    const draftsById = readWebDrafts();
    delete draftsById[id];
    writeWebDrafts(draftsById);
    return;
  }
  const database = await getDatabase();
  await database.runAsync('DELETE FROM inspection_drafts WHERE inspection_id = ?', id);
}

export async function enqueueInspectionForSync(inspectionId: string) {
  const operation: PendingOperation = { inspectionId, createdAt: new Date().toISOString() };
  if (Platform.OS === 'web') {
    const current = await getPendingOperations();
    const next = [...current.filter((item) => item.inspectionId !== inspectionId), operation];
    if (typeof localStorage !== 'undefined') localStorage.setItem(webOutboxKey, JSON.stringify(next));
    return;
  }
  const database = await getDatabase();
  await database.runAsync('INSERT OR REPLACE INTO sync_outbox (inspection_id, created_at) VALUES (?, ?)', operation.inspectionId, operation.createdAt);
}

export async function getPendingOperations(): Promise<PendingOperation[]> {
  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(webOutboxKey) ?? '[]') as PendingOperation[]; } catch { return []; }
  }
  const database = await getDatabase();
  return database.getAllAsync<PendingOperation>('SELECT inspection_id AS inspectionId, created_at AS createdAt FROM sync_outbox ORDER BY created_at DESC');
}
