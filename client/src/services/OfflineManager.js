import { openDB } from 'idb';

const DB_NAME = 'gamelearn-offline';
const STORE_NAME = 'sync-queue';

export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};

export const queueForSync = async (action, data) => {
    const db = await initDB();
    await db.add(STORE_NAME, {
        action,
        data,
        timestamp: Date.now()
    });
    console.log(`[OfflineManager] Queued ${action} for sync.`);
};

export const processSyncQueue = async (syncFunction) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const items = await store.getAll();

    if (items.length === 0) return;

    console.log(`[OfflineManager] Syncing ${items.length} items...`);

    for (const item of items) {
        try {
            await syncFunction(item.action, item.data);
            await store.delete(item.id);
        } catch (error) {
            console.error(`[OfflineManager] Failed to sync item ${item.id}:`, error);
            // Keep in queue for next attempt
        }
    }

    await tx.done;
    console.log('[OfflineManager] Sync complete.');
};
