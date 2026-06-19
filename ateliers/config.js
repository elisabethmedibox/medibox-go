/* Config Supabase partagée par les pages d'atelier et l'éditeur.
   Clés PUBLIQUES uniquement (anon) — jamais de service_role ici. */
window.ATELIER_DB = {
  url: "https://uozfgssyswxjapscklan.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvemZnc3N5c3d4amFwc2NrbGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDEwODksImV4cCI6MjA5MDE3NzA4OX0.XoO9fWh0PqgEmt7zvlEfJeUcnfT2hVP_o5ORlXr7ZDQ",
  fnUrl: "https://uozfgssyswxjapscklan.supabase.co/functions/v1/atelier-contenu",
  mediaUrl: "https://uozfgssyswxjapscklan.supabase.co/functions/v1/atelier-media"
};
