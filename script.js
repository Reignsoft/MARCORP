/* =========================================================
   MARCORP® — script.js (matches the provided HTML & CSS)
   - Mobile nav, smooth scroll, year
   - Testimonials carousel
   - Contact form validation + toast
   - i18n engine bound to data-i18n, data-i18n-html, data-i18n-ph
   - Language switcher (EN, FR-CH, DE-CH) + auto-detect + persistence
   - Currency switching (€ -> CHF) via data-i18n-currency on price tags
   ========================================================= */

/* ------------------ Mobile menu ------------------ */
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.menu');
if (toggle) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ------------------ Smooth scroll ------------------ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      menu?.classList.remove('open');
    }
  });
});

/* ------------------ Dynamic year ------------------ */
document.getElementById('year').textContent = new Date().getFullYear();

/* ------------------ Testimonials carousel ------------------ */
(() => {
  const track = document.querySelector('.carousel-track');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  if (!track) return;

  let index = 0;
  const cards = [...track.children];

  function update(dir = 1) {
    index = (index + dir + cards.length) % cards.length;
    const card = cards[index];
    const offset = card.offsetLeft - track.offsetLeft;
    track.scrollTo({ left: offset, behavior: 'smooth' });
  }

  next?.addEventListener('click', () => update(1));
  prev?.addEventListener('click', () => update(-1));
  setInterval(() => update(1), 5000);
})();

/* ------------------ Contact form (front-end demo) ------------------ */
(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const toast = form.querySelector('.toast');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let ok = true;
    form.querySelectorAll('[required]').forEach((input) => {
      const field = input.closest('.field');
      const err = field.querySelector('.error');
      if (!input.value.trim()) {
        ok = false;
        err.textContent = i18n.t('form.required');
      } else {
        err.textContent = '';
      }
    });

    const email = form.querySelector('#email');
    if (
      email &&
      email.value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
    ) {
      ok = false;
      email.closest('.field').querySelector('.error').textContent =
        i18n.t('form.invalidEmail');
    }

    if (!ok) return;

    if (toast) {
      toast.textContent = i18n.t('form.toast');
      toast.hidden = false;
      toast.focus?.();
    }
    form.reset();
  });
})();

/* =========================================================
   I18N ENGINE
   - Uses attributes:
     data-i18n       (textContent)
     data-i18n-html  (innerHTML)
     data-i18n-ph    (placeholder)
     data-i18n-currency (price tag with number + unit span)
   - Languages: en, fr-CH, de-CH
   ========================================================= */

const DICTS = {
  en: {
    htmlLang: 'en',
    meta: {
      title: 'MARCORP® — Premium Cleaning & Care Services',
      desc: 'MARCORP® provides luxury home & apartment cleaning, babysitting, chauffeuring, senior care, pet care, and concierge services.',
    },
    nav: {
      home: 'Home',
      services: 'Services',
      pricing: 'Pricing',
      testimonials: 'Testimonials',
      reviews: 'Reviews',
      contact: 'Contact',
    },
    hero: {
      kicker: 'Premium Home & Care Services',
      title: 'Warmth, Trust, and Luxury — <span class="accent">MARCORP®</span>',
      lead: 'From immaculate homes to thoughtful human care, MARCORP® delivers five-star service with heart. Background-checked, insured, and meticulously trained.',
      cities: 'Operating across Zürich • Genève • Lausanne • Basel • Bern',
      cta1: 'Explore Services',
      cta2: 'Get a Quote',
      badge1: '✓ Background-checked staff',
      badge2: '✓ Eco-friendly products',
      badge3: '✓ Flexible scheduling',
      badge4: '✓ Satisfaction guarantee',
      ownerName: 'Meet Houaida',
      ownerRole: 'Founder, Quality Obsessive, and your home’s new best friend.',
    },
    services: {
      title: 'Available Services',
      subtitle: 'Everything you need — done beautifully and reliably.',
    },
    s1: {
      t: 'Standard Home Cleaning',
      d: 'Regular upkeep for apartments and houses: dusting, floors, kitchens, bathrooms, and tidy-ups.',
    },
    s2: {
      t: 'Deep Cleaning',
      d: 'Top-to-bottom reset: behind appliances, baseboards, grout, vents, and high-touch details.',
    },
    s3: {
      t: 'Move-In / Move-Out',
      d: 'Detailed turnovers to hand keys with confidence — ideal for tenants, landlords, and agents.',
    },
    s4: {
      t: 'Post-Renovation',
      d: 'Construction dust, debris, and fine particles removed with HEPA filtration and careful finishing.',
    },
    s5: {
      t: 'Office & Airbnb Cleaning',
      d: 'Discreet commercial upkeep and fast turnover service for hosts who need flawless ratings.',
    },
    s6: {
      t: 'Laundry & Ironing',
      d: 'Wash, fold, and press — fresh linens and wardrobe care tailored to your preferences.',
    },
    s7: {
      t: 'Babysitting & Childcare',
      d: 'Vetted caregivers who engage, educate, and keep your little ones safe with warmth and patience.',
    },
    s8: {
      t: 'Senior Care & Companionship',
      d: 'Respectful assistance with daily routines, medication reminders, light meal prep, and errands.',
    },
    s9: {
      t: 'Chauffeuring & Errands',
      d: 'School runs, appointments, airport transfers, groceries — punctual, private, and comfortable.',
    },
    s10: {
      t: 'Pet Care & Dog Walking',
      d: 'Walks, feeding, and playtime for your furry family, with photo updates for peace of mind.',
    },
    s11: {
      t: 'House Sitting',
      d: 'Mail collection, plant watering, security checks, and daily presence while you’re away.',
    },
    s12: {
      t: 'Custom Concierge',
      d: 'From organizing wardrobes to event prep — tell us your wish list and we’ll tailor a plan.',
    },

    pricing: {
      title: 'Pricing',
      subtitle: 'Transparent plans. Luxury execution.',
      perHour: '/hour',
      mostPopular: 'Most Popular',
      essential: 'Essential',
      premium: 'Premium',
      signature: 'Signature',
      ctaEssential: 'Book Essential',
      ctaPremium: 'Book Premium',
      ctaSignature: 'Book Signature',
      note: '* Babysitting, senior care, chauffeuring, and specialty services are quoted based on scope, frequency, and timing. Ask for a custom package.',
    },
    p1: {
      i1: 'Standard home cleaning',
      i2: 'Eco-friendly products',
      i3: 'Flexible scheduling',
    },
    p2: {
      i1: 'Deep cleaning or mixed tasks',
      i2: 'Laundry & ironing add-on',
      i3: 'Priority booking',
    },
    p3: {
      i1: 'Concierge care plan',
      i2: 'Dedicated lead specialist',
      i3: 'On-call support',
    },

    testimonials: {
      title: 'What Clients Say',
      subtitle: 'A few words from our happy families and hosts.',
    },
    t1: {
      q: '“MARCORP turned my move-out into a breeze. The landlord asked who I used. Five stars.”',
      a: '— Sofia M., Genève',
    },
    t2: {
      q: '“Our Airbnb rating jumped to 4.98 after two months with MARCORP®. Impeccable standards.”',
      a: '— André R., Zürich',
    },
    t3: {
      q: '“Their babysitter is patient, creative, and genuinely caring. My kids ask for her by name.”',
      a: '— Lina & Karim, Lausanne',
    },
    t4: {
      q: '“My mother finally enjoys her afternoons again. Respectful and kind senior care.”',
      a: '— Marta G., Bern',
    },

    reviews: { title: 'Recent Reviews' },
    r1: {
      q: '“Punctual, discreet, and sparkling results. Worth every euro.”',
      a: '— João P., Basel',
    },
    r2: {
      q: '“Trusted them with my pets and home while abroad — seamless updates and care.”',
      a: '— Aisha H., Zürich',
    },
    r3: {
      q: '“Deep clean was fantastic. Added ironing as a standing add-on.”',
      a: '— Daniel C., Genève',
    },

    contact: {
      title: 'Contact Us',
      subtitle: 'Tell us what you need — we’ll tailor a plan and send a quote.',
      name: 'Full name',
      namePh: 'Your name',
      email: 'Email',
      emailPh: 'you@example.com',
      phone: 'Phone',
      phonePh: '+41 ...',
      service: 'Service',
      select: 'Select a service',
      date: 'Preferred date',
      time: 'Preferred time',
      details: 'Details',
      detailsPh: 'Tell us about your home, frequency, special requests...',
      submit: 'Request Quote',
      note: 'By submitting, you agree to be contacted about your request.',
      toast: 'Thank you! We’ll get back to you shortly.',
    },
    form: { required: 'Required', invalidEmail: 'Invalid email' },

    footer: {
      copy: '© {year} MARCORP®. Developed by Reignsoft®, LLC.',
    },

    currency: { symbol: '€', unit: '/hour' },
  },

  'fr-CH': {
    htmlLang: 'fr-CH',
    meta: {
      title: 'MARCORP® — Services de ménage & de soin haut de gamme',
      desc: 'MARCORP® propose ménage pour maisons & appartements, garde d’enfants, chauffeur, aide aux aînés, soin des animaux et conciergerie.',
    },
    nav: {
      home: 'Accueil',
      services: 'Services',
      pricing: 'Tarifs',
      testimonials: 'Témoignages',
      reviews: 'Avis',
      contact: 'Contact',
    },
    hero: {
      kicker: 'Services premium pour la maison & le soin',
      title:
        'Chaleur, Confiance et Luxe — <span class="accent">MARCORP®</span>',
      lead: 'De la propreté impeccable au soin attentionné, MARCORP® offre un service cinq étoiles avec le cœur. Équipe vérifiée, assurée et formée avec rigueur.',
      cities: 'Présents à Zürich • Genève • Lausanne • Bâle • Berne',
      cta1: 'Découvrir les services',
      cta2: 'Obtenir un devis',
      badge1: '✓ Équipe vérifiée',
      badge2: '✓ Produits éco-responsables',
      badge3: '✓ Planning flexible',
      badge4: '✓ Satisfaction garantie',
      ownerName: 'Rencontrez Houaida',
      ownerRole: 'Fondatrice, obsédée par la qualité et alliée de votre foyer.',
    },
    services: {
      title: 'Services disponibles',
      subtitle:
        'Tout ce dont vous avez besoin — réalisé avec beauté et fiabilité.',
    },
    s1: {
      t: 'Ménage standard',
      d: 'Entretien régulier : dépoussiérage, sols, cuisine, salle de bain et rangements.',
    },
    s2: {
      t: 'Grand nettoyage',
      d: 'Remise à neuf complète : derrière les appareils, plinthes, joints, grilles, zones sensibles.',
    },
    s3: {
      t: 'Entrée / Sortie',
      d: 'Préparations détaillées pour rendre/recevoir les clés en toute confiance.',
    },
    s4: {
      t: 'Post-rénovation',
      d: 'Poussières et particules fines éliminées (filtration HEPA) et finitions soignées.',
    },
    s5: {
      t: 'Bureaux & Airbnb',
      d: 'Entretien discret et rotation rapide pour des notes irréprochables.',
    },
    s6: {
      t: 'Linge & Repassage',
      d: 'Lavage, pliage, repassage — selon vos préférences.',
    },
    s7: {
      t: 'Garde d’enfants',
      d: 'Gardiens qualifiés, créatifs et bienveillants.',
    },
    s8: {
      t: 'Aide aux aînés',
      d: 'Routines, rappels de médicaments, repas légers, courses avec respect.',
    },
    s9: {
      t: 'Chauffeur & Courses',
      d: 'École, rendez-vous, aéroports, courses — ponctuels et confortables.',
    },
    s10: { t: 'Soin des animaux', d: 'Promenades, repas, jeux avec photos.' },
    s11: {
      t: 'Gardiennage',
      d: 'Courrier, plantes, sécurité et présence quotidienne.',
    },
    s12: {
      t: 'Conciergerie',
      d: 'Organisation, garde-robe, préparation d’événements — service sur-mesure.',
    },

    pricing: {
      title: 'Tarifs',
      subtitle: 'Des offres claires. Une exécution haut de gamme.',
      perHour: '/heure',
      mostPopular: 'Le plus choisi',
      essential: 'Essentiel',
      premium: 'Premium',
      signature: 'Signature',
      ctaEssential: 'Réserver Essentiel',
      ctaPremium: 'Réserver Premium',
      ctaSignature: 'Réserver Signature',
      note: '* Garde d’enfants, aide aux aînés, chauffeur et services spécialisés : devis selon portée, fréquence et horaire.',
    },
    p1: { i1: 'Ménage standard', i2: 'Produits éco', i3: 'Planning flexible' },
    p2: {
      i1: 'Grand nettoyage ou mix',
      i2: 'Option linge & repassage',
      i3: 'Priorité de réservation',
    },
    p3: {
      i1: 'Plan conciergerie',
      i2: 'Spécialiste dédié',
      i3: 'Assistance à la demande',
    },

    testimonials: {
      title: 'Ce que disent nos clients',
      subtitle: 'Quelques mots de familles et d’hôtes satisfaits.',
    },
    t1: {
      q: '« MARCORP® a rendu mon état des lieux impeccable. Cinq étoiles. »',
      a: '— Sofia M., Genève',
    },
    t2: {
      q: '« Notre note Airbnb a grimpé à 4,98 en deux mois. Standards irréprochables. »',
      a: '— André R., Zürich',
    },
    t3: {
      q: '« Nounou patiente, créative et chaleureuse. »',
      a: '— Lina & Karim, Lausanne',
    },
    t4: {
      q: '« Ma mère profite enfin de ses après-midis. Aide respectueuse. »',
      a: '— Marta G., Berne',
    },

    reviews: { title: 'Avis récents' },
    r1: {
      q: '« Ponctuel, discret et résultat étincelant. »',
      a: '— João P., Bâle',
    },
    r2: {
      q: '« Maison et animaux entre de bonnes mains durant nos voyages. »',
      a: '— Aïsha H., Zürich',
    },
    r3: {
      q: '« Grand nettoyage excellent. Option repassage ajoutée. »',
      a: '— Daniel C., Genève',
    },

    contact: {
      title: 'Nous contacter',
      subtitle: 'Expliquez-nous vos besoins — devis personnalisé sous peu.',
      name: 'Nom complet',
      namePh: 'Votre nom',
      email: 'Email',
      emailPh: 'vous@exemple.ch',
      phone: 'Téléphone',
      phonePh: '+41 ...',
      service: 'Service',
      select: 'Choisir un service',
      date: 'Date souhaitée',
      time: 'Heure souhaitée',
      details: 'Détails',
      detailsPh: 'Logement, fréquence, demandes spéciales…',
      submit: 'Demander un devis',
      note: 'En envoyant, vous acceptez d’être recontacté.',
      toast: 'Merci ! Nous revenons vers vous rapidement.',
    },
    form: { required: 'Obligatoire', invalidEmail: 'Email invalide' },

    footer: {
      copy: '© {year} MARCORP®. Développé par Reignsoft®, LLC.',
    },

    currency: { symbol: 'CHF', unit: '/heure' },
  },

  'de-CH': {
    htmlLang: 'de-CH',
    meta: {
      title: 'MARCORP® — Premium Reinigung & Betreuung',
      desc: 'MARCORP® bietet Haus- & Wohnungsreinigung, Kinderbetreuung, Chauffeurdienste, Seniorenbetreuung, Tierpflege und Concierge.',
    },
    nav: {
      home: 'Start',
      services: 'Leistungen',
      pricing: 'Preise',
      testimonials: 'Stimmen',
      reviews: 'Bewertungen',
      contact: 'Kontakt',
    },
    hero: {
      kicker: 'Premium Haus- & Betreuungsservices',
      title:
        'Wärme, Vertrauen und Luxus — <span class="accent">MARCORP®</span>',
      lead: 'Von makelloser Reinigung bis herzlicher Betreuung: MARCORP® liefert Fünf-Sterne-Service mit Herz. Geprüft, versichert und sorgfältig geschult.',
      cities: 'Tätig in Zürich • Genf • Lausanne • Basel • Bern',
      cta1: 'Leistungen ansehen',
      cta2: 'Offerte anfordern',
      badge1: '✓ Geprüftes Team',
      badge2: '✓ Umweltfreundliche Produkte',
      badge3: '✓ Flexible Termine',
      badge4: '✓ Zufriedenheitsgarantie',
      ownerName: 'Das ist Houaida',
      ownerRole:
        'Gründerin, qualitätsverliebt – die beste Freundin Ihres Zuhauses.',
    },
    services: {
      title: 'Leistungen',
      subtitle: 'Alles, was Sie brauchen – schön und zuverlässig erledigt.',
    },
    s1: {
      t: 'Unterhaltsreinigung',
      d: 'Regelmässige Pflege: Staub, Böden, Küche, Bad und Aufräumen.',
    },
    s2: {
      t: 'Grundreinigung',
      d: 'Kompletter Reset: hinter Geräten, Sockelleisten, Fugen, Lüftungen, Touchpoints.',
    },
    s3: {
      t: 'Ein-/Auszug',
      d: 'Gründliche Übergaben – ideal für Mieter, Vermieter und Agenturen.',
    },
    s4: {
      t: 'Nach Renovation',
      d: 'Baustaub & Feinteile mit HEPA-Filterung sorgfältig entfernt.',
    },
    s5: {
      t: 'Büro & Airbnb',
      d: 'Diskrete Pflege & schnelle Wechsel für makellose Bewertungen.',
    },
    s6: { t: 'Wäsche & Bügeln', d: 'Waschen, Falten, Bügeln – nach Wunsch.' },
    s7: {
      t: 'Kinderbetreuung',
      d: 'Herzliche, geprüfte Betreuung mit Kreativität und Geduld.',
    },
    s8: {
      t: 'Seniorenbetreuung',
      d: 'Alltagshilfe, Medikamente, leichte Mahlzeiten, Besorgungen — respektvoll.',
    },
    s9: {
      t: 'Chauffeur & Erledigungen',
      d: 'Schule, Termine, Flughafen, Einkäufe – pünktlich und bequem.',
    },
    s10: {
      t: 'Tierbetreuung',
      d: 'Spaziergänge, Füttern, Spiel – mit Foto-Updates.',
    },
    s11: {
      t: 'Haushüten',
      d: 'Post, Pflanzen, Sicherheitscheck, tägliche Präsenz.',
    },
    s12: {
      t: 'Concierge',
      d: 'Organisation, Garderobe, Event-Vorbereitung – massgeschneidert.',
    },

    pricing: {
      title: 'Preise',
      subtitle: 'Transparente Angebote. Hochwertige Ausführung.',
      perHour: '/Std.',
      mostPopular: 'Beliebt',
      essential: 'Essential',
      premium: 'Premium',
      signature: 'Signature',
      ctaEssential: 'Essential buchen',
      ctaPremium: 'Premium buchen',
      ctaSignature: 'Signature buchen',
      note: '* Kinder- & Seniorenbetreuung, Chauffeur & Spezialleistungen: individuelle Offerte je nach Umfang/Frequenz/Zeitfenster.',
    },
    p1: {
      i1: 'Unterhaltsreinigung',
      i2: 'Umweltfreundliche Produkte',
      i3: 'Flexible Termine',
    },
    p2: {
      i1: 'Grundreinigung oder Mix',
      i2: 'Wäsche & Bügeln als Option',
      i3: 'Priorisierte Buchung',
    },
    p3: { i1: 'Concierge-Plan', i2: 'Leadspezialist', i3: 'On-Call Support' },

    testimonials: {
      title: 'Stimmen unserer Kundschaft',
      subtitle: 'Ein paar Worte von Familien und Gastgebern.',
    },
    t1: {
      q: '« MARCORP® hat meinen Auszug entspannt – fünf Sterne. »',
      a: '— Sofia M., Genf',
    },
    t2: {
      q: '« Airbnb-Bewertung in zwei Monaten auf 4.98. Top Standards. »',
      a: '— André R., Zürich',
    },
    t3: {
      q: '« Warmherzige, kreative Kinderbetreuung. »',
      a: '— Lina & Karim, Lausanne',
    },
    t4: {
      q: '« Respektvolle Seniorenbetreuung – echte Entlastung. »',
      a: '— Marta G., Bern',
    },

    reviews: { title: 'Aktuelle Bewertungen' },
    r1: {
      q: '« Pünktlich, diskret, glänzendes Resultat. »',
      a: '— João P., Basel',
    },
    r2: {
      q: '« Haus & Tiere in besten Händen während Reisen. »',
      a: '— Aisha H., Zürich',
    },
    r3: {
      q: '« Grundreinigung super. Bügeloption dazugebucht. »',
      a: '— Daniel C., Genf',
    },

    contact: {
      title: 'Kontakt',
      subtitle:
        'Sagen Sie uns, was Sie brauchen – wir senden rasch eine Offerte.',
      name: 'Vollständiger Name',
      namePh: 'Ihr Name',
      email: 'E-Mail',
      emailPh: 'sie@beispiel.ch',
      phone: 'Telefon',
      phonePh: '+41 ...',
      service: 'Leistung',
      select: 'Leistung wählen',
      date: 'Wunschtermin (Datum)',
      time: 'Wunschtermin (Uhrzeit)',
      details: 'Details',
      detailsPh: 'Wohnung/Haus, Häufigkeit, Besonderheiten…',
      submit: 'Offerte anfordern',
      note: 'Mit dem Senden stimmen Sie der Kontaktaufnahme zu.',
      toast: 'Besten Dank! Wir melden uns in Kürze.',
    },
    form: { required: 'Pflichtfeld', invalidEmail: 'Ungültige E-Mail' },

    footer: {
      copy: '© {year} MARCORP®. Entwickelt von Reignsoft®, LLC.',
    },

    currency: { symbol: 'CHF', unit: '/Std.' },
  },
};

/* ------------- i18n core ------------- */
const i18n = (() => {
  const LANG_KEY = 'marcorp.lang';
  const selectEl = document.getElementById('lang');

  function detect() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && DICTS[saved]) return saved;

    const nav = (navigator.language || 'en').toLowerCase();
    if (nav.startsWith('fr')) return 'fr-CH';
    if (nav.startsWith('de')) return 'de-CH';
    return 'en';
  }

  let current = document.documentElement.getAttribute('data-lang') || detect();

  function setLang(lang) {
    if (!DICTS[lang]) lang = 'en';
    current = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = DICTS[lang].htmlLang || 'en';
    document.documentElement.setAttribute('data-lang', lang);
    if (selectEl) selectEl.value = lang;

    applyTranslations(lang);
    applyCurrency(lang);
    applyMeta(lang);
    applyFooterYear(lang);
  }

  function t(path) {
    const dict = DICTS[current];
    return get(dict, path) ?? '';
  }

  function get(o, path) {
    return path
      .split('.')
      .reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), o);
  }

  // Bind switcher
  selectEl?.addEventListener('change', () => setLang(selectEl.value));

  return {
    setLang,
    t,
    get current() {
      return current;
    },
  };
})();

/* ------------- Apply meta tags ------------- */
function applyMeta(lang) {
  const d = DICTS[lang];
  const titleEl = document.querySelector('title[data-i18n="meta.title"]');
  const descEl = document.querySelector('meta[data-i18n="meta.desc"]');

  if (titleEl) titleEl.textContent = d.meta.title;
  if (descEl) descEl.setAttribute('content', d.meta.desc);
}

/* ------------- Translate DOM ------------- */
function applyTranslations(lang) {
  const dict = DICTS[lang];

  // data-i18n (textContent)
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const val = deepGet(dict, key);
    if (val != null) el.textContent = String(val);
  });

  // data-i18n-html (innerHTML)
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    const val = deepGet(dict, key);
    if (val != null) el.innerHTML = String(val);
  });

  // data-i18n-ph (placeholder)
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const key = el.getAttribute('data-i18n-ph');
    const val = deepGet(dict, key);
    if (val != null) el.setAttribute('placeholder', String(val));
  });
}

function deepGet(obj, path) {
  return path
    .split('.')
    .reduce((a, k) => (a && a[k] != null ? a[k] : undefined), obj);
}

/* ------------- Currency switch (CHF/€) ------------- */
function applyCurrency(lang) {
  const { symbol, unit } = DICTS[lang].currency;
  document.querySelectorAll('[data-i18n-currency]').forEach((tag) => {
    // Expect structure: "€35<span>/hour</span>"
    const span = tag.querySelector('span');
    // Extract numeric part
    const num = (tag.textContent.match(/\d+(\.\d+)?/) || [])[0] || '';
    if (span) span.textContent = DICTS[lang].pricing.perHour || unit;
    tag.innerHTML = `${symbol}${num}<span>${
      DICTS[lang].pricing.perHour || unit
    }</span>`;
  });
}

/* ------------- Footer year with localized copy ------------- */
function applyFooterYear(lang) {
  const year = new Date().getFullYear();
  const copyEl = document.querySelector('[data-i18n="footer.copy"]');
  if (copyEl) {
    const template =
      DICTS[lang].footer.copy ||
      '© {year} MARCORP®. Developed by Reignsoft®, LLC.';
    copyEl.textContent = template.replace('{year}', String(year));
  }
}

/* ------------------ Initial boot ------------------ */
i18n.setLang(i18n.current);
