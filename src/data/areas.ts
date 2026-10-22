export type AreaStatus = 'available' | 'coming_soon' | 'not_served';

export interface AreaCheckResult {
  pincode: string;
  status: AreaStatus;
  locality?: string;
  message: string;
}

export const activePincodes: Record<string, string> = {
  '201301': 'Noida Sector 1 to Sector 18',
  '201304': 'Noida Sector 93 & Expressways',
  '201305': 'Noida Sector 128 / Wish Town',
  '201306': 'Greater Noida West / TechZone 4',
  '201308': 'Noida Extension / Gaur City',
  '201309': 'Greater Noida Pari Chowk',
  '201310': 'Greater Noida Alpha & Beta',
};

export const comingSoonPincodes: Record<string, string> = {
  '110091': 'Mayur Vihar Phase 1, Delhi',
  '110092': 'Mayur Vihar Phase 2, Delhi',
  '110096': 'Mayur Vihar Phase 3 & Vasundhara Enclave',
  '201010': 'Indirapuram, Ghaziabad',
  '201012': 'Vaishali, Ghaziabad',
  '201014': 'Kaushambi, Ghaziabad',
  '201016': 'Raj Nagar Extension, Ghaziabad',
};

export function checkPincodeStatus(pincode: string): AreaCheckResult {
  const cleanPin = pincode.trim();
  if (activePincodes[cleanPin]) {
    return {
      pincode: cleanPin,
      status: 'available',
      locality: activePincodes[cleanPin],
      message: 'Good news! We serve your area with local maali visits and plant deliveries.'
    };
  }
  if (comingSoonPincodes[cleanPin]) {
    return {
      pincode: cleanPin,
      status: 'coming_soon',
      locality: comingSoonPincodes[cleanPin],
      message: "We're expanding here soon! Join our priority waitlist for early access."
    };
  }
  return {
    pincode: cleanPin,
    status: 'not_served',
    message: "We don't serve this pincode yet, but we are expanding rapidly across Delhi NCR."
  };
}
