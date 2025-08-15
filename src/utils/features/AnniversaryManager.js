#!/usr/bin/env node

/**
 * 🎊 Anniversary & Milestone Manager
 * Automated anniversary celebrations and milestone tracking
 */

class AnniversaryManager {
  constructor() {
    this.weddingDate = new Date('2025-06-14'); // Your actual wedding date
    this.milestones = {
      monthly: [1, 6, 12], // months
      yearly: [1, 2, 5, 10, 25, 50], // years
      special: [
        { days: 100, name: '100 Days Married' },
        { days: 365, name: 'First Year Complete' },
        { days: 1000, name: '1000 Days of Love' },
      ],
    };
  }

  getUpcomingMilestones() {
    const now = new Date();
    const daysSinceWedding = Math.floor((now - this.weddingDate) / (1000 * 60 * 60 * 24));

    const upcoming = [];

    // Check special day milestones
    this.milestones.special.forEach((milestone) => {
      if (daysSinceWedding < milestone.days) {
        const daysUntil = milestone.days - daysSinceWedding;
        upcoming.push({
          type: 'special',
          name: milestone.name,
          daysUntil,
          date: new Date(this.weddingDate.getTime() + milestone.days * 24 * 60 * 60 * 1000),
        });
      }
    });

    return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
  }

  generateAnniversaryContent() {
    const milestones = this.getUpcomingMilestones();
    const nextMilestone = milestones[0];

    if (!nextMilestone) return null;

    return {
      milestone: nextMilestone,
      countdownWidget: this.createCountdownWidget(nextMilestone),
      socialShareText: `Austin & Jordyn are ${nextMilestone.daysUntil} days away from ${nextMilestone.name}! 💕`,
      emailTemplate: this.createEmailTemplate(nextMilestone),
    };
  }

  createCountdownWidget(milestone) {
    return {
      title: `Days Until ${milestone.name}`,
      daysLeft: milestone.daysUntil,
      percentage: ((1000 - milestone.daysUntil) / 1000) * 100,
      inspirationalQuote: this.getRandomQuote(),
    };
  }

  getRandomQuote() {
    const quotes = [
      'Every love story is beautiful, but ours is my favorite.',
      'Together is a wonderful place to be.',
      'Love grows more tremendously full, swift, poignant, as the years multiply.',
      'The best thing to hold onto in life is each other.',
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  createEmailTemplate(milestone) {
    return {
      subject: `${milestone.name} is Coming Up! 🎊`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B7A8A; text-align: center;">Austin & Jordyn</h1>
          <h2 style="color: #D4A574;">Milestone Approaching!</h2>
          <p>We're just <strong>${milestone.daysUntil} days</strong> away from ${milestone.name}!</p>
          <p>Visit our memory site to see new photos and leave anniversary wishes:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.theporadas.com" style="background: #8B7A8A; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px;">Visit Our Memory Site</a>
          </div>
        </div>
      `,
    };
  }
}

export default AnniversaryManager;
