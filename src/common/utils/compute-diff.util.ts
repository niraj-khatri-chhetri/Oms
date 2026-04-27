/**
 * Diff two arrays of entities and determine which items to create, update, or delete.
 *
 * This utility is typically used for syncing nested relational data
 * (e.g. phones, emails, contacts) during update operations.
 *
 * Rules:
 * - Items WITH an `id` are treated as existing → candidates for update
 * - Items WITHOUT an `id` are treated as new → candidates for creation
 * - Existing items NOT present in incoming array → candidates for deletion
 *
 * @template T - Must include optional `id` field
 *
 * @param existing - Current items from database
 * @param incoming - Items received from client (DTO)
 *
 * @returns Object containing:
 *  - toCreate: new items to insert
 *  - toUpdate: existing items to update
 *  - toDelete: items to remove
 *
 * @example
 * const result = computeDiff(
 *   [{ id: '1', value: 'A' }, { id: '2', value: 'B' }],
 *   [{ id: '1', value: 'A updated' }, { value: 'C' }]
 * );
 *
 * // result:
 * // {
 * //   toCreate: [{ value: 'C' }],
 * //   toUpdate: [{ id: '1', value: 'A updated' }],
 * //   toDelete: [{ id: '2', value: 'B' }]
 * // }
 */
export function computeDiff<T extends { id?: string }>(existing: T[], incoming: T[]) {
  const toCreate: T[] = [];
  const toUpdate: T[] = [];
  const toDelete: T[] = [];

  const existingMap = new Map(existing.map((item) => [item.id, item]));

  for (const item of incoming) {
    if (item.id) {
      toUpdate.push(item);
      existingMap.delete(item.id);
    } else {
      toCreate.push(item);
    }
  }

  toDelete.push(...existingMap.values());

  return { toCreate, toUpdate, toDelete };
}
