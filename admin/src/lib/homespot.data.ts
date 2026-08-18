export interface Property {
  id: string
  title: string
  location: string
  price: number
  period: string
  bedrooms: number
  bathrooms: number
  area: number
  type: string
  status: 'Available' | 'Rented' | 'Coming Soon' | 'Under Maintenance'
  verified: boolean
  rating: number
  reviews: number
  images: string[]
  amenities: string[]
  tags: string[]
  description: string
  safetyScore: number
  landlord: {
    name: string
    avatar: string
    rating: number
    responseTime: string
    verified: boolean
    properties: number
  }
}

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern 2BR Apartment in Westlands',
    location: 'Westlands, Nairobi',
    price: 85000,
    period: 'month',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    type: 'Apartment',
    status: 'Available',
    verified: true,
    rating: 4.8,
    reviews: 120,
    images: [
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Modern+luxury+apartment+living+room+with+large+windows+minimalist+design+natural+lighting+high+quality+photography&image_size=landscape_16_9',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Modern+bedroom+with+king+bed+floor+to+ceiling+windows+city+view+warm+lighting&image_size=landscape_16_9',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Luxury+apartment+kitchen+with+island+stainless+steel+appliances+marble+countertops&image_size=landscape_16_9',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Modern+bathroom+with+walk+in+shower+freestanding+tub+marble+tiles+gold+fixtures&image_size=landscape_16_9',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Rooftop+swimming+pool+overlooking+city+skyline+sunset+luxury+building&image_size=landscape_16_9',
    ],
    amenities: ['WiFi', 'Gym', 'Parking', '24/7 Security', 'Backup Generator', 'Swimming Pool', 'Furnished', 'Elevator'],
    tags: ['Family Friendly', 'Pet Friendly'],
    description: 'Beautiful modern apartment in the heart of Westlands. Close to shopping malls, restaurants and transport. Includes gym, backup generator and 24/7 security.',
    safetyScore: 92,
    landlord: {
      name: 'John Mwangi',
      avatar: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional+african+man+portrait+headshot+smiling+business+attire+clean+background&image_size=square',
      rating: 4.9,
      responseTime: 'Within 2 hours',
      verified: true,
      properties: 12,
    },
  },
  {
    id: '2',
    title: 'Luxury 3BR Apartment',
    location: 'Kilimani, Nairobi',
    price: 120000,
    period: 'month',
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    type: 'Apartment',
    status: 'Available',
    verified: true,
    rating: 4.9,
    reviews: 89,
    images: [
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Luxury+penthouse+living+room+floor+to+ceiling+windows+modern+furniture+sunset+view&image_size=landscape_16_9',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Luxury+master+bedroom+with+ensuite+bathroom+walk+in+closet+designer+lighting&image_size=landscape_16_9',
    ],
    amenities: ['WiFi', 'Gym', 'Parking', '24/7 Security', 'Backup Generator', 'Swimming Pool'],
    tags: ['Luxury', 'Family Friendly'],
    description: 'Stunning luxury apartment with panoramic views.',
    safetyScore: 95,
    landlord: {
      name: 'Mary Wangui',
      avatar: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional+african+woman+portrait+headshot+smiling+elegant+business+attire&image_size=square',
      rating: 5.0,
      responseTime: 'Within 1 hour',
      verified: true,
      properties: 8,
    },
  },
  {
    id: '3',
    title: 'Studio Apartment',
    location: 'Kileleshwa, Nairobi',
    price: 45000,
    period: 'month',
    bedrooms: 0,
    bathrooms: 1,
    area: 45,
    type: 'Studio',
    status: 'Available',
    verified: true,
    rating: 4.6,
    reviews: 56,
    images: [
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Cozy+studio+apartment+open+plan+living+sleeping+area+modern+minimalist+decor&image_size=landscape_16_9',
    ],
    amenities: ['WiFi', 'Parking', '24/7 Security'],
    tags: ['Student Only', 'Digital Nomad'],
    description: 'Cozy studio perfect for students and young professionals.',
    safetyScore: 88,
    landlord: {
      name: 'David Ochieng',
      avatar: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Friendly+african+young+man+portrait+casual+smart+attire+natural+smile&image_size=square',
      rating: 4.7,
      responseTime: 'Within 3 hours',
      verified: true,
      properties: 15,
    },
  },
  {
    id: '4',
    title: 'Executive 4BR House',
    location: 'Karen, Nairobi',
    price: 250000,
    period: 'month',
    bedrooms: 4,
    bathrooms: 4,
    area: 400,
    type: 'House',
    status: 'Available',
    verified: true,
    rating: 5.0,
    reviews: 34,
    images: [
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Executive+villa+exterior+modern+design+large+garden+swimming+pool+sunny+day&image_size=landscape_16_9',
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Grand+entrance+foyer+double+height+ceiling+chandelier+marble+floors&image_size=landscape_16_9',
    ],
    amenities: ['WiFi', 'Gym', 'Parking', '24/7 Security', 'Backup Generator', 'Swimming Pool', 'Garden', 'Domestic Quarters'],
    tags: ['Luxury', 'Family Friendly'],
    description: 'Executive house in quiet Karen neighborhood with large compound.',
    safetyScore: 98,
    landlord: {
      name: 'Grace Njeri',
      avatar: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Elegant+middle+aged+african+woman+portrait+businesswoman+confident+smile&image_size=square',
      rating: 4.9,
      responseTime: 'Within 2 hours',
      verified: true,
      properties: 5,
    },
  },
]

export interface Conversation {
  id: string
  user: {
    name: string
    avatar: string
    lastSeen: string
    online: boolean
  }
  property: {
    title: string
    location: string
    price: number
  }
  lastMessage: string
  lastTime: string
  unread: number
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    user: {
      name: 'John Mwangi',
      avatar: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional+african+man+portrait+headshot+smiling+business+attire+clean+background&image_size=square',
      lastSeen: 'Online',
      online: true,
    },
    property: {
      title: 'Modern 2BR Apartment',
      location: 'Westlands, Nairobi',
      price: 85000,
    },
    lastMessage: 'Yes, it is still available! Are you available for a viewing tomorrow?',
    lastTime: '2 min',
    unread: 2,
  },
  {
    id: '2',
    user: {
      name: 'Mary Wangui',
      avatar: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Professional+african+woman+portrait+headshot+smiling+elegant+business+attire&image_size=square',
      lastSeen: '15 min ago',
      online: false,
    },
    property: {
      title: 'Luxury 3BR Apartment',
      location: 'Kilimani, Nairobi',
      price: 120000,
    },
    lastMessage: 'Thanks for the tour! Loved the place.',
    lastTime: '15 min',
    unread: 0,
  },
  {
    id: '3',
    user: {
      name: 'David Ochieng',
      avatar: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Friendly+african+young+man+portrait+casual+smart+attire+natural+smile&image_size=square',
      lastSeen: '30 min ago',
      online: false,
    },
    property: {
      title: 'Studio Apartment',
      location: 'Kileleshwa, Nairobi',
      price: 45000,
    },
    lastMessage: 'Deposit can be paid in 2 installments',
    lastTime: '30 min',
    unread: 1,
  },
]

export interface Message {
  id: string
  sender: 'me' | 'them'
  text: string
  time: string
  read?: boolean
}

export const MESSAGES: Message[] = [
  { id: '1', sender: 'them', text: 'Hi Daniel! I see you\'re interested in my apartment.', time: '10:02 AM' },
  { id: '2', sender: 'me', text: 'Yes, it looks amazing! Is it still available?', time: '10:05 AM', read: true },
  { id: '3', sender: 'them', text: 'Yes, it is still available! Are you available for a viewing tomorrow at 11 AM or 2 PM?', time: '10:08 AM' },
  { id: '4', sender: 'me', text: 'Tomorrow at 11 AM works perfectly for me!', time: '10:10 AM', read: true },
  { id: '5', sender: 'them', text: "Let's do 11 AM tomorrow. I'll send the exact location and a QR code for check-in.", time: '10:12 AM' },
  { id: '6', sender: 'them', text: 'Also, rent is KES 85,000/month with a 2-month deposit required before move-in. Utilities are separate.', time: '10:13 AM' },
  { id: '7', sender: 'me', text: 'Perfect, that works with my budget. Are utilities included in any package?', time: '10:15 AM', read: true },
]

export const ADMIN_STATS = {
  totalRevenue: 3240000,
  revenueChange: 12.5,
  verifiedProperties: 1248,
  propertiesChange: 38.6,
  activeUsers: 24856,
  usersChange: 8.2,
  qrScans: 45231,
  qrChange: 22.1,
  propertyViews: 78623,
  viewsChange: 14.3,
  totalBookings: 24,
  bookingsChange: 12.5,
  activeBookings: 5,
  activeBookingsChange: 8.2,
  savedProperties: 18,
  savedChange: 16.6,
  monthlySpending: 240000,
  spendingChange: 18.6,
}

export const ESCROW_STEPS = [
  { title: 'Tenant Deposit', desc: 'KES 170,000 deposited', date: 'May 15, 2026', time: '10:05 AM', status: 'done' },
  { title: 'Funds Secured', desc: 'Held in escrow', date: 'May 15, 2026', time: '10:06 AM', status: 'done' },
  { title: 'Property Verified', desc: 'Admin verified listing', date: 'May 16, 2026', time: '9:22 AM', status: 'done' },
  { title: 'Viewing Completed', desc: 'Tenant inspected the property', date: 'May 17, 2026', time: '11:30 AM', status: 'current' },
  { title: 'Release to Landlord', desc: 'Funds released successfully', date: 'May 19, 2026', time: '—', status: 'pending' },
]

export const COMMUNITY_POSTS = [
  {
    id: '1',
    author: 'Grace Wanjiru',
    avatar: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Young+african+woman+portrait+casual+friendly+smile+natural+light&image_size=square',
    time: '2 hours ago',
    neighborhood: 'Westlands, Nairobi',
    text: 'Amazing sunset from my apartment balcony! Love the neighborhood 🌅',
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Beautiful+sunset+over+city+neighborhood+apartment+balcony+view+warm+orange+purple+sky&image_size=landscape_16_9',
    likes: 124,
    comments: 18,
    shares: 6,
  },
  {
    id: '2',
    author: 'David Kimani',
    avatar: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Young+african+man+portrait+casual+tshirt+friendly+smile&image_size=square',
    time: '5 hours ago',
    neighborhood: 'Kilimani, Nairobi',
    text: 'Looking for a roommate to share a 2BR apartment near Yaya Centre. Budget KES 35K. DM me if interested!',
    image: null,
    likes: 42,
    comments: 8,
    shares: 2,
  },
]

export const formatKES = (n: number) => {
  return 'KES ' + n.toLocaleString('en-KE')
}
