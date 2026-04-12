export class Storage {
  static async get<T>(key: string): Promise<T | undefined> {
    return chayns.storage.get(key) as Promise<T | undefined>;
  }

  static async set<T>(key: string, value: T): Promise<void> {
    return chayns.storage.set(key, value);
  }

  static async remove<T extends { id: string }>(key: string, id: string): Promise<void> {
    const list = (await Storage.get<T[]>(key)) ?? [];
    const updated = list.filter((entry) => entry.id !== id);
    await Storage.set(key, updated);
  }

  static async add<T extends { id: string }>(key: string, item: T): Promise<T> {
    const list = (await Storage.get<T[]>(key)) ?? [];
    const updated = [...list, item];
    await Storage.set(key, updated);
    return item;
  }

  static async update<T extends { id: string }>(key: string, item: T): Promise<T> {
    const list = (await Storage.get<T[]>(key)) ?? [];
    const updated = list.map((entry) => (entry.id === item.id ? item : entry));
    await Storage.set(key, updated);
    return item;
  }
}
