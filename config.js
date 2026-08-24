/**
 * FAITHBASE_CONFIG
 * ------------------------------------------------------------------
 * This is the ONE file that changes per client deployment.
 * Client: St. Augustine Choir (OLQN Abuja)
 * Subdomain: staugustinechoir.faithbase.ng
 * ------------------------------------------------------------------
 */
const FAITHBASE_CONFIG = {

  authScreensLive: false,

  // ── Identity ──────────────────────────────────────────────────
  communityName: "St. Augustine Choir",
  communityShortName: "St. Augustine Choir",
  patronSaint: "St. Augustine of Hippo",
  patronFeastDay: "August 28",
  parish: "Our Lady Queen of Nigeria (OLQN) Catholic Church",
  diocese: "Archdiocese of Abuja",
  location: "Abuja, Nigeria",

  // ── Voice / Copy ──────────────────────────────────────────────
  tagline: "He who sings prays twice.",
  welcomeMessage: "St. Augustine Choir leads the people of OLQN in song — from Sunday Mass to feast day celebrations — forming voices and hearts in the tradition of our patron, St. Augustine of Hippo. Join us, and lend your voice to the liturgy.",

  whatWeDo: [
    {
      title: "Sunday Worship",
      body: "We lead the congregation in song at every Sunday Mass, preparing hymns and responsorials that carry the liturgy."
    },
    {
      title: "Feast Day Celebrations",
      body: "From the Solemnity of our patron to Christmas and Holy Week, we prepare special repertoire for OLQN's major celebrations."
    },
    {
      title: "Formation & Rehearsal",
      body: "Weekly rehearsals build both musicianship and prayer — every member grows as a singer and as a disciple."
    }
  ],

  // ── Brand Colours (sparkling maroon & gold) ────────────────────
  colors: {
    maroonDeep:   "#3E0F1C",  // hero / header background
    maroon:       "#6B1F35",  // primary brand colour
    maroonLight:  "#8A2E45",  // hovers, gradients
    gold:         "#C9A227",  // base gold
    goldBright:   "#F0CC5C",  // sparkle highlight, CTA hover
    parchment:    "#F7EFE0",  // light section background
    ivory:        "#FFFBF3",  // card background
    ink:          "#241019",  // body text on light backgrounds
    inkSoft:      "#5C3A44"   // secondary text on light backgrounds
  },

  // ── Backend (per-client isolated Supabase project) ─────────────
  supabase: {
    url: "https://ltoottyqfikodfylwjda.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0b290dHlxZmlrb2RmeWx3amRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NDg2MTAsImV4cCI6MjEwMDEyNDYxMH0.twoLMnFjamhNquyJmrpwPnb-NpDz5qAbwVeTovbWbd0"
  },

  // ── Push notifications ──────────────────────────────────────────
  vapidPublicKey: "",

  // ── Feature toggles ─────────────────────────────────────────────
  features: {
    blog: true,
    leaderboard: false,
    events: true,
    prayerRequests: true,
    choirModule: true,
    formationModule: false,
    fraternalModule: false,
    guildModule: false,
    welfareModule: false
  },

  // ── Routes ───────────────────────────────────────────────────────
  routes: {
    register: "auth/register.html",
    login: "auth/login.html",
    dashboard: "member/dashboard.html",
    privacy: "privacy.html"
  }
};
