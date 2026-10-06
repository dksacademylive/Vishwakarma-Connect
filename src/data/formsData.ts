import {
  JobItem,
  ScholarshipItem,
  WorkshopItem,
  DonationConfig,
  IdCardFormConfig,
  MatrimonyFormConfig,
  ArtisanFormConfig,
  PostFormConfig
} from '../types';

export const DEFAULT_JOBS: JobItem[] = [
  {
    id: 'job-1',
    title: 'सीनियर 3D इंटीरियर व सीएनसी डिजाइनर',
    company: 'जांगिड़ आर्किटेक्चरल वुडटेक',
    location: 'जयपुर, राजस्थान',
    salary: '₹ 35,000 - ₹ 50,000 / माह',
    type: 'पूर्णकालिक (Full Time)',
    skills: 'AutoCAD, SketchUp, 3ds Max, Woodwork Experience',
    deadline: '15 दिन शेष'
  },
  {
    id: 'job-2',
    title: 'साइट इंजीनियर व वास्तु पर्यवेक्षक',
    company: 'धीमान कंस्ट्रक्शंस एंड डेवलपर्स',
    location: 'गुरुग्राम / दिल्ली एनसीआर',
    salary: '₹ 40,000 - ₹ 60,000 / माह',
    type: 'पूर्णकालिक (Full Time)',
    skills: 'बी.टेक सिविल / डिप्लोमा, वैदिक वास्तु ज्ञान',
    deadline: '7 दिन शेष'
  },
  {
    id: 'job-3',
    title: 'सीएडी कुंदन व गोल्ड ज्वैलरी मॉडेलर',
    company: 'विश्वकर्मा जेम्स एंड आर्ट्स',
    location: 'राजकोट / मुंबई',
    salary: '₹ 45,000 - ₹ 70,000 / माह',
    type: 'पूर्णकालिक (Full Time)',
    skills: 'MatrixGold, Rhino 3D, पारंपरिक आभूषण ज्ञान',
    deadline: '20 दिन शेष'
  },
  {
    id: 'job-4',
    title: 'जूनियर रोबोटिक्स व ऑटोमेशन एसोसिएट',
    company: 'पंचाल प्रेसिजन ऑटोमेशन',
    location: 'पुणे / अहमदाबाद',
    salary: '₹ 5.5 - 7.5 लाख प्रतिवर्ष',
    type: 'पूर्णकालिक (Full Time)',
    skills: 'PLC Programming, Robotics, Python, IoT',
    deadline: '12 दिन शेष'
  }
];

export const DEFAULT_SCHOLARSHIPS: ScholarshipItem[] = [
  {
    id: 'sch-1',
    title: 'देवशिल्पी उच्च तकनीकी शिक्षा छात्रवृत्ति 2026-27',
    target: 'आईआईटी, एनआईटी, सरकारी इंजीनियरिंग व आर्किटेक्चर में अध्ययनरत छात्र-छात्राएं',
    amount: '₹ 50,000 प्रतिवर्ष सहायता',
    eligibility: 'पारिवारिक वार्षिक आय ₹ 4 लाख से कम, 12वीं में न्यूनतम 80% अंक',
    lastDate: '31 अक्टूबर 2026'
  },
  {
    id: 'sch-2',
    title: 'पारंपरिक शिल्प संरक्षण एवं नवाचार फेलोशिप',
    target: 'पारंपरिक काष्ठ, लौह, स्वर्ण, पाषाण शिल्प में नई तकनीक जोड़ने वाले युवा शिल्पी',
    amount: '₹ 1,00,000 एकमुश्त टूलकिट व रिसर्च अनुदान',
    eligibility: 'उम्र 18-35 वर्ष, समाज का प्रमाणित कारीगर परिवार',
    lastDate: '15 नवंबर 2026'
  }
];

export const DEFAULT_WORKSHOPS: WorkshopItem[] = [
  {
    id: 'ws-1',
    title: 'सीएनसी व आधुनिक वुडवर्किंग 101',
    category: 'काष्ठकला व तकनीक',
    desc: 'पारंपरिक काष्ठशिल्पियों के लिए आधुनिक कंप्यूटर-न्यूमेरिकल-कंट्रोल मशीनिंग व 3D मॉडलिंग का व्यावहारिक प्रशिक्षण।',
    schedule: 'प्रत्येक शनिवार (प्रातः 10:00 से 01:00)',
    mode: 'ऑनलाइन + स्थानीय वर्कशॉप',
    seats: '25 सीटें शेष',
    instructor: 'ईं. राकेश जांगिड़ (सीएनसी एक्सपर्ट)'
  },
  {
    id: 'ws-2',
    title: 'वैदिक वास्तु व समकालीन गृह शिल्प',
    category: 'वास्तुकला व इंटीरियर',
    desc: 'वास्तु शास्त्र के सिद्धांतों को आधुनिक सिविल इंजीनियरिंग व इंटीरियर आर्किटेक्चर के साथ क्रियान्वित करने का कोर्स।',
    schedule: 'मासिक 4 सत्र (प्रत्येक रविवार)',
    mode: 'लाइव इंटरएक्टिव वेबिनार',
    seats: '40 सीटें शेष',
    instructor: 'आचार्य मदनलाल शर्मा (वास्तुविद्)'
  },
  {
    id: 'ws-3',
    title: 'कारीगरों के लिए डिजिटल मार्केटिंग व ई-कॉमर्स',
    category: 'व्यापार व ब्रांडिंग',
    desc: 'समाज के फर्नीचर, आभूषण व मूर्ति शिल्पी अपने उत्पादों को ऑनलाइन पूरे भारत व विदेश में कैसे सीधे बेचें।',
    schedule: 'द्विसाप्ताहिक सप्ताहांत सत्र',
    mode: 'प्रैक्टिकल हैंड्स-ऑन डेमो',
    seats: '30 सीटें शेष',
    instructor: 'अमित पांचाल (डिजिटल कंसल्टेंट)'
  },
  {
    id: 'ws-4',
    title: 'पारंपरिक स्वर्ण-रत्न मीनाकारी व 3D ज्वेलरी डिजाइन',
    category: 'स्वर्ण व आभूषण',
    desc: 'पारंपरिक कुंदन-मीनाकारी के साथ Rhino 3D व Matrix सॉफ्टवेयर से मॉडर्न लाइटवेट ज्वेलरी निर्माण कौशल।',
    schedule: 'सप्ताह में 3 दिन (शाम 05:00 से 07:00)',
    mode: 'हाइब्रिड ट्रेनिंग',
    seats: '15 सीटें शेष',
    instructor: 'सुरेश सोनी (मास्टर ज्वैलर)'
  }
];

export const DEFAULT_DONATION_CONFIG: DonationConfig = {
  bankName: 'State Bank of India (SBI)',
  accountHolder: 'Akhil Bharatiya Vishwakarma Samaj Welfare Trust',
  accountNumber: '39820014008921',
  ifscCode: 'SBIN0001234',
  branch: 'नई दिल्ली मुख्य शाखा',
  upiId: 'vishwakarma.samaj@sbi',
  payeeName: 'Akhil Bharatiya Vishwakarma Samaj Trust',
  tax80gNumber: 'AAATV1234F2280G1',
  ngoDarpanId: 'DL/2021/0284918',
  supportPhone: '+91 98250 11223',
  suggestedAmounts: [501, 1100, 2100, 5100, 11000, 21000],
  formTitleHi: 'विश्वकर्मा समाज समर्पण एवं सहायता निधि कोष',
  formSubtitleHi: 'पारदर्शी समाज सेवा, मेधावी छात्रवृत्ति, आपात चिकित्सा व मंदिर जीर्णोद्धार सहयोग',
  purposes: [
    {
      id: 'p1',
      labelHi: 'मेधावी छात्र-छात्रा उच्च शिक्षा छात्रवृत्ति',
      labelEn: 'Higher Education Scholarship',
      desc: 'आईआईटी, नीट व तकनीकी शिक्षा में समाज के होनहार विद्यार्थियों की फीस सहायता'
    },
    {
      id: 'p2',
      labelHi: 'कन्या विवाह सहायता कोष',
      labelEn: 'Daughter Marriage Support',
      desc: 'आर्थिक रूप से निर्बल परिवारों की कन्याओं के विवाह हेतु आर्थिक संबल'
    },
    {
      id: 'p3',
      labelHi: 'आपातकालीन चिकित्सा राहत व स्वास्थ्य कोष',
      labelEn: 'Emergency Medical Relief',
      desc: 'गंभीर रोग व दुर्घटना के समय त्वरित चिकित्सा सहायता'
    },
    {
      id: 'p4',
      labelHi: 'मंदिर, धर्मशाला जीर्णोद्धार व समाज भवन',
      labelEn: 'Temple & Community Centre Restoration',
      desc: 'विश्वकर्मा धाम व तीर्थ स्थलों पर यात्री धर्मशालाओं का निर्माण व रखरखाव'
    },
    {
      id: 'p5',
      labelHi: 'वृद्ध एवं असहाय शिल्पकार पेंशन सहयोग',
      labelEn: 'Artisan Senior Welfare',
      desc: 'पारंपरिक कारीगरों के बुढ़ापे में सम्मानजनक मासिक सहायता'
    }
  ]
};

export const DEFAULT_IDCARD_CONFIG: IdCardFormConfig = {
  titleHi: 'विश्वकर्मा डिजिटल सदस्यता पहचान पत्र',
  issuingAuthority: 'अखिल भारतीय विश्वकर्मा समाज महासंघ (पंजीकृत)',
  validityNotice: 'आजीवन डिजिटल सदस्यता / 5 वर्ष नवीकरणीय',
  helplinePhone: '+91 98290 12345',
  subcastes: [
    'जांगिड़ (सुथार)',
    'धीमान (लोहार/बढ़ई)',
    'पांचाल',
    'विश्वकर्मा (शिल्पकार)',
    'कंसारा (कांस्यकार)',
    'स्वर्णकार (सोनी)',
    'काष्ठकार',
    'अन्य विश्वकर्मा बंधु'
  ],
  termsNote: 'यह पहचान पत्र केवल समाज के आंतरिक कल्याण, सहयोग व सदस्यता सत्यापन हेतु मान्य है।'
};

export const DEFAULT_MATRIMONY_CONFIG: MatrimonyFormConfig = {
  formTitle: 'विश्वकर्मा परिणय बायोडाटा पंजीकरण प्रपत्र',
  verificationNotice: 'बायोडाटा की सत्यता व पारिवारिक संदर्भ समिति द्वारा गोपनीय रूप से सत्यापित किए जाते हैं।',
  disclaimer: 'गोपनीयता नीति: संपर्क नंबर व पूर्ण फोटो केवल पंजीकृत व सत्यापित समाज परिवारों के अनुरोध पर ही साझा किए जाते हैं।',
  contactHelpline: '+91 98290 44552',
  allowedSubcastes: ['जांगिड़', 'धीमान', 'पांचाल', 'शिल्पकार', 'सुथार', 'लोहार', 'स्वर्णकार', 'कंसारा', 'अन्य']
};

export const DEFAULT_ARTISAN_CONFIG: ArtisanFormConfig = {
  formTitle: 'अखिल भारतीय शिल्पकार व व्यवसाय पंजीयन फॉर्म',
  verificationNotice: 'पंजीकरण उपरांत समाज द्वारा अधिकृत शिल्पकार प्रमाण पत्र व डिजिटल बैज जारी किया जाएगा।',
  benefitsNotice: 'निःशुल्क राष्ट्रीय डायरेक्टरी लिस्टिंग, ग्राहक पूछताछ व सीधे व्यापारिक अवसर।',
  trades: [
    'काष्ठकला (Woodcraft)',
    'लौहशिल्प व इंजीनियरिंग (Metal & Iron)',
    'स्वर्ण व रत्न आभूषण (Jewellery & Gems)',
    'पाषाण व मूर्तिकला (Stone Carving & Murti)',
    'वास्तु व समकालीन भवन निर्माण (Architecture & Civil)',
    'सीएनसी, 3D डिजाइन व आधुनिक तकनीक (Modern Tech & CNC)'
  ]
};

export const DEFAULT_POST_CONFIG: PostFormConfig = {
  formTitle: 'समाज चर्चा मंच पर नया विचार या संदेश साझा करें',
  guidelinesNotice: 'कृपया सामाजिक सद्भाव, शिल्प कला, रोजगार सूचना व प्रेरणादायक संदेश ही साझा करें।',
  categories: ['चर्चा (Discussion)', 'शिल्प समाचार (Craft News)', 'घोषणा (Announcement)', 'रोजगार (Jobs)', 'संस्कृति (Culture)']
};
