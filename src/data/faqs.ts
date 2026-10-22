export interface FAQItem {
  question: string;
  answer: string;
}

export const homeFAQs: FAQItem[] = [
  {
    question: 'How do you assign a maali to my home?',
    answer: 'We map your pincode to trained local maalis stationed nearby in your sector. They arrive with basic gardening tools and organic enrichment kits at your requested time slot.'
  },
  {
    question: 'Do I need to provide tools, pots, or fertilizers?',
    answer: 'Our maalis carry pruning shears, trowels, sprayers, and basic soil tools. For regular maintenance, standard compost or basic nutrients are applied. If you need new pots or specific decorative soil mixes, you can order them directly from our Shop or note it in your booking request.'
  },
  {
    question: 'What is the pricing for societies and offices?',
    answer: 'Society and commercial office maintenance is customized based on total landscape square footage, lawn areas, and frequency (weekly or monthly). Submit a quote request through our site or contact us on WhatsApp for an on-site audit.'
  },
  {
    question: 'What if I need to reschedule or cancel a visit?',
    answer: 'We understand schedules change! You can reschedule or cancel at no charge by messaging us on WhatsApp up to 4 hours before your scheduled appointment slot.'
  }
];
