export const siteConfig = {
  name: 'The UrbanMaali',
  tagline: 'Bring Nature Home',
  description: 'Your urban gardening and plant-care partner for homes, societies, offices and more. Local maalis. Nursery partners. Simple booking.',
  phone: '+91 98765 43210',
  phoneDisplay: '+91 98765 43210',
  whatsappNumber: '919876543210',
  email: 'hello@urbanmaali.com',
  address: 'Noida Extension, Delhi NCR — 201308',
  workingHours: 'Mon – Sun: 7:00 AM – 7:00 PM',
  navLinks: [
    { label: 'Services', href: '/services' },
    { label: 'Plans', href: '/plans' },
    { label: 'Shop', href: '/shop' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'About', href: '/about' },
    { label: 'Partner', href: '/partner' },
    { label: 'Contact', href: '/contact' },
  ],
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cancellation & Refund', href: '/cancellation-refund' },
    { label: 'Service Terms', href: '/service-terms' },
  ]
};

export function getWhatsAppUrl(customMessage?: string): string {
  const defaultText = "Hi UrbanMaali, I'd like to enquire about a gardening or plant-care service. My location is: ____. Service required: ____. Preferred date and time: ____. Please share availability and pricing.";
  const msg = customMessage || defaultText;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}
