import { openDB } from "idb";
import apiClient from "../api/axios";

const DB_NAME = "laundrosaas-offline";
const DB_VERSION = 1;

interface QueuedMutation {
  id: string;
  endpoint: string;
  payload: unknown;
  createdAt: number;
  status: "pending" | "syncing" | "failed";
}

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("mutations")) {
        db.createObjectStore("mutations", { keyPath: "id" });
      }
    },
  });
}

export async function queueMutation(endpoint: string, payload: unknown) {
  const mutation: QueuedMutation = {
    id: crypto.randomUUID(),
    endpoint,
    payload,
    createdAt: Date.now(),
    status: "pending",
  };
  const db = await getDb();
  await db.put("mutations", mutation);
  return mutation;
}

export async function replayQueue() {
  const db = await getDb();
  const pending = await db.getAll("mutations");
  const sorted = pending.filter((m) => m.status === "pending").sort((a, b) => a.createdAt - b.createdAt);

  for (const mutation of sorted) {
    try {
      await db.put("mutations", { ...mutation, status: "syncing" });
      await apiClient.post(mutation.endpoint, mutation.payload, {
        headers: { "Idempotency-Key": mutation.id },
      });
      await db.delete("mutations", mutation.id);
    } catch {
      await db.put("mutations", { ...mutation, status: "failed" });
    }
  }
}
