import getDbPromise from '../config/firestore.js';

class Photo {
  constructor(data) {
    this.filename = data.filename;
    this.filepath = data.filepath;
    this.mimetype = data.mimetype;
    this.webpPath = data.webpPath;
    this.webpMimetype = data.webpMimetype;
    this.jpegPath = data.jpegPath;
    this.jpegMimetype = data.jpegMimetype;
    this.uploadedBy = data.uploadedBy || 'Anonymous Guest';
    this.approved = data.approved || false;
    this.timestamp = data.timestamp || new Date();
  }

  // Validate the data
  static validate(data) {
    const errors = [];

    if (!data.filename) {
      errors.push('Filename is required.');
    }

    if (!data.filepath) {
      errors.push('Filepath is required.');
    }

    if (!data.mimetype) {
      errors.push('Mimetype is required.');
    }

    return errors;
  }

  // Save to Firestore
  async save() {
    const errors = Photo.validate(this);
    if (errors.length > 0) {
      throw new Error(errors.join(' '));
    }

    const db = await getDbPromise();
    const docRef = await db.collection('photos').add({
      filename: this.filename,
      filepath: this.filepath,
      mimetype: this.mimetype,
      webpPath: this.webpPath,
      webpMimetype: this.webpMimetype,
      jpegPath: this.jpegPath,
      jpegMimetype: this.jpegMimetype,
      uploadedBy: this.uploadedBy,
      approved: this.approved,
      timestamp: this.timestamp,
    });

    this.id = docRef.id;
    return this;
  }

  // Get all approved photos
  static async findApproved() {
    const db = await getDbPromise();
    const snapshot = await db
      .collection('photos')
      .where('approved', '==', true)
      .orderBy('timestamp', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Get all photos (for admin)
  static async findAll() {
    const db = await getDbPromise();
    const snapshot = await db.collection('photos').orderBy('timestamp', 'desc').get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Find by ID
  static async findById(id) {
    const db = await getDbPromise();
    const doc = await db.collection('photos').doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data(),
    };
  }

  // Update approval status
  static async updateApproval(id, approved) {
    const db = await getDbPromise();
    await db.collection('photos').doc(id).update({ approved });
    return true;
  }

  // Delete photo
  static async deleteById(id) {
    const db = await getDbPromise();
    await db.collection('photos').doc(id).delete();

    return true;
  }
}

export default Photo;
