import getDbPromise from '../config/firestore.js';

class VisitorLog {
  constructor(data) {
    this.ip_address = data.ip_address;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.city = data.city;
    this.country = data.country;
    this.timestamp = data.timestamp || new Date();
  }

  // Validate the data
  static validate(data) {
    const errors = [];

    if (!data.ip_address) {
      errors.push('IP address is required.');
    }

    if (typeof data.latitude !== 'number') {
      errors.push('Latitude must be a number.');
    }

    if (typeof data.longitude !== 'number') {
      errors.push('Longitude must be a number.');
    }

    if (!data.city) {
      errors.push('City is required.');
    }

    if (!data.country) {
      errors.push('Country is required.');
    }

    return errors;
  }

  // Save to Firestore
  async save() {
    const errors = VisitorLog.validate(this);
    if (errors.length > 0) {
      throw new Error(errors.join(' '));
    }

    const db = await getDbPromise();
    const docRef = await db.collection('visitorLogs').add({
      ip_address: this.ip_address,
      latitude: this.latitude,
      longitude: this.longitude,
      city: this.city,
      country: this.country,
      timestamp: this.timestamp,
    });

    this.id = docRef.id;
    return this;
  }

  // Get all visitor logs
  static async findAll() {
    const db = await getDbPromise();
    const snapshot = await db.collection('visitorLogs').orderBy('timestamp', 'desc').get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Find by IP address
  static async findByIP(ip_address) {
    const db = await getDbPromise();
    const snapshot = await db
      .collection('visitorLogs')
      .where('ip_address', '==', ip_address)
      .orderBy('timestamp', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Get visitor stats
  static async getStats() {
    const db = await getDbPromise();
    const snapshot = await db.collection('visitorLogs').get();
    const logs = snapshot.docs.map((doc) => doc.data());

    const uniqueIPs = new Set(logs.map((log) => log.ip_address));
    const uniqueCountries = new Set(logs.map((log) => log.country));
    const uniqueCities = new Set(logs.map((log) => log.city));

    return {
      totalVisits: logs.length,
      uniqueVisitors: uniqueIPs.size,
      uniqueCountries: uniqueCountries.size,
      uniqueCities: uniqueCities.size,
      countries: Array.from(uniqueCountries),
      cities: Array.from(uniqueCities),
    };
  }

  // Delete by ID
  static async deleteById(id) {
    const db = await getDbPromise();
    await db.collection('visitorLogs').doc(id).delete();

    return true;
  }
}

export default VisitorLog;
