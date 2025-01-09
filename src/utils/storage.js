export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Initial mock data
export const initialMockData = {
  clients: Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `Client ${index + 1}`,
    phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    email: `client${index + 1}@example.com`,
    tags: ['VIP', 'Active', 'New'].slice(0, Math.floor(Math.random() * 3) + 1),
    lastMessageDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    totalMessages: Math.floor(Math.random() * 100),
  })),
  
  campaigns: Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    name: `Campaign ${index + 1}`,
    status: ['active', 'scheduled', 'completed', 'draft'][Math.floor(Math.random() * 4)],
    type: ['promotional', 'transactional', 'reminder'][Math.floor(Math.random() * 3)],
    targetType: ['specific', 'group', 'custom'][Math.floor(Math.random() * 3)],
    scheduledDate: new Date(Date.now() + Math.random() * 604800000).toISOString(),
    progress: Math.floor(Math.random() * 100),
    totalRecipients: Math.floor(Math.random() * 1000) + 100,
    sentMessages: Math.floor(Math.random() * 800),
    deliveryRate: Math.floor(Math.random() * 20) + 80,
  })),

  availableTags: ['VIP', 'Active', 'New', 'Premium'],
  
  templates: [
    {
      id: 1,
      name: 'Welcome Message',
      messageType: 'text',
      content: 'Hello <name>, welcome to our service!',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Payment Reminder',
      messageType: 'text',
      content: 'Dear <name>, your payment of <amount> is due on <date>.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Special Offer',
      messageType: 'image',
      content: 'Check out our special offer!',
      caption: 'Limited time offer',
      file: 'https://via.placeholder.com/400x300',
      createdAt: new Date().toISOString(),
    },
  ],
}; 

export const initializeStorageData = () => {
  const keys = ['clients', 'campaigns', 'availableTags', 'templates'];
  
  // Check if initialization is needed
  const needsInit = !localStorage.getItem('initialized');
  
  if (needsInit) {
    keys.forEach(key => {
      localStorage.setItem(key, JSON.stringify(initialMockData[key]));
    });
    localStorage.setItem('initialized', 'true');
  }
}; 

export const resetStorageToMock = () => {
  const keys = ['clients', 'campaigns', 'availableTags', 'templates'];
  keys.forEach(key => {
    localStorage.setItem(key, JSON.stringify(initialMockData[key]));
  });
  localStorage.setItem('initialized', 'true');
}; 

// Add this function to clear all data
export const clearStorage = () => {
  const keys = ['clients', 'campaigns', 'availableTags', 'templates', 'initialized'];
  keys.forEach(key => localStorage.removeItem(key));
}; 