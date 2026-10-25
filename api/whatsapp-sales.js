import { createHandler } from "../lib/whatsapp-sales-handler.js";

export const config = { api: { bodyParser: false, responseLimit: "1mb" }, maxDuration: 30 };
export default createHandler();
