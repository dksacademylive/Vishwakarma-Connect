export interface FounderInfo {
  name: string;
  designation: string;
  photo: string;
  salutation: string;
  message: string;
  quote: string;
  tenure: string;
}

export interface MissionVision {
  mission: {
    title: string;
    statement: string;
    pillars: { title: string; desc: string; icon: string }[];
  };
  vision: {
    title: string;
    statement: string;
    milestones: { year: string; target: string }[];
  };
}

export interface TeamMember {
  id: string;
  name: string;
  postHi: string;
  postEn: string;
  city: string;
  state: string;
  photo: string;
  bio: string;
  phone?: string;
  email?: string;
}

export interface HallOfFamePerson {
  id: string;
  name: string;
  title: string;
  category: 'ancient' | 'modern' | 'art' | 'architecture' | 'engineering';
  era: string;
  photo: string;
  famousWorks: string[];
  honors: string[];
  shortBio: string;
}

export interface CommunityBlog {
  id: string;
  title: string;
  author: string;
  authorPost: string;
  date: string;
  readTime: string;
  category: string;
  coverImage: string;
  summary: string;
  content: string[];
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
  badge: string;
  color: string;
}

// 1. FOUNDER INFORMATION
export const FOUNDER_DATA: FounderInfo = {
  name: 'श्री धर्मेन्द्र कुमार शर्मा (विश्वकर्मा)',
  designation: 'संस्थापक एवं राष्ट्रीय मुख्य संरक्षक, अखिल भारतीय विश्वकर्मा समाज महासंघ',
  salutation: '॥ ॐ श्री विश्वकर्मणे नमः ॥',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
  message: `प्रिय विश्वकर्मा समाज बंधुओं, माताओं, बहनों एवं युवा साथियों,\n\nसृष्टि के आदि शिल्पी, ज्ञान और विज्ञान के अधिष्ठाता भगवान विश्वकर्मा के आशीर्वाद से हमारा समाज सनातन काल से राष्ट्र निर्माण की रीढ़ रहा है। चाहे द्वारका की भव्य नगरी हो, कोणार्क का सूर्य मंदिर या आधुनिक युग की गगनचुंबी अट्टालिकाएं व जटिल मशीनें—हमारे शिल्प, काष्ठ, पाषाण, धातु और अभियांत्रिकी ज्ञान ने सदा मानवता को आलोकित किया है।\n\nआज के इस डिजिटल और तकनीकी युग में हमारे शिल्पकार बंधुओं, प्रतिभाशाली छात्र-छात्राओं और युवाओं को एक सूत्र में पिरोकर आत्मनिर्भर बनाना, समाज की कन्याओं के विवाह हेतु सुरक्षित परिणय मंच प्रदान करना, तथा हमारे प्रामाणिक वैदिक ग्रंथों का संरक्षण करना ही इस मंच का एकमात्र ध्येय है।\n\nआइए, हम सब मिलकर अपने कुल-गौरव को संजोएं और विश्वकर्मा समाज को शिक्षा, व्यापार, शिल्प और राजनीति में शीर्ष पर स्थापित करें।`,
  quote: 'कर्म ही पूजा है, और शिल्पकर्म ही समस्त सृजन का आदि बीज है। जब तक समाज का अंतिम शिल्पी सुदृढ़ नहीं होगा, राष्ट्र सशक्त नहीं बन सकता।',
  tenure: 'संस्थापक संरक्षक · आजीवन सेवक',
};

// 2. MISSION & VISION
export const MISSION_VISION_DATA: MissionVision = {
  mission: {
    title: 'हमारा पावन संकल्प (Our Mission)',
    statement: 'विश्वकर्मा समाज के प्रत्येक शिल्पी, कारीगर, युवा, कन्या और परिवार को सामाजिक संवाद, उच्च शिक्षा, रोजगार, व्यवसाय और आधुनिक डिजिटल तकनीक के माध्यम से संगठित, स्वावलंबी और गरिमामय जीवन प्रदान करना।',
    pillars: [
      {
        title: 'शिल्प व उद्योग संवर्धन',
        desc: 'पारंपरिक काष्ठ, धातु, प्रस्तर, स्वर्णकार व इंजीनियरिंग शिल्पकारों को आधुनिक टूल्स, ब्रांडिंग और वैश्विक बाजार उपलब्ध कराना।',
        icon: 'Hammer',
      },
      {
        title: 'शिक्षा व छात्रवृत्ति कोष',
        desc: 'समाज के आर्थिक रूप से कमजोर मेधावी छात्र-छात्राओं को उच्च तकनीकी शिक्षा, मेडिकल व सिविल सेवा हेतु छात्रवृत्ति सहायता।',
        icon: 'GraduationCap',
      },
      {
        title: 'वैवाहिक मर्यादा व सुरक्षा',
        desc: 'सगोत्र विवाह निषेध व त्रिस्तरीय गोपनीयता (OTP सत्यापन व फोटो ब्लर) के साथ आदर्श पारिवारिक वैवाहिक संबंध मंच।',
        icon: 'HeartHandshake',
      },
      {
        title: 'तीर्थ व धरोहर संरक्षण',
        desc: 'देशभर में स्थित प्राचीन विश्वकर्मा मंदिरों, धर्मशालाओं व हस्तलिखित वैदिक पांडुलिपियों का संरक्षण व अध्ययन।',
        icon: 'Landmark',
      },
    ],
  },
  vision: {
    title: 'हमारी दूरदर्शिता (Our Vision)',
    statement: 'वर्ष 2030 तक भारत के 5 करोड़ विश्वकर्मा बंधुओं को एक डिजिटल मंच पर जोड़कर प्रत्येक जिले में विश्वकर्मा कौशल गुरुकुल, छात्रावास एवं सहायता केंद्र स्थापित करना।',
    milestones: [
      { year: '2026', target: 'संपूर्ण भारत में 5 लाख+ पंजीकृत डिजिटल पहचान पत्र (Samaj ID) एवं 10,000+ कारीगर निर्देशिका।' },
      { year: '2027', target: 'राज्य स्तर पर विश्वकर्मा बंधु सहायता कोष से 1000+ छात्रों को उच्च शिक्षा हेतु पूर्ण छात्रवृत्ति।' },
      { year: '2028', target: 'हर प्रमुख औद्योगिक केंद्र में आधुनिक CNC व 3D मॉडलिंग विश्वकर्मा शिल्प उत्कृष्टता केंद्र।' },
      { year: '2030', target: 'अंतरराष्ट्रीय स्तर पर सनातन भारतीय वास्तु व शिल्पकला का वैश्विक शिखर सम्मेलन व एक्सपो।' },
    ],
  },
};

// 3. TEAM MEMBERS WITH PHOTO & POST
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'ईं. रामगोपाल पांचाल',
    postHi: 'राष्ट्रीय अध्यक्ष',
    postEn: 'National President',
    city: 'अहमदाबाद',
    state: 'गुजरात',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
    bio: 'वरिष्ठ स्ट्रक्चरल इंजीनियर (32 वर्ष अनुभव), 150+ औद्योगिक परियोजनाओं के निर्माता एवं समाज संगठन के मार्गदर्शक।',
    phone: '+91 98250 11223',
    email: 'president@vishwakarmasamaj.org',
  },
  {
    id: 'tm-2',
    name: 'डॉ. कैलाश चंद्र जांगिड़',
    postHi: 'राष्ट्रीय कार्यकारी उपाध्यक्ष',
    postEn: 'Executive Vice President',
    city: 'जयपुर',
    state: 'राजस्थान',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    bio: 'संस्कृत व वैदिक वास्तु के प्रख्यात शोधकर्ता, पूर्व विभागाध्यक्ष, 5 से अधिक धर्मग्रंथों के भाष्यकार।',
    phone: '+91 94140 22334',
    email: 'kailash.jangid@vishwakarmasamaj.org',
  },
  {
    id: 'tm-3',
    name: 'श्रीमती सुनीता धीमान',
    postHi: 'राष्ट्रीय महिला मोर्चा अध्यक्षा',
    postEn: 'Women Wing President',
    city: 'चंडीगढ़',
    state: 'पंजाब',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    bio: 'समाज सेविका एवं बालिका शिक्षा प्रेरक, 1200+ कन्याओं के विवाह व कौशल प्रशिक्षण में अनुकरणीय योगदान।',
    phone: '+91 98140 77889',
    email: 'mahila@vishwakarmasamaj.org',
  },
  {
    id: 'tm-4',
    name: 'श्री राजेश कुमार स्वर्णकार',
    postHi: 'राष्ट्रीय महासचिव',
    postEn: 'General Secretary',
    city: 'मुंबई',
    state: 'महाराष्ट्र',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80',
    bio: 'प्रतिष्ठित आभूषण निर्यातक व उद्योगपति, अखिल भारतीय युवा संगठन समन्वय एवं सामाजिक एकता के सूत्रधार।',
    phone: '+91 98200 44556',
    email: 'general.sec@vishwakarmasamaj.org',
  },
  {
    id: 'tm-5',
    name: 'श्री महेंद्र पाल गजधर',
    postHi: 'राष्ट्रीय कोषाध्यक्ष',
    postEn: 'National Treasurer',
    city: 'इंदौर',
    state: 'मध्य प्रदेश',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    bio: 'चार्टर्ड एकाउंटेंट व वित्तीय रणनीतिकार, समाज सहायता कोष व पारदर्शी ऑडिट प्रबंधन के प्रभारी।',
    phone: '+91 98260 88990',
    email: 'treasurer@vishwakarmasamaj.org',
  },
  {
    id: 'tm-6',
    name: 'अधिवक्ता अशोक कुमार शर्मा',
    postHi: 'मुख्य विधिक सलाहकार',
    postEn: 'Chief Legal Counsel',
    city: 'नई दिल्ली',
    state: 'दिल्ली',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=80',
    bio: 'सर्वोच्च न्यायालय में वरिष्ठ अधिवक्ता, समाज की संपत्तियों, ट्रस्ट व संवैधानिक अधिकारों के रक्षक।',
    phone: '+91 98110 33445',
    email: 'legal@vishwakarmasamaj.org',
  },
];

// 4. VISHWAKARMA HALL OF FAME (गौरव विभूतियां)
export const HALL_OF_FAME_DATA: HallOfFamePerson[] = [
  {
    id: 'hof-1',
    name: 'पद्मभूषण राम वी. सुतार (Ram V. Sutar)',
    title: 'विश्वविख्यात मूर्तिकार एवं राष्ट्रशिल्पी',
    category: 'modern',
    era: 'आधुनिक काल (जन्म: 1925)',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    famousWorks: ['स्टैच्यू ऑफ यूनिटी (182 मीटर - विश्व की सबसे ऊंची प्रतिमा)', 'संसद भवन स्थित महात्मा गांधी प्रतिमा', 'अमृत अमृतसर शहीद स्मारक'],
    honors: ['पद्म भूषण (2016)', 'पद्म श्री (1999)', 'टैगोर सांस्कृतिक समरसता पुरस्कार'],
    shortBio: 'महाराष्ट्र के धुले जिले में काष्ठशिल्पी विश्वकर्मा परिवार में जन्मे राम सुतार जी ने भारतीय मूर्तिकला को विश्व के सर्वोच्च शिखर पर स्थापित किया है।',
  },
  {
    id: 'hof-2',
    name: 'पद्मश्री वी. गणपति स्थपति (V. Ganapati Sthapati)',
    title: 'पारंपरिक भारतीय द्रविण वास्तु महाशिल्पी',
    category: 'architecture',
    era: '1927 – 2011',
    photo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
    famousWorks: ['कन्याकुमारी में 133 फीट ऊंची तिरुवल्लुवर पाषाण प्रतिमा', 'हवाई हिंदू मोनास्टरी मंदिर', 'वास्तु विज्ञान रिसर्च फाउंडेशन'],
    honors: ['पद्म श्री (1990)', 'राष्ट्रीय शिल्प पुरस्कार', 'डॉक्टरेट मानद उपाधि'],
    shortBio: 'तंजावुर के प्रसिद्ध वास्तु शिल्प वंशज। आपने मयमतम् एवं मानसार के प्राचीन गणितीय सूत्रों को पुनर्जीवित कर विश्वभर में 600+ पाषाण मंदिरों का निर्माण किया।',
  },
  {
    id: 'hof-3',
    name: 'पद्मश्री नेक चंद सैनी (Nek Chand)',
    title: 'दूरदर्शी लोकशिल्पी व रॉक गार्डन निर्माता',
    category: 'art',
    era: '1924 – 2015',
    photo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    famousWorks: ['चंडीगढ़ का विश्वविख्यात 40 एकड़ रॉक गार्डन', 'औद्योगिक कचरे व चीनी मिट्टी से निर्मित 5000+ मूर्तियां'],
    honors: ['पद्म श्री (1984)', 'पेरिस शहर का ग्रैंड मेडल', 'विश्व सांस्कृतिक हेरिटेज सम्मान'],
    shortBio: 'साधारण लोकशिल्पी जिन्होंने टूटी-फूटी चीनी मिट्टी, चूड़ियों व पत्थरों से ऐसा चमत्कारी संसार रचा जो आज दुनिया के सात अजूबों के समान देखा जाता है।',
  },
  {
    id: 'hof-4',
    name: 'महाराजा भोज परमार (वास्तु प्रणेता)',
    title: 'समरांगण सूत्रधार के रचयिता व ज्ञानशिल्पी',
    category: 'ancient',
    era: '11वीं शताब्दी (धार नगरी)',
    photo: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=600&auto=format&fit=crop&q=80',
    famousWorks: ['समरांगण सूत्रधार (83 अध्यायों का महाग्रंथ)', 'भोजपुर का विशाल शिव मंदिर (विश्व का सबसे बड़ा शिवलिंग)', 'धार की सरस्वती वाग्देवी शाला'],
    honors: ['कविराज उपाधि', 'भारतीय स्थापत्य के महानतम संरक्षक सम्राट'],
    shortBio: 'विश्वकर्मा परंपरा के परम उपासक, जिन्होंने विमान विद्या, यंत्र रचना और नगर नियोजन के 83 अध्यायों वाले ऐतिहासिक ग्रंथ का प्रणयन किया।',
  },
];

// 5. COMMUNITY BLOGS & RESEARCH ARTICLES
export const COMMUNITY_BLOGS: CommunityBlog[] = [
  {
    id: 'blog-1',
    title: 'भारतीय वास्तुशास्त्र में दिशाओं और ऊर्जा प्रवाह का वैज्ञानिक रहस्य',
    author: 'ईं. अशोक पांचाल (वास्तुविद)',
    authorPost: 'वरिष्ठ शोधकर्ता, भारतीय स्थापत्य परिषद',
    date: '28 सितंबर 2026',
    readTime: '6 मिनट पठन',
    category: 'वैदिक वास्तु',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    summary: 'विश्वकर्मा प्रकाश और मयमतम् में वर्णित ईशान, आग्नेय, नैऋत्य और वायव्य कोण केवल धार्मिक मान्यताएं नहीं, बल्कि पृथ्वी के चुंबकीय क्षेत्र और सौर किरणों के सटीक भौतिक सिद्धांत हैं।',
    content: [
      'सनातन वास्तु शास्त्र को आज पश्चिमी वैज्ञानिक भी बायो-एनर्जेटिक्स और जियोपैथिक स्ट्रेस के निवारण में अत्यंत उपयोगी मान रहे हैं।',
      'विश्वकर्मा प्रकाश के प्रथम अध्याय में स्पष्ट निर्देश है कि भवन की नींव रखते समय भूमि की ढाल, सूर्य की प्रथम किरणें तथा भू-गर्भ में जल-प्रवाह की दिशा का सूक्ष्म विश्लेषण आवश्यक है।',
      'ईशान कोण (उत्तर-पूर्व) में खुला स्थान व जल स्रोत रखने से सुबह की पराबैंगनी किरणों का सर्वोत्तम लाभ मिलता है जो गृहस्वामियों को दीर्घायु और मानसिक शांति प्रदान करता है।',
    ],
  },
  {
    id: 'blog-2',
    title: 'पारंपरिक काष्ठशिल्प से आधुनिक 3D मॉड्यूलर इंटीरियर तक: समाज का गौरवशाली सफर',
    author: 'मास्टर शिल्पी रमेश जांगिड़',
    authorPost: 'राष्ट्रीय हस्तशिल्प पुरस्कार विजेता',
    date: '15 सितंबर 2026',
    readTime: '5 मिनट पठन',
    category: 'शिल्प नवाचार',
    coverImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80',
    summary: 'किस प्रकार हमारे काष्ठशिल्पियों ने प्राचीन खांचा-कील (Mortise & Tenon) जोड़ों के पारंपरिक ज्ञान को आधुनिक CNC राउटर और जर्मन हार्डवेयर के साथ जोड़कर वैश्विक बाजार में धूम मचाई है।',
    content: [
      'विश्वकर्मा वंशजों के हाथों में काष्ठ को जीवंत रूप देने का ईश्वरीय वरदान है। प्राचीन हवेलियों के झरोखे आज भी सैकड़ों वर्षों बाद सीना ताने खड़े हैं।',
      'नई पीढ़ी के शिल्पी अब केवल बढ़ईगीरी तक सीमित नहीं हैं; वे 3D ऑटोकैड, जर्मन हार्डवेयर फिटिंग्स और एकॉस्टिक डिजाइनिंग के क्षेत्र में अग्रणी उद्यमी बन रहे हैं।',
      'आवश्यकता इस बात की है कि हम अपने युवाओं को कौशल गुरुकुलों के माध्यम से आधुनिक तकनीक और पारंपरिक नक्काशी का संतुलित प्रशिक्षण दें।',
    ],
  },
  {
    id: 'blog-3',
    title: 'सगोत्र विवाह क्यों वर्जित है? आनुवंशिकी विज्ञान और वैदिक गोत्र परंपरा',
    author: 'डॉ. वेदप्रकाश शर्मा',
    authorPost: 'आनुवंशिकीविद एवं पूर्व प्रोफेसर',
    date: '02 सितंबर 2026',
    readTime: '8 मिनट पठन',
    category: 'गोत्र विज्ञान',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    summary: 'विश्वकर्मा समाज में विवाह हेतु चार गोत्र (स्वगोत्र, मातृगोत्र, दादीगोत्र, नानीगोत्र) टालने की जो सनातन परंपरा है, आधुनिक जेनेटिक्स उसे रिसेसिव जीन विकारों से बचाव का सबसे अचूक उपाय मानती है।',
    content: [
      'वैदिक ऋषियों ने सहस्रों वर्ष पूर्व गोत्र प्रणाली का निर्माण किया था ताकि एक ही पुरुष वंश (Y-Chromosome) के मध्य विवाह से बचा जा सके।',
      'आधुनिक चिकित्सा विज्ञान प्रमाणित करता है कि समान कुल या निकट संबंधियों में विवाह से जन्मजात विकृतियां, हीमोफीलिया और मानसिक दुर्बलता का खतरा 4 गुना बढ़ जाता है।',
      'विश्वकर्मा समाज का परिणय मंच इसी वैज्ञानिक एवं आध्यात्मिक मर्यादा का कठोरता से पालन करता है, जो हमारी आने वाली पीढ़ियों के स्वास्थ्य की गारंटी है।',
    ],
  },
];

// 6. SOCIAL MEDIA CHANNELS
export const SOCIAL_MEDIA_LINKS: SocialLink[] = [
  {
    id: 'soc-yt',
    name: 'YouTube चैनल',
    url: 'https://www.youtube.com',
    icon: 'Youtube',
    description: 'विश्वकर्मा जयंती महोत्सव, शिल्प वृत्तचित्र, वैदिक वास्तु व्याख्यान एवं लाइव सत्संग।',
    badge: '1.2 लाख+ सदस्य',
    color: '#DC2626',
  },
  {
    id: 'soc-wa',
    name: 'WhatsApp कम्युनिटी',
    url: 'https://chat.whatsapp.com',
    icon: 'MessageCircle',
    description: 'राज्यवार, जिलावार व शाखावार सामाजिक संवाद, आपातकालीन सहायता व तुरंत सूचनाएं।',
    badge: '500+ सक्रिय ग्रुप',
    color: '#16A34A',
  },
  {
    id: 'soc-fb',
    name: 'Facebook पेज',
    url: 'https://www.facebook.com',
    icon: 'Facebook',
    description: 'अखिल भारतीय विश्वकर्मा महासंघ का आधिकारिक पेज - सामाजिक सम्मेलन व समाचार।',
    badge: '85 हजार+ फॉलोअर्स',
    color: '#2563EB',
  },
  {
    id: 'soc-x',
    name: 'X (पूर्व Twitter)',
    url: 'https://twitter.com',
    icon: 'Twitter',
    description: 'शिल्पकार अधिकारों, सरकारी नीतियों, MSME योजनाओं व राष्ट्रीय समसामयिक विमर्श।',
    badge: '@VishwakarmaSamaj',
    color: '#000000',
  },
  {
    id: 'soc-ig',
    name: 'Instagram मंच',
    url: 'https://www.instagram.com',
    icon: 'Instagram',
    description: 'सर्वश्रेष्ठ काष्ठ, पाषाण व धातु शिल्प कलाकृतियों की गैलरी एवं युवा सशक्तिकरण।',
    badge: '@VishwaKala_Live',
    color: '#E1306C',
  },
  {
    id: 'soc-tg',
    name: 'Telegram सूचना मंच',
    url: 'https://t.me',
    icon: 'Send',
    description: 'दैनिक रोजगार अवसर, सरकारी योजनाओं की PDF, छात्रवृत्ति फॉर्म व ई-बुक्स।',
    badge: '35 हजार+ बंधु',
    color: '#0284C7',
  },
];

// 7. DONATION / RELIEF FUND PRESETS
export const DONATION_PURPOSES = [
  { id: 'education', labelHi: '🎓 मेधावी छात्र-छात्रा उच्च शिक्षा छात्रवृत्ति', labelEn: 'Student Scholarship' },
  { id: 'medical', labelHi: '🏥 आपातकालीन चिकित्सा व रक्तदान सहायता कोष', labelEn: 'Medical & Blood Relief' },
  { id: 'artisan', labelHi: '🛠️ वृद्ध व दिव्यांग शिल्पी औजार व पेंशन सहयोग', labelEn: 'Artisan Welfare' },
  { id: 'temple', labelHi: '🛕 विश्वकर्मा मंदिर, धर्मशाला व गुरुकुल निर्माण', labelEn: 'Temple & Dharamshala' },
  { id: 'general', labelHi: '🤝 सामान्य समाज सेवा व आपात कल्याण कोष', labelEn: 'General Relief Fund' },
];

export const SUGGESTED_AMOUNTS = [501, 1100, 2100, 5100, 11000, 21000];
