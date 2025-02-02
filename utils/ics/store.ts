"use client"

import { CalendarItem } from "./interfaces";
import stores from "@/utils/databases.json";

const DB_NAME = "AnimeCalUser";
const STORE_NAME = process.env.NEXT_PUBLIC_STORE_CALENDAR as string;
const DB_VERSION = 1;

// Initialize DB only on client side
const initializeDB = async (): Promise<IDBDatabase> => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
        throw new Error('IndexedDB is only available in browser environments');
    }

    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = request.result;

            stores.data.forEach((storeConfig) => {
                if (!db.objectStoreNames.contains(storeConfig.name)) {
                    const store = db.createObjectStore(
                        storeConfig.name,
                        { keyPath: storeConfig.keyPath.name, autoIncrement: storeConfig.keyPath.autoincrement }
                    );
                    storeConfig.indexes.forEach((index) => {
                        store.createIndex(index.name, index.keyPath, index.options);
                    });
                }
            });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Create a singleton promise for the database connection
let dbPromise: Promise<IDBDatabase> | null = null;

export const getDB = () => {
    if (!dbPromise) {
        dbPromise = initializeDB().catch((error) => {
            // Reset the promise if initialization fails
            dbPromise = null;
            throw error;
        });
    }
    return dbPromise;
};

export const addIcsItem = async (item: string): Promise<number> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add({
            data: item,
            timestamp: new Date(),
        });

        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject(request.error);
    });
};

export const deleteIcsItem = async (id: number): Promise<boolean> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(false);
    });
};

export const getIcsItem = async (id: number): Promise<CalendarItem> => {  // Changed from Promise<object>
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result as CalendarItem);  // Add type assertion
        request.onerror = () => reject(request.error);
    });
};

export const getAllIcsItems = async (): Promise<CalendarItem[]> => {  // Changed from Promise<object[]>
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result as CalendarItem[]);  // Add type assertion
        request.onerror = () => reject(request.error);
    });
};


export const updateIcsItem = async (id: number, newData: string): Promise<void> => {
    const db = await getDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({
            id,
            data: newData,
            timestamp: new Date()
        });

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};
