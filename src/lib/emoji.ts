type EmojiEntry = {
  emoji: string;
  keywords: string[];
  animation: "bounce" | "wiggle" | "pulse" | "spin" | "wave";
};

const EMOJI_MAP: EmojiEntry[] = [
  // Specific fruits
  { emoji: "🍎", keywords: ["apple"], animation: "wiggle" },
  { emoji: "🍌", keywords: ["banana"], animation: "wiggle" },
  { emoji: "🍊", keywords: ["orange", "tangerine", "clementine", "mandarin"], animation: "wiggle" },
  { emoji: "🍋", keywords: ["lemon", "lime"], animation: "wiggle" },
  { emoji: "🍇", keywords: ["grape"], animation: "wiggle" },
  { emoji: "🍓", keywords: ["strawberr", "berries", "berry"], animation: "wiggle" },
  { emoji: "🍑", keywords: ["peach", "nectarine"], animation: "wiggle" },
  { emoji: "🍍", keywords: ["pineapple"], animation: "wiggle" },
  { emoji: "🥭", keywords: ["mango"], animation: "wiggle" },
  { emoji: "🍉", keywords: ["watermelon", "melon"], animation: "wiggle" },
  { emoji: "🥝", keywords: ["kiwi"], animation: "wiggle" },
  { emoji: "🫐", keywords: ["blueberr"], animation: "wiggle" },
  { emoji: "🍒", keywords: ["cherr"], animation: "wiggle" },
  { emoji: "🥥", keywords: ["coconut"], animation: "wiggle" },
  { emoji: "🍐", keywords: ["pear"], animation: "wiggle" },
  { emoji: "🥑", keywords: ["avocado", "guacamole"], animation: "wiggle" },

  // Specific vegetables
  { emoji: "🥔", keywords: ["potato", "potatoes", "fries", "french fries"], animation: "wiggle" },
  { emoji: "🍅", keywords: ["tomato", "tomatoes", "ketchup"], animation: "wiggle" },
  { emoji: "🥕", keywords: ["carrot"], animation: "wiggle" },
  { emoji: "🌽", keywords: ["corn"], animation: "wiggle" },
  { emoji: "🥦", keywords: ["broccoli"], animation: "wiggle" },
  { emoji: "🥬", keywords: ["lettuce", "cabbage", "spinach", "kale", "greens"], animation: "wiggle" },
  { emoji: "🧅", keywords: ["onion"], animation: "wiggle" },
  { emoji: "🧄", keywords: ["garlic"], animation: "wiggle" },
  { emoji: "🥒", keywords: ["cucumber", "pickle", "zucchini"], animation: "wiggle" },
  { emoji: "🌶️", keywords: ["pepper", "chili", "jalapeno", "spicy"], animation: "wiggle" },
  { emoji: "🍄", keywords: ["mushroom"], animation: "wiggle" },
  { emoji: "🫑", keywords: ["bell pepper", "capsicum"], animation: "wiggle" },
  { emoji: "🍆", keywords: ["eggplant", "aubergine"], animation: "wiggle" },
  { emoji: "🫘", keywords: ["bean", "lentil", "chickpea"], animation: "wiggle" },

  // Specific proteins & dairy
  { emoji: "🥩", keywords: ["steak", "beef", "meat"], animation: "wiggle" },
  { emoji: "🍗", keywords: ["chicken", "poultry", "wing", "thigh", "drumstick"], animation: "wiggle" },
  { emoji: "🥓", keywords: ["bacon"], animation: "wiggle" },
  { emoji: "🌭", keywords: ["hot dog", "hotdog", "sausage"], animation: "wiggle" },
  { emoji: "🐟", keywords: ["fish", "salmon", "tuna", "cod", "seafood", "shrimp", "prawn"], animation: "wave" },
  { emoji: "🥚", keywords: ["egg", "eggs"], animation: "wiggle" },
  { emoji: "🧀", keywords: ["cheese"], animation: "wiggle" },
  { emoji: "🥛", keywords: ["milk", "dairy", "cream"], animation: "bounce" },
  { emoji: "🧈", keywords: ["butter"], animation: "wiggle" },
  { emoji: "🫙", keywords: ["yogurt", "yoghurt"], animation: "wiggle" },

  // Bread & grains
  { emoji: "🍞", keywords: ["bread", "toast", "loaf", "baguette"], animation: "wiggle" },
  { emoji: "🥐", keywords: ["croissant", "pastry", "pastries"], animation: "wiggle" },
  { emoji: "🍚", keywords: ["rice"], animation: "wiggle" },
  { emoji: "🍝", keywords: ["pasta", "spaghetti", "noodle", "macaroni", "penne", "linguine"], animation: "wiggle" },
  { emoji: "🥜", keywords: ["peanut", "almond", "walnut", "cashew", "nuts"], animation: "wiggle" },
  { emoji: "🥣", keywords: ["cereal", "oat", "oatmeal", "granola", "porridge"], animation: "wiggle" },

  // Prepared foods & meals
  { emoji: "🍕", keywords: ["pizza"], animation: "wiggle" },
  { emoji: "🍔", keywords: ["burger", "hamburger", "mcdonalds"], animation: "wiggle" },
  { emoji: "🌮", keywords: ["taco", "tortilla", "burrito", "quesadilla", "mexican"], animation: "wiggle" },
  { emoji: "🍜", keywords: ["soup", "ramen", "pho", "broth", "stew", "chili con"], animation: "wiggle" },
  { emoji: "🍣", keywords: ["sushi", "sashimi"], animation: "wiggle" },
  { emoji: "🥪", keywords: ["sandwich", "sub", "wrap"], animation: "wiggle" },
  { emoji: "🥗", keywords: ["salad"], animation: "wiggle" },
  { emoji: "🥘", keywords: ["curry", "casserole", "stir fry"], animation: "wiggle" },
  { emoji: "🍳", keywords: ["breakfast", "brunch", "cook", "cooking", "recipe", "fry", "scramble"], animation: "wiggle" },
  { emoji: "🍽️", keywords: ["dinner", "lunch", "meal", "restaurant", "eat", "food", "dine"], animation: "wiggle" },

  // Drinks
  { emoji: "☕", keywords: ["coffee", "cafe", "latte", "espresso", "cappuccino"], animation: "pulse" },
  { emoji: "🍵", keywords: ["tea", "matcha", "chai", "herbal"], animation: "pulse" },
  { emoji: "🥤", keywords: ["smoothie", "juice", "soda", "pop", "coke", "pepsi"], animation: "bounce" },
  { emoji: "🍺", keywords: ["beer", "bar", "pub", "brewery", "ale", "ipa"], animation: "wiggle" },
  { emoji: "🍷", keywords: ["wine"], animation: "wiggle" },
  { emoji: "💧", keywords: ["water", "hydrat", "drink water"], animation: "bounce" },

  // Sweets & snacks
  { emoji: "🍫", keywords: ["chocolate", "candy", "sweets"], animation: "wiggle" },
  { emoji: "🍪", keywords: ["cookie", "cookies", "biscuit"], animation: "wiggle" },
  { emoji: "🍰", keywords: ["cake", "pie", "cheesecake", "cupcake"], animation: "pulse" },
  { emoji: "🍩", keywords: ["donut", "doughnut"], animation: "wiggle" },
  { emoji: "🍿", keywords: ["popcorn", "snack"], animation: "wiggle" },
  { emoji: "🍦", keywords: ["ice cream", "gelato", "sundae", "frozen yogurt"], animation: "wiggle" },
  { emoji: "🧁", keywords: ["muffin"], animation: "wiggle" },

  // Condiments & pantry
  { emoji: "🧂", keywords: ["salt", "seasoning", "spice"], animation: "wiggle" },
  { emoji: "🫒", keywords: ["olive", "oil"], animation: "wiggle" },
  { emoji: "🍯", keywords: ["honey", "syrup", "maple"], animation: "pulse" },
  { emoji: "🥫", keywords: ["can", "canned", "tomato sauce", "sauce", "soup can", "pantry"], animation: "wiggle" },

  // Shopping
  { emoji: "🛒", keywords: ["grocery", "groceries", "supermarket", "store", "shopping", "buy", "purchase", "pick up", "get from"], animation: "bounce" },
  { emoji: "🎂", keywords: ["birthday"], animation: "pulse" },

  // Work & Productivity
  { emoji: "💼", keywords: ["work", "office", "job", "career", "business"], animation: "bounce" },
  { emoji: "📧", keywords: ["email", "mail", "inbox", "message", "reply"], animation: "wave" },
  { emoji: "📞", keywords: ["call", "phone", "dial"], animation: "wiggle" },
  { emoji: "💻", keywords: ["code", "coding", "program", "develop", "software", "debug", "deploy"], animation: "pulse" },
  { emoji: "📊", keywords: ["report", "analytics", "data", "metrics", "presentation", "slides"], animation: "pulse" },
  { emoji: "📝", keywords: ["write", "draft", "document", "note", "notes", "blog", "article"], animation: "wave" },
  { emoji: "🤝", keywords: ["meeting", "standup", "sync", "1on1", "interview", "collaborate"], animation: "wave" },
  { emoji: "📋", keywords: ["review", "feedback", "approve", "checklist", "audit"], animation: "bounce" },
  { emoji: "🚀", keywords: ["launch", "release", "ship", "publish", "go live"], animation: "bounce" },
  { emoji: "🐛", keywords: ["bug", "issue", "ticket", "jira"], animation: "wiggle" },

  // Fitness & Health
  { emoji: "🏋️", keywords: ["gym", "workout", "exercise", "lift", "weights", "fitness"], animation: "bounce" },
  { emoji: "🏃", keywords: ["run", "running", "jog", "jogging", "cardio", "marathon"], animation: "bounce" },
  { emoji: "🧘", keywords: ["yoga", "meditat", "stretch", "mindful", "breathe"], animation: "pulse" },
  { emoji: "🚴", keywords: ["bike", "cycling", "bicycle"], animation: "bounce" },
  { emoji: "🏊", keywords: ["swim", "pool", "lap"], animation: "wave" },
  { emoji: "💊", keywords: ["medicine", "pill", "vitamin", "supplement", "prescription", "pharmacy", "doctor", "appointment"], animation: "pulse" },
  { emoji: "😴", keywords: ["sleep", "nap", "rest", "bedtime"], animation: "pulse" },
  { emoji: "🦷", keywords: ["dentist", "teeth", "dental", "floss", "brush teeth"], animation: "wiggle" },
  { emoji: "💇", keywords: ["haircut", "hair", "barber", "salon"], animation: "wiggle" },

  // Home & Chores
  { emoji: "🏠", keywords: ["home", "house", "apartment", "rent", "mortgage"], animation: "pulse" },
  { emoji: "🧹", keywords: ["clean", "cleaning", "vacuum", "mop", "tidy", "sweep", "dust"], animation: "wiggle" },
  { emoji: "🧺", keywords: ["laundry", "wash", "iron", "fold"], animation: "wiggle" },
  { emoji: "🍃", keywords: ["garden", "plant", "water plant", "lawn", "mow", "yard"], animation: "wave" },
  { emoji: "🔧", keywords: ["repair", "maintenance", "plumb", "install", "fix"], animation: "wiggle" },
  { emoji: "🛏️", keywords: ["bed", "bedroom", "sheets", "pillow"], animation: "pulse" },
  { emoji: "🗑️", keywords: ["trash", "garbage", "recycle", "waste", "throw away", "declutter"], animation: "bounce" },
  { emoji: "📦", keywords: ["pack", "move", "box", "storage", "organize", "shipping", "deliver"], animation: "bounce" },
  { emoji: "🧽", keywords: ["dish", "dishes", "scrub", "wipe", "sponge"], animation: "wiggle" },
  { emoji: "🪴", keywords: ["houseplant", "succulent", "flower", "bouquet"], animation: "wave" },
  { emoji: "🔨", keywords: ["build", "hammer", "nail", "shelf", "assemble", "ikea", "furniture"], animation: "bounce" },
  { emoji: "💡", keywords: ["lightbulb", "bulb", "lamp", "light"], animation: "pulse" },

  // Shopping & Finance
  { emoji: "💰", keywords: ["pay", "payment", "bill", "invoice", "money", "salary", "budget", "finance", "bank", "tax", "save money"], animation: "bounce" },
  { emoji: "💳", keywords: ["credit card", "debit", "subscribe", "subscription"], animation: "wiggle" },
  { emoji: "🎁", keywords: ["gift", "present", "surprise"], animation: "bounce" },
  { emoji: "👗", keywords: ["dress", "fashion", "outfit", "wear", "clothes"], animation: "wiggle" },
  { emoji: "👟", keywords: ["shoes", "sneaker", "boots"], animation: "bounce" },
  { emoji: "🧴", keywords: ["shampoo", "soap", "lotion", "skincare", "moistur", "sunscreen", "deodorant"], animation: "wiggle" },
  { emoji: "🪥", keywords: ["toothbrush", "toothpaste", "mouthwash"], animation: "wiggle" },
  { emoji: "🧻", keywords: ["toilet paper", "tissue", "paper towel", "napkin"], animation: "wiggle" },
  { emoji: "🧼", keywords: ["detergent", "bleach", "cleaner", "cleaning supplies"], animation: "wiggle" },

  // Travel & Transport
  { emoji: "✈️", keywords: ["flight", "fly", "airport", "travel", "trip", "vacation", "holiday"], animation: "bounce" },
  { emoji: "🚗", keywords: ["car", "drive", "gas", "fuel", "oil change", "tire", "mechanic", "parking"], animation: "bounce" },
  { emoji: "🚌", keywords: ["bus", "transit", "commute", "metro", "subway", "train"], animation: "bounce" },
  { emoji: "🏨", keywords: ["hotel", "booking", "reservation", "airbnb", "check in"], animation: "pulse" },
  { emoji: "🗺️", keywords: ["map", "direction", "navigate", "explore", "hike", "hiking", "trail"], animation: "wave" },
  { emoji: "⛺", keywords: ["camp", "camping", "tent", "outdoor"], animation: "wave" },
  { emoji: "🏖️", keywords: ["beach", "ocean", "sea", "surf", "sand"], animation: "wave" },
  { emoji: "⛽", keywords: ["petrol", "gasoline", "fill up", "refuel"], animation: "bounce" },
  { emoji: "🛫", keywords: ["passport", "visa", "boarding pass", "luggage", "suitcase"], animation: "bounce" },

  // Education & Learning
  { emoji: "📚", keywords: ["read", "book", "study", "learn", "course", "class", "lecture", "homework", "assignment"], animation: "pulse" },
  { emoji: "🎓", keywords: ["school", "university", "college", "graduat", "degree", "exam", "test"], animation: "bounce" },
  { emoji: "🔬", keywords: ["research", "experiment", "lab", "science"], animation: "pulse" },
  { emoji: "🎨", keywords: ["art", "paint", "draw", "sketch", "design", "creative"], animation: "wiggle" },
  { emoji: "🎵", keywords: ["music", "song", "playlist", "guitar", "piano", "band", "concert"], animation: "wave" },
  { emoji: "🎬", keywords: ["movie", "film", "watch", "netflix", "stream", "show", "series", "tv"], animation: "wiggle" },
  { emoji: "📰", keywords: ["news", "newspaper", "magazine", "journal"], animation: "wave" },

  // Social & Events
  { emoji: "🎉", keywords: ["party", "celebration", "event", "invite"], animation: "bounce" },
  { emoji: "🍻", keywords: ["happy hour", "hang out", "hangout", "get together"], animation: "wiggle" },
  { emoji: "📸", keywords: ["photo", "picture", "camera", "selfie"], animation: "bounce" },
  { emoji: "💌", keywords: ["letter", "card", "thank you", "rsvp", "invitation"], animation: "wave" },
  { emoji: "👶", keywords: ["baby", "kid", "child", "daycare", "school pickup", "pediatr"], animation: "bounce" },
  { emoji: "🐕", keywords: ["dog", "walk dog", "puppy", "groom", "kibble", "pet food"], animation: "bounce" },
  { emoji: "🐱", keywords: ["cat", "kitten", "litter"], animation: "wiggle" },
  { emoji: "🐾", keywords: ["pet", "vet", "animal"], animation: "bounce" },
  { emoji: "💐", keywords: ["anniversary", "date night", "romantic", "valentine"], animation: "pulse" },
  { emoji: "❤️", keywords: ["love"], animation: "pulse" },

  // Tech & Digital
  { emoji: "📱", keywords: ["app", "download", "update", "install", "phone setup"], animation: "wiggle" },
  { emoji: "🔑", keywords: ["password", "key", "lock", "security", "login", "account"], animation: "wiggle" },
  { emoji: "🔋", keywords: ["charge", "battery", "power"], animation: "pulse" },
  { emoji: "📶", keywords: ["wifi", "internet", "network", "connect"], animation: "pulse" },
  { emoji: "🖨️", keywords: ["print", "printer", "scan", "copy"], animation: "wiggle" },
  { emoji: "🎧", keywords: ["headphone", "earbuds", "airpods", "podcast", "audiobook"], animation: "pulse" },

  // Misc
  { emoji: "⏰", keywords: ["alarm", "reminder", "deadline", "schedule", "timer", "morning", "wake up"], animation: "wiggle" },
  { emoji: "✅", keywords: ["todo", "to do", "to-do", "complete", "finish", "done"], animation: "bounce" },
  { emoji: "⭐", keywords: ["important", "priority", "urgent", "critical", "star"], animation: "spin" },
  { emoji: "🎮", keywords: ["game", "gaming", "play", "xbox", "playstation", "nintendo", "steam"], animation: "wiggle" },
  { emoji: "🧾", keywords: ["receipt", "return", "refund", "warranty", "claim"], animation: "wave" },
  { emoji: "✉️", keywords: ["post", "postcard", "stamp", "envelope", "parcel"], animation: "wave" },
  { emoji: "🎒", keywords: ["backpack", "bag", "purse", "wallet"], animation: "bounce" },
  { emoji: "☂️", keywords: ["umbrella", "rain", "weather"], animation: "wiggle" },
  { emoji: "🕯️", keywords: ["candle", "incense"], animation: "pulse" },
  { emoji: "🧸", keywords: ["toy", "stuffed", "doll", "lego"], animation: "wiggle" },
];

export type EmojiAnimation = "bounce" | "wiggle" | "pulse" | "spin" | "wave" | "none";

export type EmojiMatch = {
  emoji: string;
  animation: EmojiAnimation;
};

const DEFAULT_LIST_EMOJI: EmojiMatch = { emoji: "📋", animation: "none" };
const DEFAULT_TASK_EMOJI: EmojiMatch = { emoji: "📌", animation: "none" };

export function matchEmoji(text: string, type: "list" | "task" = "task"): EmojiMatch {
  const lower = text.toLowerCase();

  for (const entry of EMOJI_MAP) {
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        return { emoji: entry.emoji, animation: entry.animation };
      }
    }
  }

  return type === "list" ? DEFAULT_LIST_EMOJI : DEFAULT_TASK_EMOJI;
}
