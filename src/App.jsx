import React, { useState, useMemo } from "react";
import { ShoppingBag, X, Plus, Minus, Trash2, ChevronRight, Instagram, Phone, MapPin, Search } from "lucide-react";

// ---------- Content (bilingual) ----------
const STR = {
  ar: {
    dir: "rtl",
    brand: "ديزيريا",
    brandSub: "اكسسوارات",
    nav: { home: "الرئيسية", shop: "المتجر", about: "من نحن", contact: "تواصل" },
    heroEyebrow: "هوية جزائرية، لمسة عصرية",
    heroTitle1: "اكسسوارات",
    heroTitle2: "تحكي طابعك",
    heroBody: "سلاسل، خواتم وأقراط مختارة بعناية — قطع بسيطة تزيد لمستك الخاصة بريق.",
    heroCta: "تصفّحي المجموعة",
    sectionShop: "المجموعة",
    sectionShopSub: "كل قطعة مختارة بعناية",
    addToCart: "أضيفي للسلة",
    added: "تمت الإضافة ✓",
    outOfStock: "غير متوفر حالياً",
    cartTitle: "سلتك",
    cartEmpty: "السلة فاضية حالياً",
    cartEmptySub: "زيدي شي قطعة من المجموعة",
    total: "المجموع",
    checkout: "إتمام الطلب",
    closeCart: "إغلاق",
    checkoutTitle: "معلومات الطلب",
    checkoutSub: "عبّي معلوماتك ونتواصل معاك لتأكيد الطلب",
    name: "الاسم الكامل",
    phone: "رقم الهاتف",
    address: "العنوان (الولاية والبلدية)",
    deliveryLabel: "نوع التوصيل",
    deliveryHome: "توصيل لباب المنزل",
    deliveryOffice: "توصيل للمكتب",
    deliverySedduk: "التوصيل حتى باب المنزل خاص ببلدية صدوق",
    deliverySidiAiche: "التوصيل حتى باب المنزل خاص ببلدية سيدي عيش",
    deliveryAkbou: "التوصيل حتى باب المنزل خاص ببلدية أقبو",
    deliveryMcisna: "التوصيل حتى باب المنزل خاص ببلدية مسيسنة",
    deliveryIghzerAmoqrane: "التوصيل حتى باب المنزل خاص ببلدية إغزر أمقران",
    unavailableOption: "غير متوفر حالياً",
    deliveryFee: "رسوم التوصيل",
    subtotal: "مجموع المنتوجات",
    notes: "ملاحظات (اختياري)",
    submitOrder: "تأكيد الطلب",
    channelLabel: "أرسلي طلبك عبر",
    channelInstagram: "Instagram",
    channelWhatsapp: "WhatsApp",
    sendVia: "إرسال عبر",
    orderSuccess: "طلبك جاهز! 🎉",
    orderSuccessSub: "اختاري كيفاش تحبي تبعتي طلبك باش نأكدوه:",
    backToShop: "رجوع للمتجر",
    seriousOnly: "الطلبات الجادة فقط من فضلكم",
    deliveryNote: "🚚 توصيل لكل الولايات",
    aboutTitle: "من نحن",
    aboutBody: "ديزيريا مشروع جزائري وُلد من حب التفاصيل. كل قطعة نختاروها بعناية باش تعكس شخصية مزيانة وواثقة من نفسها.",
    contactTitle: "تواصل معنا",
    required: "هاد الحقل مطلوب",
    qty: "الكمية",
    remove: "حذف",
    currency: "دج",
    footerRights: "جميع الحقوق محفوظة",
    langSwitch: "FR",
    colorLabel: "اللون",
    sizeLabel: "المقاس",
    chooseColor: "اختاري اللون",
    chooseSize: "اختاري المقاس",
    selectionRequired: "فضلك اختاري اللون والمقاس قبل الإضافة للسلة",
    searchPlaceholder: "ابحثي عن منتج...",
    noResults: "ما لقيناش نتائج",
    noResultsSub: "جربي كلمة بحث أخرى",
  },
  fr: {
    dir: "ltr",
    brand: "DZIRIA",
    brandSub: "ACCESSOIRES",
    nav: { home: "Accueil", shop: "Boutique", about: "À propos", contact: "Contact" },
    heroEyebrow: "Identité algérienne, esprit moderne",
    heroTitle1: "Des accessoires",
    heroTitle2: "qui parlent de vous",
    heroBody: "Chaînes, bagues et boucles d'oreilles sélectionnées avec soin — des pièces simples qui font briller votre style.",
    heroCta: "Voir la collection",
    sectionShop: "La collection",
    sectionShopSub: "Chaque pièce choisie avec soin",
    addToCart: "Ajouter au panier",
    added: "Ajouté ✓",
    outOfStock: "Rupture de stock",
    cartTitle: "Votre panier",
    cartEmpty: "Votre panier est vide",
    cartEmptySub: "Ajoutez une pièce depuis la collection",
    total: "Total",
    checkout: "Finaliser la commande",
    closeCart: "Fermer",
    checkoutTitle: "Informations de commande",
    checkoutSub: "Remplissez vos informations, nous vous contactons pour confirmer",
    name: "Nom complet",
    phone: "Numéro de téléphone",
    address: "Adresse (wilaya et commune)",
    deliveryLabel: "Type de livraison",
    deliveryHome: "Livraison à domicile",
    deliveryOffice: "Livraison au bureau",
    deliverySedduk: "Livraison à domicile - commune de Seddouk uniquement",
    deliverySidiAiche: "Livraison à domicile - commune de Sidi Aïch uniquement",
    deliveryAkbou: "Livraison à domicile - commune d'Akbou uniquement",
    deliveryMcisna: "Livraison à domicile - commune de M'cisna uniquement",
    deliveryIghzerAmoqrane: "Livraison à domicile - commune d'Ighzer Amoqrane uniquement",
    unavailableOption: "Non disponible actuellement",
    deliveryFee: "Frais de livraison",
    subtotal: "Sous-total produits",
    notes: "Remarques (optionnel)",
    submitOrder: "Confirmer la commande",
    channelLabel: "Envoyez votre commande via",
    channelInstagram: "Instagram",
    channelWhatsapp: "WhatsApp",
    sendVia: "Envoyer via",
    orderSuccess: "Votre commande est prête ! 🎉",
    orderSuccessSub: "Choisissez comment envoyer votre commande pour la confirmer :",
    backToShop: "Retour à la boutique",
    seriousOnly: "Commandes sérieuses uniquement, merci",
    deliveryNote: "🚚 Livraison disponible partout",
    aboutTitle: "À propos",
    aboutBody: "Dziria est un projet algérien né de l'amour du détail. Chaque pièce est choisie avec soin pour refléter une personnalité élégante et sûre d'elle.",
    contactTitle: "Contactez-nous",
    required: "Ce champ est requis",
    qty: "Quantité",
    remove: "Retirer",
    currency: "DA",
    footerRights: "Tous droits réservés",
    langSwitch: "ع",
    colorLabel: "Couleur",
    sizeLabel: "Taille",
    chooseColor: "Choisissez la couleur",
    chooseSize: "Choisissez la taille",
    selectionRequired: "Veuillez choisir la couleur et la taille avant d'ajouter au panier",
    searchPlaceholder: "Rechercher un produit...",
    noResults: "Aucun résultat",
    noResultsSub: "Essayez un autre mot-clé",
  },
};

// إذا كان المنتج نافد من المخزون، ضعي فقط available: false
// images: يمكنك وضع أكثر من صورة للمنتج في نفس الخانة، مثال: images: ["data:...", "data:..."]
// colors: قائمة الألوان المتوفرة لهذا المنتج، الزبون يختار واحد قبل الإضافة للسلة
//   مثال: colors: [ { hex: "#C9A876", name: { ar: "ذهبي", fr: "Doré" } }, { hex: "#FFFFFF", name: { ar: "فضي", fr: "Argenté" } } ]
//   إذا تركتيها فارغة [] فما راح يظهر خيار اللون
// sizes: قائمة المقاسات المتوفرة، مثال: sizes: ["S", "M", "L"]
//   إذا تركتيها فارغة [] فما راح يظهر خيار المقاس
const PRODUCTS = [
  
  {
    id: 8,
    name: { ar: "سوار كارتييه كلو", fr: "Bracelet Cartier Clou" },
    price: 800, // TODO: بدلي هذا الرقم بالثمن الحقيقي
    category: { ar: "أساور", fr: "Bracelets" },
    accentColor: "#C9A876",
    // TODO: بدلي هاذو الاثنين بالصور متاعك (data:image/jpeg;base64,... أو رابط https://...)
    images: [
  "images/bracelet-cartier-clou-1.webp",
  "images/bracelet-cartier-clou-2.webp",
  "images/bracelet-cartier-clou-3.webp",
  "images/bracelet-cartier-clou-4.jpg",
],
    colors: [
      { hex: "#C0C0C0", name: { ar: "فضي", fr: "Argenté" }, available: false },
      { hex: "#C9A876", name: { ar: "ذهبي", fr: "Doré" } },
    ],
    sizes: ["14",  "16",  "18"],
    available: true,
  },
  {
    id: 9,
    name: { ar: "سوار كارتييه لوف", fr: "Bracelet Cartier Love" },
    price: 800, // TODO: بدلي هذا الرقم بالثمن الحقيقي
    category: { ar: "أساور", fr: "Bracelets" },
    accentColor: "#C9A876",
    // TODO: بدلي هاذو الصور بالصور متاعك (data:image/jpeg;base64,... أو رابط https://...)
    images: [
      "images/cartier-love-1.webp",
      "images/cartier-love-2.jpg",
    ],
    colors: [
      { hex: "#C0C0C0", name: { ar: "فضي", fr: "Argenté" }, available: false },
      { hex: "#C9A876", name: { ar: "ذهبي", fr: "Doré" } },
    ],
    sizes: ["14","16",  "18"],
    available: true,
  },
  {
    id: 10,
    name: { ar: "بروموسيون أساور ماتشي ماتشي", fr: "Promotion Bracelets Matchy Matchy" },
    price: 0,
    category: { ar: "أساور", fr: "Bracelets" },
    accentColor: "#C9A876",
    images: ["images/Promotion-Bracelets-Matchy-Matchy.jpg"],
    colors: [],
    sizes: [],
    available: false,
  },
  {
    id: 11,
    name: { ar: "بروموسيون: كارتييه لوف و كارتييه كلو دوو", fr: "Promotion: Cartier Love & Cartier Clou Bracelet Duo" },
    price: 1200,
    category: { ar: "أساور", fr: "Bracelets" },
    accentColor: "#C9A876",
    images: ["images/Promotion-Cartier Love-&-Cartier-Clou-Bracelet-Duo.webp"],
    colors: [],
    sizes: [],
    available: true,
  },
 {
    id: 12,
    name: { ar: "سلسلة البجعة", fr: "Chaîne-Swan" },
    price: 1000,
    category: { ar: "سلاسل", fr: "Chaînes" },
    accentColor: "#C9A876",
    images: ["images/Chaîne-Swan.png"],
    colors: [
      { hex: "linear-gradient(135deg, #C9A876 50%, #8B6BB0 50%)", name: { ar: "ذهبي مع بنفسجي", fr: "Doré avec Violet" } },
      { hex: "linear-gradient(135deg, #C9A876 34%, #E7A9BD 34% 67%, #FFFFFF 67%)", name: { ar: "ذهبي مع وردي وأبيض", fr: "Doré avec Rose et Blanc" } },
      { hex: "linear-gradient(135deg, #C0C0C0 50%, #FFFFFF 50%)", name: { ar: "فضي مع أبيض", fr: "Argenté avec Blanc" } },
    ],
    sizes: [],
    available: true,
  },
  {
    id: 13,
    name: { ar: "أساور ماتشي ماتشي", fr: "Bracelets Matchy Matchy" },
    price: 0,
    category: { ar: "أساور", fr: "Bracelets" },
    accentColor: "#C9A876",
    images: ["images/Bracelets-Matchy-Matchy.jpg"],
    colors: [],
    sizes: [],
    available:false ,
  },
  {
  id: 14, // TODO: بدليه برقم يجي بعد آخر id عندك
  name: { ar: "طاقم قلبين مزدوج كامل", fr: "Parure complète à double cœur" },
  price: 1500,
  category: { ar: "طاقم كامل", fr: "Ensemble complet" },
  accentColor: "#C9A876",
  images: ["images/Parure-complète-à-double-cœur.jpeg"],
  colors: [],
  sizes: [],
  available: false ,
},
  {
  id: 15,
  name: { ar: "الطقم الكامل بتصميم البجعة", fr: "Parure complète Swan" },
  price: 1500,
  category: { ar: "طاقم كامل", fr: "Ensemble complet" },
  accentColor: "#C9A876",
  images: [
    "images/Parure-complète-Swan-3.jpeg",
    "images/Parure-complète-Swan-1.jpeg",
    "images/Parure-complète-Swan-2.jpeg",
  ],
  colors: [
    { hex: "linear-gradient(135deg, #C9A876 50%, #B08BC4 50%)", name: { ar: "ذهبي مع موف", fr: "Doré avec Mauve" } },
    { hex: "linear-gradient(135deg, #C9A876 50%, #FFFFFF 50%)", name: { ar: "ذهبي مع أبيض", fr: "Doré avec Blanc" } },
    { hex: "linear-gradient(135deg, #C9A876 50%, #1A1A1A 50%)", name: { ar: "ذهبي مع أسود", fr: "Doré avec Noir" } },
  ],
  sizes: [],
  available: true,
},
  {
  id: 16,
  name: { ar: "سلسلة حلزون أزرق", fr: "Chaîne Hélice Bleue" },
  price: 1000,
  category: { ar: "سلاسل", fr: "Chaînes" },
  accentColor: "#C9A876",
  images: ["images/Chaîne-Hélice-Bleue.jpeg"],
  colors: [
    { hex: "#C9A876", name: { ar: "ذهبي", fr: "Doré" } },
    { hex: "#C0C0C0", name: { ar: "فضي", fr: "Argenté" } },
  ],
  sizes: [],
  available: true,
},
  {
  id: 17,
  name: { ar: "الطقم الكامل تيفاني", fr: "Parure complète Tiffany" },
  price: 1500,
  category: { ar: "طاقم كامل", fr: "Ensemble complet" },
  accentColor: "#C9A876",
  images: ["images/Parure-complète-Tiffany.jpeg"],
  colors: [],
  sizes: [],
  available: true,
},
  {
    id: 18,
    name: { ar: "بروموسيون حصرية 🎉", fr: "Promotion Exclusive 🎉" },
    description: {
      ar: "✨ ساعة\n✨ سوار كارتييه لوف\n✨ سوار كارتييه كلو\n✨ سوار هيرميس",
      fr: "✨ 1 Montre\n✨ 1 Bracelet Cartier Love\n✨ 1 Bracelet Cartier Clou\n✨ 1 Bracelet Hermès",
    },
    price: 2000,
    category: { ar: "طاقم كامل", fr: "Ensemble complet" },
    accentColor: "#C9A876",
    images: ["images/PROMOTION-1.jpg"],
    colors: [],
    sizes: [],
    available: true,
  },
  {
    id: 19,
    name: { ar: "بروموسيون حصرية 🎉", fr: "Promotion Exclusive 🎉" },
    description: {
      ar: "✨ سوار كارتييه كلو\n✨ سوار هيرميس",
      fr: "✨ 1 Bracelet Cartier Clou\n✨ 1 Bracelet Hermès",
    },
    price: 1500,
    category: { ar: "أساور", fr: "Bracelets" },
    accentColor: "#C9A876",
    images: ["images/PROMOTION-2.jpg"],
    colors: [],
    sizes: [],
    available: false,
  },
  {
    id: 20,
    name: { ar: "بروموسيون حصرية 🎉", fr: "Promotion Exclusive 🎉" },
    description: {
      ar: "✨ ساعة\n✨ سوار",
      fr: "✨ 1 Montre\n✨ 1 Bracelet",
    },
    price: 1200,
    category: { ar: "طاقم كامل", fr: "Ensemble complet" },
    accentColor: "#C9A876",
    images: ["images/PROMOTION-3.jpg"],
    colors: [],
    sizes: [],
    available: true,
  },
  {
    id: 21,
    name: { ar: "طاقم فلور دو ساكورا الكامل", fr: "Parure complète Fleur de Sakura" },
    price: 1800,
    category: { ar: "طاقم كامل", fr: "Ensemble complet" },
    accentColor: "#E7A9BD",
    // TODO: بدلي هاذو الثلاثة بالصور متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: [
      "images/Parure-complète-Fleur-de-Sakura-1.jpeg",
      "images/Parure-complète-Fleur-de-Sakura-2.jpeg",
      "images/Parure-complète-Fleur-de-Sakura-3.jpeg",
    ],
    colors: [
      { hex: "#E7A9BD", name: { ar: "وردي", fr: "Rose" } },
      { hex: "#8FBF8F", name: { ar: "أخضر", fr: "Vert" } },
      { hex: "#FFFFFF", name: { ar: "أبيض", fr: "Blanc" } },
    ],
    sizes: [],
    available: true,
  },
  {
    id: 22,
    name: { ar: "طاقم فان كليف الكامل", fr: "Parure complète Van Cleef" },
    price: 1500,
    category: { ar: "طاقم كامل", fr: "Ensemble complet" },
    accentColor: "#1A1A1A",
    // TODO: بدلي هاذو الصورتين بالصور متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: [
      "images/Parure complète Van Cleef-1.jpeg",
      "images/Parure-complète-Van-Cleef-2.jpeg",
    ],
    colors: [
      { hex: "#1A1A1A", name: { ar: "أسود", fr: "Noir" } },
      { hex: "#E7A9BD", name: { ar: "وردي", fr: "Rose" } },
    ],
    sizes: [],
    available: true,
  },
{

    id: 23,
    name: { ar: "طاقم فلور بيرلي الكامل", fr: "Parure complète Fleur Perlée" },
    price: 1200,
    category: { ar: "طاقم كامل", fr: "Ensemble complet" },
    accentColor: "#C9A876",
    // TODO: بدلي هاذي الصورة بالصورة متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: ["images/Parure-complète-Fleur-Perlée.jpeg"],
    colors: [],
    sizes: [],
    available: true,
  },
  {
    id: 24,
    name: { ar: "بروموسيون حصرية 🎉", fr: "Promotion Exclusive 🎉" },
    description: {
      ar: "✨ 3 أساور كارتييه لوف ذهبية",
      fr: "✨ 3 Bracelets Cartier Love Dorés",
    },
    price: 1200,
    category: { ar: "أساور", fr: "Bracelets" },
    accentColor: "#C9A876",
    // TODO: بدلي هاذي الصورة بالصورة متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: ["images/3-Bracelets-Cartier-Love-Dorés.jpeg"],
    colors: [],
    sizes: [],
    available: true,
  },
  {
    id: 25,
    name: { ar: "طاقم نود الذهبي الكامل", fr: "Parure complète Nœud Doré" },
    price: 1200,
    category: { ar: "طاقم كامل", fr: "Ensemble complet" },
    accentColor: "#C9A876",
    // TODO: بدلي هاذي الصورة بالصورة متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: ["images/Parure-complète-Nœud-Doré.jpeg"],
    colors: [],
    sizes: [],
    available: true,
  },
  {
    id: 26,
    name: { ar: "خاتم كارتييه كلو", fr: "Bague Cartier Clou" },
    price: 350,
    category: { ar: "خواتم", fr: "Bagues" },
    accentColor: "#C9A876",
    // TODO: بدلي هاذو الصورتين بالصور متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: [
      "images/Bague-Cartier-Clou-1.jpeg",
      "images/Bague-Cartier-Clou-2.jpeg",
    ],
    colors: [],
    sizes: [],
    available: true,
  },
{
    id: 27,
    name: { ar: "خاتم هيرميس وخاتم بسيط", fr: "Bague Hermès & Bague Simple" },
    price: 450,
    category: { ar: "خواتم", fr: "Bagues" },
    accentColor: "#C9A876",
    // TODO: بدلي هاذي الصورة بالصورة متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: ["images/Bague-Hermès-&-Bague Simple.jpeg"],
    colors: [],
    sizes: [],
    available: true,
  },
{
    id: 28,
    name: { ar: "ساعة  Deue نسائية أنيقة", fr: "Montre Deue Femme Élégante" },
    price: 850,
    category: { ar: "ساعات", fr: "Montres" },
    accentColor: "#C9A876",
    images: [
      "images/Montre-Deue-Femme-Élégante-1.jpeg",
      "images/Montre-Deue-Femme-Élégante-2.jpeg",
    ],
    colors: [
      { hex: "#C9A876", name: { ar: "ذهبي", fr: "Doré" } },
      { hex: "#C0C0C0", name: { ar: "فضي", fr: "Argent" } },
    ],
    sizes: [],
    available: false,
  },
  {
    id: 29,
    name: { ar: "ساعة روليكس نسائية أنيقة", fr: "Montre Rolex Femme Élégante" },
    price: 1400,
    category: { ar: "ساعات", fr: "Montres" },
    accentColor: "#C9A876",
    // TODO: بدلي هاذو الصورتين بالصور متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: [
      "images/Montre-Rolex-Femme-Élégante-1.jpeg",
      "images/Montre-Rolex-Femme-Élégante-2.jpeg",
    ],
    colors: [
      { hex: "#C9A876", name: { ar: "ذهبي", fr: "Doré" } },
      { hex: "#C0C0C0", name: { ar: "فضي", fr: "Argent" } },
    ],
    sizes: [],
    available: true,
  },
  
   {
    id: 30,
    name: { ar: "ساعة GUQI أنيقة للمرأة", fr: "Montre GUQI Élégante pour Femme" },
    price: 1200, 
    category: { ar: "ساعات", fr: "Montres" },
    accentColor: "#C9A876",
    images: [
      "images/Montre-GUQI-Élégante-pour-Femme-1.jpeg",
      "images/Montre-GUQI-Élégante-pour-Femme-2.jpeg",
      "images/Montre-GUQI-Élégante-pour-Femme-3.jpeg",
    ],
   colors: [
      { hex: "#4A7C59", name: { ar: "ذهبي وأخضر", fr: "Doré avec Vert" } },
      { hex: "#C9A876", name: { ar: "ذهبي بالكامل", fr: "Doré avec Doré" } },
    
    ],
    sizes: [],
    available: true,
  },
  {
    id: 31,
    name: { ar: "ساعة GUQI أناقة نسائية", fr: "Montre GUQI Femme Élégance" },
    price: 1200,
    category: { ar: "ساعات", fr: "Montres" },
    accentColor: "#C9A876",
    // TODO: بدلي هاذو الصورتين بالصور متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: [
      "images/Montre-GUQI-Femme-Élégance-1.jpeg",
      "images/Montre-GUQI-Femme-Élégance-2.jpeg",
    ],
    colors: [],
    sizes: [],
    available: true,
  },
  {
    id: 28,
    name: { ar: "ساعة Deue نسائية أنيقة", fr: "Montre Deue Femme Élégance" },
    price: 850,
    category: { ar: "ساعات", fr: "Montres" },
    accentColor: "#C9A876",
    // TODO: بدلي هاذو الصورتين بالصور متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: [
      "images/Montre-Deue-Femme-Élégance-1.jpeg",
      "images/Montre-Deue-Femme-Élégance-2.jpeg",
    ],
    colors: [
      { hex: "#C9A876", name: { ar: "ذهبي", fr: "Doré" } },
      { hex: "#C0C0C0", name: { ar: "فضي", fr: "Argent" } },
    ],
    sizes: [],
    available: true,
  },
  {
    id: 33,
    name: { ar: "💎 طقم الورد الإمبراطوري – أناقة أنثوية", fr: "💎 Parure Rose Impériale – Élégance Féminine" },
    price: 1200,
    category: { ar: "طاقم كامل", fr: "Ensemble complet" },
    accentColor: "#C9A876",
    // TODO: بدلي هاذو الصور بالصور متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: [
      "images/Parure-Rose-Impériale-1.jpeg",
      "images/Parure-Rose-Impériale-2.jpeg",
      "images/Parure-Rose-Impériale-3.jpeg",
      "images/Parure-Rose-Impériale-4.jpeg",
    ],
    colors: [
      { hex: "#C9A876", name: { ar: "ذهبي", fr: "Doré" } },
      { hex: "#C0C0C0", name: { ar: "فضي", fr: "Argent" } },
    ],
    sizes: [],
    available: true,
  },
{
    id: 34,
    name: { ar: "سوار وخاتم ستايل فان كليف ⭐", fr: "Bracelet de Main & Bague Style Van Cleef ⭐" },
    price: 800,
    category: { ar: "طاقم كامل", fr: "Ensemble complet" },
    accentColor: "#1A1A1A",
    // TODO: بدلي هاذو الصور بالصور متاعك (data:image/jpeg;base64,... أو رابط https://... أو images/اسم-الصورة.jpg)
    images: [
      "images/Bracelet-Bague-Van-Cleef-1.jpeg",
      "images/Bracelet-Bague-Van-Cleef-2.jpeg",
      "images/Bracelet-Bague-Van-Cleef-3.jpeg",
    ],
    colors: [
      { hex: "#1A1A1A", name: { ar: "أسود", fr: "Noir" } },
      { hex: "#E7A9BD", name: { ar: "وردي", fr: "Rose" } },
      { hex: "#FFFFFF", name: { ar: "أبيض", fr: "Blanc" } },
    ],
    sizes: [],
    available: true,
  },





];




// ---------- Delivery fees ----------
const DELIVERY_FEES = { home: 800, office: 400, sedduk: 100, sidiAiche: 350, akbou: 350, mcisna: 200, ighzerAmoqrane: 350 };
const WHATSAPP_NUMBER = "213792090250";
// عوضي هذا الرابط بالرابط اللي تحصلي عليه بعد نشر Google Apps Script (خطوات في الأسفل)
const ORDERS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxkS1qxThYh-iaOjDj9hyt0q3FN6vncSAiRwgehdKb5qb25zYFxW46oC5HbB0EqjI_6WQ/exec";

// ---------- Signature visual: open bangle arc (echoes the logo) ----------
function BangleArc({ size = 64, color = "#C9A876", strokeWidth = 8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M 30 20 L 30 80 L 55 80 C 75 80 85 65 85 50 C 85 35 75 20 55 20 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Divider({ color = "#C9A876" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "0 auto" }}>
      <div style={{ height: 1, width: 60, background: "#2A2A2A" }} />
      <BangleArc size={28} color={color} strokeWidth={10} />
      <div style={{ height: 1, width: 60, background: "#2A2A2A" }} />
    </div>
  );
}

// Shows the product's real photo if one is set; otherwise falls back to the bangle icon.
// Accepts a single image OR an images array — pass activeIndex to control which one shows.
function ProductVisual({ image, images, activeIndex = 0, accentColor, iconSize = 84, style = {} }) {
  const src = image || (images && images.length > 0 ? images[activeIndex] : "");
  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "contain", background: "#111111", ...style }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    );
  }
  return <BangleArc size={iconSize} color={accentColor} strokeWidth={9} />;
}

// Product image gallery with arrows + dots for products that have more than one photo.
// onImageClick (optional): called with (images, activeIndex) when the photo itself is tapped, to open a fullscreen viewer.
function ProductGallery({ images, accentColor, height = 200, onImageClick }) {
  const [active, setActive] = useState(0);
  const hasMultiple = images && images.length > 1;
  const hasPhoto = images && images.length > 0;

  function prev(e) {
    e.stopPropagation();
    setActive((i) => (i - 1 + images.length) % images.length);
  }
  function next(e) {
    e.stopPropagation();
    setActive((i) => (i + 1) % images.length);
  }

  return (
    <div
      style={{
        height,
        background: "#1C1C1C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        className="dz-card-img"
        onClick={(e) => {
          if (!hasPhoto || !onImageClick) return;
          e.stopPropagation();
          onImageClick(images, active);
        }}
        style={{
          transition: "transform 0.4s ease",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: hasPhoto && onImageClick ? "zoom-in" : "default",
        }}
      >
        <ProductVisual images={images} activeIndex={active} accentColor={accentColor} iconSize={84} />
      </div>

      {hasMultiple && (
        <>
          <button
            onClick={prev}
            aria-label="prev image"
            style={{
              position: "absolute",
              insetInlineStart: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(10,10,10,0.55)",
              color: "#F5F2ED",
              border: "none",
              borderRadius: "50%",
              width: 26,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={15} style={{ transform: "rotate(180deg)" }} />
          </button>
          <button
            onClick={next}
            aria-label="next image"
            style={{
              position: "absolute",
              insetInlineEnd: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(10,10,10,0.55)",
              color: "#F5F2ED",
              border: "none",
              borderRadius: "50%",
              width: 26,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={15} />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 8,
              insetInlineStart: 0,
              insetInlineEnd: 0,
              display: "flex",
              justifyContent: "center",
              gap: 5,
            }}
          >
            {images.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: i === active ? "#F5F2ED" : "rgba(245,242,237,0.35)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// عارض الصورة بالحجم الكبير (Lightbox) - يفتح كي تضغطي على صورة المنتج
function Lightbox({ images, index, onClose, onPrev, onNext }) {
  if (!images || images.length === 0) return null;
  const hasMultiple = images.length > 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="close"
        style={{
          position: "absolute",
          top: 18,
          insetInlineEnd: 18,
          background: "rgba(255,255,255,0.08)",
          color: "#F5F2ED",
          border: "1px solid rgba(245,242,237,0.25)",
          borderRadius: "50%",
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <X size={20} />
      </button>

      <img
        src={images[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "92vw",
          maxHeight: "88vh",
          objectFit: "contain",
          borderRadius: 8,
        }}
      />

      {hasMultiple && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="prev image"
            style={{
              position: "absolute",
              insetInlineStart: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.08)",
              color: "#F5F2ED",
              border: "1px solid rgba(245,242,237,0.25)",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={20} style={{ transform: "rotate(180deg)" }} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="next image"
            style={{
              position: "absolute",
              insetInlineEnd: 16,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.08)",
              color: "#F5F2ED",
              border: "1px solid rgba(245,242,237,0.25)",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={20} />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 22,
              insetInlineStart: 0,
              insetInlineEnd: 0,
              display: "flex",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {images.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: i === index ? "#F5F2ED" : "rgba(245,242,237,0.35)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// خلفية نجوم ذهبية متحركة - عنصر ثابت خلف كامل الموقع
function GoldenStarsBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 90 }).map((_, i) => {
      const size = Math.random() * 2.4 + 0.6; // 0.6px - 3px
      return {
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size,
        duration: Math.random() * 4 + 3, // 3s - 7s
        delay: Math.random() * 6,
        drift: Math.random() * 30 + 15, // seconds for slow drift
      };
    });
  }, []);

  // نجوم أكبر "لامعة" بعدد أقل لإحساس فخم
  const bigStars = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 3, // 3px - 5px
      duration: Math.random() * 3 + 2.5,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
        background: "radial-gradient(circle at 50% 0%, #141210 0%, #0A0A0A 60%, #050505 100%)",
      }}
    >
      {stars.map((s) => (
        <div
          key={s.id}
          className="dz-star"
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#E9C892",
            boxShadow: "0 0 4px 1px rgba(233,200,146,0.6)",
            animation: `dz-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite, dz-drift ${s.drift}s linear ${s.delay}s infinite alternate`,
          }}
        />
      ))}
      {bigStars.map((s) => (
        <div
          key={`b-${s.id}`}
          className="dz-star"
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#F5D8A0",
            boxShadow: "0 0 8px 2px rgba(245,216,160,0.85), 0 0 16px 4px rgba(201,168,118,0.35)",
            animation: `dz-twinkle-big ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function DziriaStore() {
  const [lang, setLang] = useState("ar");
  const t = STR[lang];
  const isRTL = t.dir === "rtl";

  const [search, setSearch] = useState("");
  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(
      (p) => p.name[lang].toLowerCase().includes(q) || p.category[lang].toLowerCase().includes(q)
    );
  }, [search, lang]);

  // الصورة المكبّرة (Lightbox) - كي تضغطي على صورة المنتج تفتح بحجم كبير
  const [lightbox, setLightbox] = useState(null); // { images: [...], index: 0 } أو null

  const [cart, setCart] = useState([]); // {id, qty}
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [addedFlash, setAddedFlash] = useState(null);

  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [deliveryType, setDeliveryType] = useState("sedduk");
  const [errors, setErrors] = useState({});

  // Per-product color/size choice the customer is currently making on the shop grid, keyed by product id.
  const [selections, setSelections] = useState({});
  // Validation flash for a product card missing a required color/size selection.
  const [selectionError, setSelectionError] = useState(null);

  function setSelection(productId, patch) {
    setSelections((prev) => ({ ...prev, [productId]: { ...prev[productId], ...patch } }));
  }

  // A cart line is unique per product+color+size combination, since each combination is a distinct variant.
  function makeCartKey(id, color, size) {
    return `${id}__${color || ""}__${size || ""}`;
  }

  const cartItems = useMemo(
    () =>
      cart
        .map((c) => {
          const p = PRODUCTS.find((p) => p.id === c.id);
          return p ? { ...p, cartKey: c.cartKey, qty: c.qty, selectedColor: c.color, selectedSize: c.size } : null;
        })
        .filter(Boolean),
    [cart]
  );

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.qty * i.price, 0);
  const deliveryFee = DELIVERY_FEES[deliveryType];
  const grandTotal = cartTotal + deliveryFee;

  function addToCart(id) {
    const product = PRODUCTS.find((p) => p.id === id);
    const sel = selections[id] || {};
    const needsColor = product.colors && product.colors.length > 0;
    const needsSize = product.sizes && product.sizes.length > 0;

    if ((needsColor && !sel.color) || (needsSize && !sel.size)) {
      setSelectionError(id);
      setTimeout(() => setSelectionError(null), 1600);
      return;
    }

    const cartKey = makeCartKey(id, sel.color, sel.size);
    setCart((prev) => {
      const existing = prev.find((c) => c.cartKey === cartKey);
      if (existing) {
        return prev.map((c) => (c.cartKey === cartKey ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, { cartKey, id, qty: 1, color: sel.color, size: sel.size }];
    });
    setAddedFlash(id);
    setTimeout(() => setAddedFlash(null), 1200);
  }

  function updateQty(cartKey, delta) {
    setCart((prev) =>
      prev
        .map((c) => (c.cartKey === cartKey ? { ...c, qty: Math.max(0, c.qty + delta) } : c))
        .filter((c) => c.qty > 0)
    );
  }

  function removeItem(cartKey) {
    setCart((prev) => prev.filter((c) => c.cartKey !== cartKey));
  }

  function validateForm() {
    const errs = {};
    if (!form.name.trim()) errs.name = t.required;
    if (!form.phone.trim()) errs.phone = t.required;
    if (!form.address.trim()) errs.address = t.required;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function buildOrderMessage() {
    const lines = [];
    lines.push(lang === "ar" ? "طلب جديد من الموقع 🛍️" : "Nouvelle commande depuis le site 🛍️");
    lines.push("");
    cartItems.forEach((item) => {
      const variantBits = [];
      if (item.selectedColor) {
        const colorInfo = (item.colors || []).find((c) => c.hex === item.selectedColor);
        variantBits.push(`${t.colorLabel}: ${colorInfo && colorInfo.name ? colorInfo.name[lang] : item.selectedColor}`);
      }
      if (item.selectedSize) variantBits.push(`${t.sizeLabel}: ${item.selectedSize}`);
      const variantText = variantBits.length ? ` (${variantBits.join(" / ")})` : "";
      lines.push(`• ${item.name[lang]}${variantText} x${item.qty} — ${(item.price * item.qty).toLocaleString()} ${t.currency}`);
    });
    lines.push("");
    lines.push(`${t.subtotal}: ${cartTotal.toLocaleString()} ${t.currency}`);
    const deliveryLabels = {
      home: t.deliveryHome,
      office: t.deliveryOffice,
      sedduk: t.deliverySedduk,
      sidiAiche: t.deliverySidiAiche,
      akbou: t.deliveryAkbou,
      mcisna: t.deliveryMcisna,
      ighzerAmoqrane: t.deliveryIghzerAmoqrane,
    };
    lines.push(`${t.deliveryLabel}: ${deliveryLabels[deliveryType] || deliveryType} (+${deliveryFee.toLocaleString()} ${t.currency})`);
    lines.push(`${t.total}: ${grandTotal.toLocaleString()} ${t.currency}`);
    lines.push("");
    lines.push(`${t.name}: ${form.name}`);
    lines.push(`${t.phone}: ${form.phone}`);
    lines.push(`${t.address}: ${form.address}`);
    if (form.notes.trim()) lines.push(`${t.notes}: ${form.notes}`);
    return lines.join("\n");
  }

  function submitOrder(e) {
    e.preventDefault();
    if (!validateForm()) return;
    logOrderToSheet();
    setOrderDone(true);
  }

  function logOrderToSheet() {
    try {
      const orderData = {
        date: new Date().toLocaleString("fr-FR"),
        name: form.name,
        phone: form.phone,
        address: form.address,
        notes: form.notes,
        deliveryType: deliveryType,
        deliveryFee: deliveryFee,
        subtotal: cartTotal,
        total: grandTotal,
        items: cartItems
          .map((item) => {
            const variantBits = [];
            if (item.selectedColor) {
              const colorInfo = (item.colors || []).find((c) => c.hex === item.selectedColor);
              variantBits.push(colorInfo && colorInfo.name ? colorInfo.name[lang] : item.selectedColor);
            }
            if (item.selectedSize) variantBits.push(item.selectedSize);
            const variantText = variantBits.length ? ` (${variantBits.join(" / ")})` : "";
            return `${item.name[lang]}${variantText} x${item.qty} — ${item.price * item.qty} ${t.currency}`;
          })
          .join(" | "),
      };
      fetch(ORDERS_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(orderData),
      }).catch(() => {});
    } catch (err) {
      // ما نوقفوش الطلب إذا فشل التسجيل
    }
  }

  function sendVia(channel) {
    const message = buildOrderMessage();
    if (channel === "instagram") {
      window.open(`https://ig.me/m/dziria_accessoires?text=${encodeURIComponent(message)}`, "_blank");
    } else {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    }
  }

  function resetEverything() {
    setCart([]);
    setForm({ name: "", phone: "", address: "", notes: "" });
    setDeliveryType("home");
    setErrors({});
    setOrderDone(false);
    setCheckoutOpen(false);
    setCartOpen(false);
  }

  const fontDisplay = isRTL
    ? "'Noto Kufi Arabic', sans-serif"
    : "'Archivo Black', sans-serif";
  const fontBody = isRTL
    ? "'Noto Sans Arabic', sans-serif"
    : "'Inter', sans-serif";

  return (
    <div
      dir={t.dir}
      style={{
        fontFamily: fontBody,
        background: "#0A0A0A",
        color: "#F5F2ED",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      <GoldenStarsBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
      <style>{`
        @keyframes dz-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes dz-twinkle-big {
          0%, 100% { opacity: 0.35; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes dz-drift {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-14px); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;500;700;900&family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .dz-btn { cursor: pointer; border: none; transition: all 0.2s ease; }
        .dz-btn:focus-visible { outline: 2px solid #C9A876; outline-offset: 2px; }
        .dz-card:hover .dz-card-img { transform: scale(1.04); }
        .dz-card:hover { border-color: #C9A876 !important; }
        @media (prefers-reduced-motion: reduce) {
          *:not(.dz-star) { transition: none !important; animation: none !important; }
        }
        ::placeholder { color: #6B6B6B; }
        input:focus, textarea:focus { outline: 2px solid #C9A876; outline-offset: 1px; }
      `}</style>

      {/* ---------- Header ---------- */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #232323",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BangleArc size={32} color="#C9A876" strokeWidth={10} />
            <div>
              <div style={{ fontFamily: fontDisplay, fontSize: 18, letterSpacing: isRTL ? 0 : 2, fontWeight: 900, lineHeight: 1 }}>
                {t.brand}
              </div>
              <div style={{ fontSize: 10, letterSpacing: isRTL ? 0 : 3, color: "#8A8A8A", fontWeight: 600 }}>
                {t.brandSub}
              </div>
            </div>
          </div>

          <nav style={{ display: "none", gap: 28, fontSize: 14 }} className="dz-nav">
            <a href="#shop" style={{ color: "#F5F2ED", textDecoration: "none" }}>{t.nav.shop}</a>
            <a href="#about" style={{ color: "#F5F2ED", textDecoration: "none" }}>{t.nav.about}</a>
            <a href="#contact" style={{ color: "#F5F2ED", textDecoration: "none" }}>{t.nav.contact}</a>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="dz-btn"
              onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
              style={{
                background: "transparent",
                border: "1px solid #3A3A3A",
                color: "#F5F2ED",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 600,
              }}
              aria-label="Switch language"
            >
              {t.langSwitch}
            </button>
            <button
              className="dz-btn"
              onClick={() => setCartOpen(true)}
              style={{
                background: "#C9A876",
                border: "none",
                color: "#0A0A0A",
                borderRadius: 999,
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 700,
              }}
              aria-label="Open cart"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && <span>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "80px 24px 60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 13,
            letterSpacing: isRTL ? 0 : 2,
            color: "#C9A876",
            fontWeight: 600,
            marginBottom: 18,
            border: "1px solid #2A2A2A",
            borderRadius: 999,
            padding: "6px 16px",
          }}
        >
          {t.heroEyebrow}
        </div>
        <h1
          style={{
            fontFamily: fontDisplay,
            fontSize: "clamp(36px, 7vw, 72px)",
            lineHeight: 1.08,
            margin: "0 0 20px",
            fontWeight: 900,
          }}
        >
          {t.heroTitle1}
          <br />
          <span style={{ color: "#C9A876" }}>{t.heroTitle2}</span>
        </h1>
        <p style={{ color: "#A8A8A8", fontSize: 17, maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.6 }}>
          {t.heroBody}
        </p>
        <a
          href="#shop"
          className="dz-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#F5F2ED",
            color: "#0A0A0A",
            padding: "14px 30px",
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          {t.heroCta}
          <ChevronRight size={18} style={{ transform: isRTL ? "rotate(180deg)" : "none" }} />
        </a>

        <div style={{ marginTop: 56 }}>
          <Divider />
        </div>
      </section>

      {/* ---------- Shop grid ---------- */}
      <section id="shop" style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: fontDisplay, fontSize: "clamp(28px, 4vw, 40px)", margin: "0 0 8px", fontWeight: 900 }}>
            {t.sectionShop}
          </h2>
          <p style={{ color: "#8A8A8A", fontSize: 15 }}>{t.sectionShopSub}</p>
        </div>

        <div style={{ maxWidth: 420, margin: "0 auto 40px", position: "relative" }}>
          <Search
            size={18}
            color="#8A8A8A"
            style={{
              position: "absolute",
              top: "50%",
              [isRTL ? "right" : "left"]: 16,
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "#141414",
              border: "1px solid #232323",
              borderRadius: 999,
              color: "#EDEDED",
              fontSize: 15,
              padding: isRTL ? "12px 44px 12px 16px" : "12px 16px 12px 44px",
              outline: "none",
            }}
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#8A8A8A" }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#EDEDED", margin: "0 0 6px" }}>{t.noResults}</p>
            <p style={{ fontSize: 14, margin: 0 }}>{t.noResultsSub}</p>
          </div>
        ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 22,
          }}
        >
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="dz-card"
              style={{
                background: "#141414",
                border: "1px solid #232323",
                borderRadius: 16,
                overflow: "hidden",
                transition: "border-color 0.25s ease",
                opacity: p.available === false ? 0.5 : 1,
              }}
            >
              <div style={{ position: "relative" }}>
                {p.available === false && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      insetInlineStart: 10,
                      background: "#0A0A0A",
                      color: "#E07A6B",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 999,
                      border: "1px solid #E07A6B",
                      zIndex: 1,
                    }}
                  >
                    {t.outOfStock}
                  </div>
                )}
                <ProductGallery
                  images={p.images}
                  accentColor={p.accentColor}
                  height={200}
                  onImageClick={(imgs, idx) => setLightbox({ images: imgs, index: idx })}
                />
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontSize: 11, color: "#C9A876", fontWeight: 700, letterSpacing: isRTL ? 0 : 1, marginBottom: 4 }}>
                  {p.category[lang]}
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{p.name[lang]}</div>
                {p.description && (
                  <div style={{ fontSize: 13, color: "#B8B8B8", marginBottom: 10, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                    {p.description[lang]}
                  </div>
                )}
                <div style={{ fontSize: 16, color: "#F5F2ED", marginBottom: 14, fontWeight: 600 }}>
                  {p.price.toLocaleString()} {t.currency}
                </div>

                {p.colors && p.colors.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "#8A8A8A", marginBottom: 6 }}>{t.colorLabel}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {p.colors.map((c) => {
                        const isSelected = selections[p.id]?.color === c.hex;
                        const isColorAvailable = c.available !== false;
                        return (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => isColorAvailable && setSelection(p.id, { color: c.hex })}
                            disabled={!isColorAvailable}
                            title={c.name ? c.name[lang] : c.hex}
                            aria-label={c.name ? c.name[lang] : c.hex}
                            style={{
                              position: "relative",
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              background: c.hex,
                              border: isSelected ? "2px solid #C9A876" : "1px solid #3A3A3A",
                              boxShadow: isSelected ? "0 0 0 2px #0A0A0A inset" : "none",
                              cursor: isColorAvailable ? "pointer" : "not-allowed",
                              padding: 0,
                              opacity: isColorAvailable ? 1 : 0.35,
                              overflow: "hidden",
                            }}
                          >
                            {!isColorAvailable && (
                              <span
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: -3,
                                  right: -3,
                                  height: 1,
                                  background: "#F5F2ED",
                                  transform: "translateY(-50%) rotate(-45deg)",
                                }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {p.sizes && p.sizes.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: "#8A8A8A", marginBottom: 6 }}>{t.sizeLabel}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {p.sizes.map((s) => {
                        const isSelected = selections[p.id]?.size === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelection(p.id, { size: s })}
                            style={{
                              minWidth: 32,
                              height: 30,
                              padding: "0 8px",
                              borderRadius: 8,
                              background: isSelected ? "#F5F2ED" : "transparent",
                              color: isSelected ? "#0A0A0A" : "#F5F2ED",
                              border: isSelected ? "1px solid #F5F2ED" : "1px solid #3A3A3A",
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectionError === p.id && (
                  <div style={{ color: "#E07A6B", fontSize: 12, marginBottom: 10 }}>{t.selectionRequired}</div>
                )}

                <button
                  className="dz-btn"
                  onClick={() => p.available !== false && addToCart(p.id)}
                  disabled={p.available === false}
                  style={{
                    width: "100%",
                    background: p.available === false ? "#2A2A2A" : addedFlash === p.id ? "#3a3a3a" : "#F5F2ED",
                    color: p.available === false ? "#6A6A6A" : addedFlash === p.id ? "#C9A876" : "#0A0A0A",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 0",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: p.available === false ? "not-allowed" : "pointer",
                  }}
                >
                  {p.available === false ? t.outOfStock : addedFlash === p.id ? t.added : t.addToCart}
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* ---------- About ---------- */}
      <section id="about" style={{ background: "#111111", padding: "70px 24px", borderTop: "1px solid #232323" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <Divider />
          <h2 style={{ fontFamily: fontDisplay, fontSize: 28, margin: "28px 0 14px", fontWeight: 900 }}>
            {t.aboutTitle}
          </h2>
          <p style={{ color: "#A8A8A8", fontSize: 16, lineHeight: 1.7 }}>{t.aboutBody}</p>
        </div>
      </section>

      {/* ---------- Contact / Footer ---------- */}
      <footer id="contact" style={{ padding: "50px 24px 30px", textAlign: "center" }}>
        <div style={{ marginBottom: 18, fontWeight: 700, fontSize: 14, color: "#C9A876" }}>
          {t.seriousOnly}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 24, fontSize: 14, color: "#A8A8A8" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={15} /> {t.deliveryNote}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Instagram size={15} /> @dziria_accessoires
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#5A5A5A" }}>
          © {new Date().getFullYear()} {t.brand} {t.brandSub} — {t.footerRights}
        </div>
      </footer>

      {/* ---------- Cart drawer ---------- */}
      {cartOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 50,
            display: "flex",
            justifyContent: isRTL ? "flex-start" : "flex-end",
          }}
          onClick={() => setCartOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(420px, 100%)",
              height: "100%",
              background: "#141414",
              padding: 24,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: fontDisplay, fontSize: 20, margin: 0, fontWeight: 900 }}>{t.cartTitle}</h3>
              <button
                className="dz-btn"
                onClick={() => setCartOpen(false)}
                style={{ background: "transparent", color: "#F5F2ED" }}
                aria-label={t.closeCart}
              >
                <X size={22} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#8A8A8A" }}>
                <ShoppingBag size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                <div style={{ fontWeight: 700, marginBottom: 4, color: "#F5F2ED" }}>{t.cartEmpty}</div>
                <div style={{ fontSize: 13 }}>{t.cartEmptySub}</div>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                  {cartItems.map((item) => {
                    const colorInfo = item.selectedColor ? (item.colors || []).find((c) => c.hex === item.selectedColor) : null;
                    return (
                      <div
                        key={item.cartKey}
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                          borderBottom: "1px solid #232323",
                          paddingBottom: 14,
                        }}
                      >
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            background: "#1C1C1C",
                            borderRadius: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            overflow: "hidden",
                          }}
                        >
                          <ProductVisual images={item.images} accentColor={item.accentColor} iconSize={32} style={{ borderRadius: 10 }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{item.name[lang]}</div>
                          {(item.selectedColor || item.selectedSize) && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#8A8A8A", marginBottom: 2 }}>
                              {item.selectedColor && (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: item.selectedColor, border: "1px solid #3A3A3A", display: "inline-block" }} />
                                  {colorInfo && colorInfo.name ? colorInfo.name[lang] : ""}
                                </span>
                              )}
                              {item.selectedSize && <span>{t.sizeLabel}: {item.selectedSize}</span>}
                            </div>
                          )}
                          <div style={{ fontSize: 13, color: "#8A8A8A" }}>
                            {item.price.toLocaleString()} {t.currency}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            className="dz-btn"
                            onClick={() => updateQty(item.cartKey, -1)}
                            style={{ background: "#232323", color: "#F5F2ED", borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}
                            aria-label="decrease"
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontSize: 14, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                          <button
                            className="dz-btn"
                            onClick={() => updateQty(item.cartKey, 1)}
                            style={{ background: "#232323", color: "#F5F2ED", borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}
                            aria-label="increase"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <button
                          className="dz-btn"
                          onClick={() => removeItem(item.cartKey)}
                          style={{ background: "transparent", color: "#8A8A8A" }}
                          aria-label={t.remove}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: 20, borderTop: "1px solid #232323", paddingTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 16, fontWeight: 700 }}>
                    <span>{t.total}</span>
                    <span style={{ color: "#C9A876" }}>
                      {cartTotal.toLocaleString()} {t.currency}
                    </span>
                  </div>
                  <button
                    className="dz-btn"
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                    style={{
                      width: "100%",
                      background: "#C9A876",
                      color: "#0A0A0A",
                      border: "none",
                      borderRadius: 12,
                      padding: "14px 0",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {t.checkout}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---------- Checkout modal ---------- */}
      {checkoutOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => !orderDone && setCheckoutOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#141414",
              borderRadius: 18,
              padding: 28,
              width: "min(440px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              border: "1px solid #2A2A2A",
            }}
          >
            {!orderDone ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <h3 style={{ fontFamily: fontDisplay, fontSize: 20, margin: 0, fontWeight: 900 }}>{t.checkoutTitle}</h3>
                  <button
                    className="dz-btn"
                    onClick={() => setCheckoutOpen(false)}
                    style={{ background: "transparent", color: "#F5F2ED" }}
                    aria-label={t.closeCart}
                  >
                    <X size={20} />
                  </button>
                </div>
                <p style={{ color: "#8A8A8A", fontSize: 13, marginBottom: 22 }}>{t.checkoutSub}</p>

                <form onSubmit={submitOrder} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Field label={t.name} value={form.name} error={errors.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field label={t.phone} value={form.phone} error={errors.phone} onChange={(v) => setForm({ ...form, phone: v })} type="tel" />

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8, color: "#A8A8A8" }}>{t.deliveryLabel}</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { key: "sedduk", label: t.deliverySedduk, fee: DELIVERY_FEES.sedduk, disabled: false },
                        { key: "sidiAiche", label: t.deliverySidiAiche, fee: DELIVERY_FEES.sidiAiche, disabled: false },
                        { key: "akbou", label: t.deliveryAkbou, fee: DELIVERY_FEES.akbou, disabled: false },
                        { key: "mcisna", label: t.deliveryMcisna, fee: DELIVERY_FEES.mcisna, disabled: false },
                        { key: "ighzerAmoqrane", label: t.deliveryIghzerAmoqrane, fee: DELIVERY_FEES.ighzerAmoqrane, disabled: false },
                        { key: "home", label: t.deliveryHome, fee: DELIVERY_FEES.home, disabled: true },
                        { key: "office", label: t.deliveryOffice, fee: DELIVERY_FEES.office, disabled: true },
                      ].map((opt) => (
                        <label
                          key={opt.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: deliveryType === opt.key ? "#1C1C1C" : "transparent",
                            border: `1px solid ${deliveryType === opt.key ? "#C9A876" : "#2A2A2A"}`,
                            borderRadius: 10,
                            padding: "10px 12px",
                            cursor: opt.disabled ? "not-allowed" : "pointer",
                            opacity: opt.disabled ? 0.45 : 1,
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                            <input
                              type="radio"
                              name="deliveryType"
                              checked={deliveryType === opt.key}
                              disabled={opt.disabled}
                              onChange={() => !opt.disabled && setDeliveryType(opt.key)}
                              style={{ accentColor: "#C9A876" }}
                            />
                            {opt.label}
                          </span>
                          <span style={{ fontSize: 13, color: opt.disabled ? "#8A8A8A" : "#C9A876", fontWeight: 700 }}>
                            {opt.disabled ? t.unavailableOption : `+${opt.fee.toLocaleString()} ${t.currency}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Field label={t.address} value={form.address} error={errors.address} onChange={(v) => setForm({ ...form, address: v })} />
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#A8A8A8" }}>{t.notes}</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      style={{
                        width: "100%",
                        background: "#1C1C1C",
                        border: "1px solid #2A2A2A",
                        borderRadius: 10,
                        padding: "10px 12px",
                        color: "#F5F2ED",
                        fontSize: 14,
                        fontFamily: fontBody,
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <div style={{ background: "#1C1C1C", borderRadius: 10, padding: 14, fontSize: 14, marginTop: 4, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#A8A8A8" }}>
                      <span>{t.subtotal}</span>
                      <span>{cartTotal.toLocaleString()} {t.currency}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#A8A8A8" }}>
                      <span>{t.deliveryFee}</span>
                      <span>+{deliveryFee.toLocaleString()} {t.currency}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid #2A2A2A", paddingTop: 6, marginTop: 2 }}>
                      <span>{t.total}</span>
                      <span style={{ color: "#C9A876" }}>{grandTotal.toLocaleString()} {t.currency}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="dz-btn"
                    style={{
                      background: "#C9A876",
                      color: "#0A0A0A",
                      border: "none",
                      borderRadius: 12,
                      padding: "14px 0",
                      fontWeight: 700,
                      fontSize: 15,
                      marginTop: 6,
                    }}
                  >
                    {t.submitOrder}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <h3 style={{ fontFamily: fontDisplay, fontSize: 20, marginBottom: 10, fontWeight: 900 }}>{t.orderSuccess}</h3>
                <p style={{ color: "#A8A8A8", fontSize: 14, lineHeight: 1.6, marginBottom: 22 }}>{t.orderSuccessSub}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                  <button
                    className="dz-btn"
                    onClick={() => sendVia("whatsapp")}
                    style={{
                      background: "#25D366",
                      color: "#0A0A0A",
                      border: "none",
                      borderRadius: 12,
                      padding: "13px 0",
                      fontWeight: 700,
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <Phone size={17} />
                    {t.sendVia} WhatsApp
                  </button>
                </div>

                <button
                  className="dz-btn"
                  onClick={resetEverything}
                  style={{
                    background: "transparent",
                    color: "#8A8A8A",
                    border: "1px solid #2A2A2A",
                    borderRadius: 12,
                    padding: "10px 22px",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {t.backToShop}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- Lightbox: عرض الصورة بحجم كبير ---------- */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onPrev={() =>
            setLightbox((lb) => ({ ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length }))
          }
          onNext={() =>
            setLightbox((lb) => ({ ...lb, index: (lb.index + 1) % lb.images.length }))
          }
        />
      )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error, type = "text" }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#A8A8A8" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "#1C1C1C",
          border: `1px solid ${error ? "#C0392B" : "#2A2A2A"}`,
          borderRadius: 10,
          padding: "10px 12px",
          color: "#F5F2ED",
          fontSize: 14,
        }}
      />
      {error && <div style={{ color: "#E07A6B", fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  );
}
