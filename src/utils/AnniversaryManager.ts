/**
 * Anniversary Manager Utility
 * Handles anniversary date calculations and countdown logic
 */

interface AnniversaryContent {
  milestone: {
    name: string;
    date: string;
    daysUntil: number;
    percentage?: number;
    year?: number;
    type?: string;
  };
  daysUntil: number;
  isToday: boolean;
  date: {
    year: number;
    month: string;
    day: number;
    formatted: string;
  };
  celebration: 'active' | 'upcoming';
}

export class AnniversaryManager {
  private anniversaryDate: Date;

  constructor(anniversaryDate: string = '2025-05-10') {
    this.anniversaryDate = new Date(anniversaryDate);
  }

  /**
   * Get the number of days until the anniversary
   * @returns {number} Days until anniversary (negative if past)
   */
  getDaysUntilAnniversary(): number {
    const today = new Date();
    const timeDiff = this.anniversaryDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Get a formatted countdown string
   * @returns {string} Formatted countdown message
   */
  getCountdownMessage(): string {
    const days = this.getDaysUntilAnniversary();

    if (days > 0) {
      return `${days} days until our anniversary! 💕`;
    } else if (days === 0) {
      return 'Happy Anniversary! Today is our special day! 🎉';
    } else {
      const yearsPassed = Math.floor(Math.abs(days) / 365);
      if (yearsPassed > 0) {
        return `Celebrating ${yearsPassed} year${yearsPassed > 1 ? 's' : ''} of marriage! ❤️`;
      } else {
        return `${Math.abs(days)} days since our wedding day! 💖`;
      }
    }
  }

  /**
   * Check if today is the anniversary
   * @returns {boolean} True if today is the anniversary
   */
  isAnniversaryToday(): boolean {
    return this.getDaysUntilAnniversary() === 0;
  }

  /**
   * Get anniversary year
   * @returns {number} The year of the anniversary
   */
  getAnniversaryYear(): number {
    return this.anniversaryDate.getFullYear();
  }

  /**
   * Get anniversary month
   * @returns {string} The month name of the anniversary
   */
  getAnniversaryMonth(): string {
    return this.anniversaryDate.toLocaleDateString('en-US', { month: 'long' });
  }

  /**
   * Get anniversary day
   * @returns {number} The day of the month of the anniversary
   */
  getAnniversaryDay(): number {
    return this.anniversaryDate.getDate();
  }

  /**
   * Generate anniversary content for display
   * @returns {AnniversaryContent} Anniversary content data
   */
  generateAnniversaryContent(): AnniversaryContent {
    const daysUntil = this.getDaysUntilAnniversary();
    const year = this.getAnniversaryYear();
    const month = this.getAnniversaryMonth();
    const day = this.getAnniversaryDay();

    return {
      milestone: {
        name: this.getCountdownMessage(),
        date: `${month} ${day}, ${year}`,
        daysUntil: daysUntil,
        type: daysUntil <= 0 ? 'anniversary' : 'countdown',
      },
      daysUntil: daysUntil,
      isToday: this.isAnniversaryToday(),
      date: {
        year: year,
        month: month,
        day: day,
        formatted: `${month} ${day}, ${year}`,
      },
      celebration: daysUntil <= 0 ? 'active' : 'upcoming',
    };
  }
}
export default AnniversaryManager;
