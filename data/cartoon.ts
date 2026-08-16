import { tmdbCartoonVideos } from "./tmdb-generated";

export interface Video {
  id: string;
  title: string;
  slug: string;
  videoUrl: string;
  downloadUrl: string;
  poster: string;
  description: string;
  seoDescription?: string;
  category: string;
  year: number;
  duration: string;
  rating: number;
  genre: string[];
  language: string;
  quality: string;
  featured?: boolean;
  director?: string;
  cast?: string[];
  keywords?: string[];
}

/* ---------------- SLUG HELPER ---------------- */

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ---------------- CARTOON DATA ---------------- */

export const cartoonVideos: Video[] = [
  ...tmdbCartoonVideos,
  {
    id: "9001",
    title: "The Super Mario Galaxy Movie (2026)",
    slug: generateSlug("The Super Mario Galaxy Movie 2026"), "videoUrl": "https://youtu.be/GuCejewteF8",
    "downloadUrl": "https://t.me/onemoviedownloa/87", "poster": "https://image.tmdb.org/t/p/w780/5G2nS4dw5bFp3I8S8WpCdtb3o7I.jpg",
    description: "In the film, Mario and Luigi and their friends adventure into outer space, where they face off against Bowser and his son Bowser Jr. to save Princess Rosalina, the adoptive mother of the Lumas. Princess Peach discovers she has the same powers as Rosalina, her long-lost older sister, and they were both born from stardust.",
    seoDescription: "Watch The Super Mario Galaxy Movie (2026) online. Mario, Luigi, and Princess Peach embark on an adventure across the galaxy to save Rosalina from Bowser Jr. A sequel to the 2023 hit, filled with action, comedy, and family fun.",
    category: "Cartoon",
    year: 2026,
    duration: "1h 38m",
    rating: 8.8,
    genre: ["Animation", "Kids & Family", "Action", "Adventure", "Comedy"],
    language: "Hindi",
    quality: "HD",
    director: "Aaron Horvath, Michael Jelenic",
    cast: ["Chris Pratt", "Anya Taylor-Joy", "Charlie Day", "Jack Black", "Brie Larson"],
    keywords: ["mario", "super mario", "galaxy", "nintendo", "illumination", "animated movie", "cartoon"]
  }
,
  {
    id: "9002",
    title: "Captain Underpants: The First Epic Movie (2026) - Animated Comedy",
    slug: generateSlug("Captain Underpants The First Epic Movie 2026"), "videoUrl": "https://youtu.be/placeholder_captain",
    "downloadUrl": "https://t.me/onemoviedownloa/94", "poster": "https://image.tmdb.org/t/p/w780/uwpj2LRIJ23iP9pA5zro3fKq33p.jpg",
    description: "Captain Underpants: The First Epic Movie (2026) एक बेहद ही मजेदार और हंसा-हंसा कर लोटपोट कर देने वाली एनिमेटेड सुपरहीरो कॉमेडी फिल्म है। यह फिल्म जॉर्ज और हैरोल्ड नाम के दो चौथी कक्षा के छात्रों की कहानी है, जो पक्के दोस्त हैं और अपनी कल्पनाओं से कॉमिक बुक्स बनाना पसंद करते हैं। उनका स्कूल का प्रिंसिपल, मिस्टर क्रुप, एक बेहद खड़ूस और सख्त इंसान है जो उनकी शरारतों से परेशान होकर उन्हें अलग-अलग क्लास में डालने की धमकी देता है। बचने के लिए, जॉर्ज और हैरोल्ड गलती से मिस्टर क्रुप को सम्मोहित (Hypnotize) कर देते हैं और उसे यह यकीन दिला देते हैं कि वह कोई और नहीं, बल्कि उनकी कॉमिक बुक का हीरो 'कैप्टन अंडरपैंट्स' (Captain Underpants) है! यह हीरो सिर्फ एक चड्डी और लाल केप पहनकर स्कूल में हाहाकार मचा देता है। जब एक दुष्ट वैज्ञानिक 'प्रोफेसर पूपीपैंट्स' स्कूल में आतंक फैलाने आता है, तो इन दोनों बच्चों और कैप्टन अंडरपैंट्स को मिलकर उसका सामना करना पड़ता है।",
    category: "Cartoon",
    year: 2026,
    duration: "1h 29m",
    rating: 8.0,
    genre: ["Animation", "Comedy", "Kids & Family"],
    language: "Hindi",
    quality: "HD"
  },
  {
    id: "9003",
    title: "Robinson Crusoe (2016) - Animated Adventure Comedy",
    slug: generateSlug("Robinson Crusoe 2016 Animated Adventure Comedy"), "videoUrl": "https://youtu.be/placeholder_robinson",
    "downloadUrl": "https://t.me/onemoviedownloa/95", "poster": "https://image.tmdb.org/t/p/w780/2k27fJtA3CgnbBAdGkkdchTzSjS.jpg",
    description: "Robinson Crusoe (2016), जिसे 'The Wild Life' के नाम से भी जाना जाता है, एक शानदार 3डी एनिमेटेड एडवेंचर फिल्म है, जो डैनियल डेफो के क्लासिक उपन्यास की कहानी को जानवरों के नजरिए से दिखाती है। एक छोटे से विदेशी और सुंदर द्वीप पर 'ट्यूसडे' नाम का एक बातूनी तोता और उसके अन्य अतरंगी जानवर दोस्त अपनी शांत जिंदगी जी रहे हैं। ट्यूसडे हमेशा दुनिया को देखने और नई चीजें खोजने के सपने देखता है। एक दिन भयानक समुद्री तूफान के बाद द्वीप पर एक अजीब सा प्राणी बहकर आता है—इंसान, जिसका नाम रॉबिन्सन क्रूसो है! जानवरों को शुरुआत में यह इंसान अजीब लगता है, लेकिन जल्द ही वे दोस्त बन जाते हैं। रॉबिन्सन क्रूसो को भी द्वीप पर जिंदा रहने के लिए इन जानवरों की मदद की जरूरत होती है। उनकी शांत दुनिया में तब खतरा मंडराता है जब दो दुष्ट और चालाक बिल्लियां उस द्वीप पर कब्जा करने की कोशिश करती हैं। रॉबिन्सन और उसके नए जानवर दोस्तों को मिलकर अपने इस खूबसूरत स्वर्ग की रक्षा करनी होती है।",
    category: "Cartoon",
    year: 2016,
    duration: "1h 30m",
    rating: 7.0,
    genre: ["Animation", "Comedy", "Adventure", "Kids & Family"],
    language: "Hindi",
    quality: "HD"
  },
  {
    id: "9004",
    title: "Migration (2023) - Animated Adventure Comedy",
    slug: generateSlug("Migration 2023 Animated Adventure Comedy"), "videoUrl": "https://youtu.be/placeholder_migration",
    "downloadUrl": "https://t.me/onemoviedownloa/96", "poster": "https://image.tmdb.org/t/p/w780/ldfCF9RhR40mppcgu22S2s4T1wA.jpg",
    description: "Migration (2023) इल्युमिनेशन (Illumination) स्टूडियोज की एक दिल छू लेने वाली और मजेदार एनिमेटेड एडवेंचर फिल्म है। कहानी मल्लार्ड (Mallard) बत्तखों के एक प्यारे से परिवार की है। पिता 'मैक' एक बेहद डरा हुआ और ओवरप्रोटेक्टिव पिता है, जो अपने परिवार को न्यू इंग्लैंड के एक सुरक्षित तालाब में ही पूरी जिंदगी रखना चाहता है। लेकिन उसकी पत्नी 'पैम' दुनिया घूमना चाहती है और अपने बच्चों—टीनेजर बेटे डैक्स और छोटी बेटी ग्वेन—को कुछ नया दिखाना चाहती है। जब कुछ प्रवासी बत्तखें उनके तालाब पर आती हैं और जमैका की खूबसूरत कहानियां सुनाती हैं, तो पैम मैक को जमैका की यात्रा के लिए मना लेती है। यह बत्तख परिवार अपने जीवन की पहली बड़ी 'माइग्रेशन' (उड़ान) पर निकलता है। लेकिन उनका रास्ता सीधा नहीं है! वे गलती से न्यूयॉर्क के बीचों-बीच पहुँच जाते हैं। न्यूयॉर्क शहर के खतरों, अजीब पक्षियों, और इंसानों के बीच से होते हुए जमैका पहुँचने की यह यात्रा बेहद रोमांचक, हास्यपूर्ण और उनके परिवार को एक-दूसरे के और करीब लाने वाली साबित होती है।",
    category: "Cartoon",
    year: 2023,
    duration: "1h 23m",
    rating: 7.8,
    genre: ["Animation", "Comedy", "Adventure", "Kids & Family"],
    language: "Hindi",
    quality: "HD"
  },
  {
    id: "9005",
    title: "Shin Jigen! Crayon Shin-chan The Movie (2023) - Anime Comedy",
    slug: generateSlug("Shin Jigen Crayon Shin chan The Movie 2023"), "videoUrl": "https://youtu.be/placeholder_shinchan",
    "downloadUrl": "https://t.me/onemoviedownloa/97", "poster": "https://image.tmdb.org/t/p/w780/x2y51hmLzFj2jsjX2yV52j3JgS.jpg",
    description: "Shin Jigen! Crayon Shin-chan The Movie (2023) लोकप्रिय जापानी मांगा और एनीमे सीरीज 'क्रेयॉन शिन-चैन' की एक शानदार और पहली 3D CG एनिमेटेड फिल्म है। कहानी की शुरुआत अंतरिक्ष से आने वाली दो रहस्यमयी रोशनियों—एक सफेद और एक काली—से होती है। सफेद रोशनी का तेज नन्हें और शरारती शिन-चैन (Shinnosuke) पर पड़ता है, जिससे उसे जादुई और अलौकिक 'टेलीकाइनेटिक' (Telekinetic) शक्तियां मिल जाती हैं। अब शिन-चैन अपने दिमाग की शक्ति से चीजों को हवा में उड़ा सकता है। वहीं दूसरी ओर, काली रोशनी का असर 'मित्सुरु हिरिया' नाम के एक निराश और दुखी इंसान पर पड़ता है, जो समाज से नफरत करता है। हिरिया को डार्क पावर्स मिल जाती हैं और वह ठान लेता है कि वह पूरी दुनिया और जापान को तबाह कर देगा। जब पूरी दुनिया खौफ में होती है, तो दुनिया को बचाने की जिम्मेदारी शिन-चैन और उसके अजीबोगरीब परिवार पर आ जाती है। क्या अपनी शरारतों के लिए मशहूर शिन-चैन एक सुपरहीरो बनकर दुनिया को इस डार्क मैजिक से बचा पाएगा? यह फिल्म एक्शन, फुल-ऑन कॉमेडी और 3डी एनिमेशन का एक बेहतरीन डोज है।",
    category: "Cartoon",
    year: 2023,
    duration: "1h 34m",
    rating: 8.2,
    genre: ["Animation", "Comedy", "Anime", "Adventure"],
    language: "Hindi",
    quality: "HD"
  }
  ,
  {
    id: "9007",
    title: "Minions & Monsters (2026) - Animated Short Film",
    slug: generateSlug("Minions & Monsters (2026) - Animated Short Film"),
    "videoUrl": "https://youtu.be/V-O-uBaHk3c",
    "downloadUrl": "https://t.me/onemoviedownloa/205",
    "poster": "https://m.media-amazon.com/images/M/MV5BYzBjMDg4YjctYzg3ZS00ZDFmLWI1YjctM2RkZGVjZWEyYWQ0XkEyXkFqcGc@._V1_FMjpg_UY5000_.jpg",
    "description": "Minions & Monsters (2026) एक मजेदार और छोटी एनिमेटेड फिल्म है, जो 'मिनियंस' फ्रेंचाइजी का हिस्सा है। इस शॉर्ट फिल्म में, एक नया और अनुभवहीन मिनियन एक फैंटेसी रोल-प्लेइंग गेम (जैसे डंजन्स एंड ड्रैगन्स) में शामिल होता है। जब वह गलती से एक जादुई क्रिस्टल को छू लेता है, तो ঵ह ঔर উसকे साथी मिनিয়ंस सचमुच উस গেম की দুনিয়া मেঁ পহুঁচ জাতে হয় এবং খতরনাক মোন্স্টার্স (রাক্ষসগণ) মেঁ বদল জাতে হয়। অবশ্যই উনি যা पতা লাগানা হয়কি, વે અપની નવી અને અજીબ શક્તિ કેવી રીતે ઉપયોગ કરવામાં આવે અને વળતરામાં અપની અસળી દુનિયામાં કેવી રીતે લઈવરહતક? യി ഫില്മ മിനിയൻസ് കൊണ്ടുള്ള ക്ലാസിക് ശരാരത്തുകളും കോമെഡിയുമായി പൂരിപ്പിച്ചത്.",
    category: "Cartoon",
    year: 2021,
    duration: "4m",
    rating: 6.5,
    genre: ["Animation", "Comedy", "Short", "Family"],
    language: "English",
    quality: "HD"
  }
,
  {
    id: "9009",
    title: "The Super Mario Bros. Movie 2 (2026)",
    slug: generateSlug("The Super Mario Bros. Movie 2 (2026)"),
    videoUrl: "https://youtu.be/GuCejewteF8",
    downloadUrl: "https://t.me/onemoviedownloa/201",
    poster: "https://m.media-amazon.com/images/M/MV5BNGFiMTU5N2ItY2I5Mi00MjYxLWIzYjYtZDIzYmY3ZDBiNTEyXkEyXkFqcGc@._V1_FMjpg_UX1080_.jpg",
    description: "The Super Mario Bros. Movie 2 (2026) इल्युमिनेशन और निन्टेंडो की ब्लॉकबस्टर एनिमेटेड फिल्म की बहुप्रतीक्षित अगली कड़ी है। पहली फिल्म के अंत में ब्रुकलिन में योशी के अंडे के दिखने के बाद, यह फिल्म मारियो और लुइगी को एक नए और रोमांचक एडवेंचर पर ले जाती है। इस बार, मशरूम किंगडम को एक और भी बड़े खतरे का सामना करना पड़ता है, और हमारे हीरो को अपने नए दोस्त योशी के साथ मिलकर इस मुसीबत से लड़ना होगा। फिल्म में और भी अधिक पावर-अप्स, नए वर्ल्ड्स और क्लासिक मारियो गेम्स के कई पसंदीदा किरदारों के आने की उम्मीद है। यह फिल्म एक्शन, कॉमेडी और पूरे परिवार के लिए एक मजेदार अनुभव होने का वादा करती है।",
    category: "Cartoon",
    year: 2026,
    duration: "1h 35m",
    rating: 8.5,
    genre: ["Animation", "Adventure", "Comedy", "Family"],
    language: "English",
    quality: "HD"
  }
,
  {
    "id": "9010",
    "title": "Toy Story 5 (2026) - Animated Family Adventure",
    "slug": generateSlug("Toy Story 5 (2026) - Animated Family Adventure"),
    "videoUrl": "https://youtu.be/c51ND9Hdbw0",
    "downloadUrl": "https://t.me/onemoviedownloa/193",
    "poster": "https://m.media-amazon.com/images/M/MV5BZTI1YTBiNmEtYWUxZi00YzFkLWIzNjMtMmZjMmY2NzM0ZWMzXkEyXkFqcGc@._V1_FMjpg_UX1086_.jpg",
    "description": "Toy Story 5 (2026) पिक्सर की सबसे प्रिय और प्रतिष्ठित एनिमेटेड फ्रेंचाइजी की एक और दिल छू लेने वाली और मजेदार वापसी है। इस बार, वुडी, बज़ लाइटइयर और उनके सभी खिलौने दोस्त एक नई और आधुनिक चुनौती का सामना कर रहे हैं। उनके बच्चे अब बड़े हो रहे हैं और उनका ध्यान पारंपरिक खिलौनों से हटकर वीडियो गेम्स, टैबलेट्स और स्मार्ट डिवाइसेस की ओर जा रहा है। जब घर में 'लिलीप্যাড' (Lilypad) नाम का एक नया, हाई-टेक और आकर्षक स्मार्ट टैबलेट आता है, तो पुराने खिलौनों को यह डर सताने लगता है कि कहीं वे हमेशा के लिए भुला न दिए जाएं। अपनी प्रासंगिकता (relevance) बनाए रखने और अपने बच्चे के प्यार को वापस पाने के लिए, वुडी और बज़ एक साहसिक योजना बनाते हैं। वे डिजिटल दुनिया में प्रवेश करने और यह साबित करने का फैसला करते हैं कि असली मज़ा स्क्रीन पर नहीं, बल्कि कल्पना और दोस्ती में है। 'Toy Story 5' एक बार फिर से दोस्ती, वफादारी और बदलते समय के साथ खुद को ढालने की एक खूबसूरत कहानी है।",
    "category": "Cartoon",
    "year": 2026,
    "duration": "1h 42m",
    "rating": 9.3,
    "genre": ["Animation", "Adventure", "Comedy", "Family"],
    "language": "English",
    "quality": "HD",
    "cast": ["Tom Hanks", "Tim Allen"]
  },
  {
    "id": "9011",
    "title": "Moana (2016) - Animated Adventure",
    "slug": generateSlug("Moana (2016) - Animated Adventure"),
    "videoUrl": "https://youtu.be/EEz5xbzYPKI",
    "downloadUrl": "https://t.me/onemoviedownloa/247",
    "poster": "https://m.media-amazon.com/images/M/MV5BMjI4MzU5NTExNF5BMl5BanBnXkFtZTgwNzY1MTEwMDI@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    "description": "Moana (2016) डिज्नी की एक एनिमेटेड म्यूजिकल एडवेंचर फिल्म है। कहानी मोआना नाम की एक साहसी किशोरी की है, जिसे उसके लोगों को बचाने के लिए एक साहसी मिशन पर समुद्र द्वारा चुना जाता है। अपनी यात्रा के दौरान, मोआना शक्तिशाली डेमीगॉड माउई से मिलती है, जो एक मास्टर वे फाइंडर बनने की उसकी तलाश में उसका मार्गदर्शन करता है। वे एक साथ खुले समुद्र में एक एक्शन से भरपूर यात्रा पर निकलते हैं। [9, 13, 17, 21, 22, 24, 27, 29, 43, 47, 55, 57]",
    "category": "Cartoon",
    "year": 2016,
    "duration": "1h 47m",
    "rating": 7.6,
    "genre": ["Animation", "Adventure", "Comedy", "Family", "Fantasy", "Musical"],
    "language": "English",
    "quality": "HD",
    "cast": ["Auliʻi Cravalho", "Dwayne Johnson", "Rachel House"]
  }
];
