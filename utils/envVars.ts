import 'dotenv/config';

const appPort: string = process.env.PORT || '';
const adminId: string = process.env.ADMIN_TG_ID || '';
const enPercent: string = process.env.EN_PERCENT || '';
const esv: string = process.env.ESV || '';

export { adminId, appPort, enPercent, esv };
