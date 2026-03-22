/**
 * A high-performance FIFO queue implemented with a circular buffer.
 *
 * Characteristics:
 * - O(1) enqueue/dequeue
 * - Amortized O(1) resize
 * - Avoids Array.shift() cost
 * - Capacity grows and shrinks dynamically based on usage
 * - Shrinking uses a threshold to avoid excessive resizing
 *
 * Note:
 * - Capacity grows dynamically
 * - Consider using maxCapacity in long-running systems
 */
export class Queue<T> {
  private static readonly SHRINK_THRESHOLD = 0.25; // Shrink when length is <= 25% of capacity
  private static readonly MIN_CAPACITY = 16; // Don't shrink below this capacity

  private _buffer: (T | undefined)[];
  private _head: number = 0;
  private _tail: number = 0;
  private _size: number = 0;
  private _maxCapacity: number = Number.POSITIVE_INFINITY;

  /**
   * Create a new Queue instance with an optional initial capacity. The default capacity is 16.
   * @param capacity The initial capacity of the queue. Must be greater than 0.
   * @throws {Error} Error if the capacity is less than or equal to 0.
   */
  constructor(initialCapacity: number = 16, maxCapacity?: number) {
    // Max capacity validation
    if (maxCapacity !== undefined) {
      if (maxCapacity <= 0) {
        throw new Error('Max capacity must be greater than 0');
      }
      if (maxCapacity < initialCapacity) {
        throw new Error(
          'Max capacity must be greater than or equal to initial capacity',
        );
      }
    }
    this._maxCapacity = maxCapacity ?? Number.POSITIVE_INFINITY;

    // Initialize the internal buffer and state
    this.resetBuffer(initialCapacity);
  }

  /**
   * Get the number of items in the queue.
   */
  size(): number {
    return this._size;
  }

  /**
   * Get the current capacity of the internal buffer.
   */
  capacity(): number {
    return this._buffer.length;
  }

  /**
   * Check if the queue is empty.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Add an item to the end of the queue. If the internal buffer is full, it will be resized to accommodate more items.
   * @param item The item to be added to the queue.
   * @throws {QueueOverflowError} Error if adding the item would exceed the max capacity of the queue.
   */
  enqueue(item: T): void {
    // Check max capacity before adding new item
    if (this.size() >= this._maxCapacity) {
      throw new QueueOverflowError('Queue is at maximum capacity');
    }

    // Resize if the buffer is full
    if (this.size() === this.capacity()) {
      this.resize(Math.min(this.capacity() * 2, this._maxCapacity));
    }

    this._buffer[this._tail] = item;
    this._tail = (this._tail + 1) % this._buffer.length;
    this._size++;
  }

  /**
   * Remove and return the item at the front of the queue. If the queue is empty, undefined will be returned.
   * @returns The item at the front of the queue or undefined if the queue is empty.
   */
  dequeue(): T | undefined {
    // Return undefined if the queue is empty
    if (this.isEmpty()) {
      return undefined;
    }

    const item = this._buffer[this._head];
    this._buffer[this._head] = undefined; // Clear reference for garbage collection
    this._head = (this._head + 1) % this._buffer.length;
    this._size--;

    this.maybeShrink();

    return item as T; // Type assertion is safe here because we check for empty queue above
  }

  /**
   * Return the item at the front of the queue without removing it. If the queue is empty, undefined will be returned.
   * @returns The item at the front of the queue or undefined if the queue is empty.
   */
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this._buffer[this._head];
  }

  /**
   * Clear all items from the queue and reset its state.
   */
  clear(): void {
    this.resetBuffer(this.capacity());
  }

  /**
   * Ensure that the internal buffer has enough capacity to accommodate a specified number of additional items.
   * If the current capacity is insufficient, the buffer will be resized to accommodate the new items.
   * @param additional The number of additional items to accommodate.
   */
  reserve(additional: number = 0): void {
    this.resize(Math.min(this.size() + additional, this._maxCapacity));
  }

  /**
   * Resize the internal buffer to a new capacity.
   * This method is called internally when the buffer is full and needs to be expanded.
   * @param capacity The new capacity for the internal buffer. Must be greater than the current buffer size.
   * @throws {QueueOverflowError} Error if the new capacity is less than or equal to the current queue size or exceeds the max capacity.
   */
  private resize(capacity: number): void {
    if (capacity <= this.size()) {
      throw new QueueOverflowError(
        'Capacity must be greater than the current queue size',
      );
    }
    if (capacity > this._maxCapacity) {
      throw new QueueOverflowError('Capacity exceeds max capacity');
    }

    const newBuffer = new Array<T | undefined>(capacity);
    for (let i = 0; i < this._size; i++) {
      newBuffer[i] = this._buffer[(this._head + i) % this._buffer.length];
    }

    this._buffer = newBuffer;
    this._head = 0;
    this._tail = this._size;
  }

  /**
   * Reset the internal buffer to a new capacity and clear all items from the queue.
   * This method is used internally to clear the queue and reset its state.
   * @param capacity The capacity for the internal buffer. Must be greater than 0.
   * @throws {QueueOverflowError} Error if the capacity is less than or equal to 0.
   */
  private resetBuffer(capacity: number): void {
    if (capacity <= 0) {
      throw new QueueOverflowError('Capacity must be greater than 0');
    }

    this._buffer = new Array<T | undefined>(capacity);
    this._head = 0;
    this._tail = 0;
    this._size = 0;
  }

  /**
   * Check if the internal buffer can be shrunk to save memory.
   * If the number of items in the queue is less than or equal to a certain threshold of the buffer capacity, the buffer will be resized to half its current capacity.
   */
  private maybeShrink(): void {
    const capacity = this.capacity();
    if (capacity <= Queue.MIN_CAPACITY) return;

    if (this._size <= capacity * Queue.SHRINK_THRESHOLD) {
      const newCapacity = Math.max(
        Math.floor(capacity / 2),
        this._size,
        Queue.MIN_CAPACITY,
      );
      this.resize(newCapacity);
    }
  }
}

export class QueueOverflowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QueueOverflowError';
  }
}
