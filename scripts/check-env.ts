const required = ["datasf_dataset_ID","datasf_app_token"];
const missing = required.filter(k => !process.env[k]);
if (missing.length) { console.error("Missing env:", missing.join(", ")); process.exit(1); }
