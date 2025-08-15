import getDbPromise from '../config/firestore.js';

class GuestbookEntry {
  constructor(data) {
    this.name = data.name || 'Anonymous';
    this.message = data.message;
    this.timestamp = data.timestamp || new Date();
  }

  // Validate the data
  static validate(data) {
    const errors = [];

    if (!data.message || data.message.trim().length === 0) {
      errors.push('A message is required to sign the guestbook.');
    }

    if (data.message && data.message.length > 500) {
      errors.push('Message cannot exceed 500 characters.');
    }

    return errors;
  }

  // Save to Firestore
  async save() {
    const errors = GuestbookEntry.validate(this);
    if (errors.length > 0) {
      throw new Error(errors.join(' '));
    }

    const db = await getDbPromise();
    const docRef = await db.collection('guestbookEntries').add({
      name: this.name,
      message: this.message.trim(),
      timestamp: this.timestamp,
    });

    this.id = docRef.id;
    return this;
  }

  // Get all entries
  static async findAll() {
    const db = await getDbPromise();
    const snapshot = await db.collection('guestbookEntries').orderBy('timestamp', 'desc').get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Find by ID
  static async findById(id) {
    const db = await getDbPromise();
    const doc = await db.collection('guestbookEntries').doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    };
  }

  // Delete entry
  static async deleteById(id) {
    const db = await getDbPromise();
    await db.collection('guestbookEntries').doc(id).delete();
    return true;
  }
}

export default GuestbookEntry;
