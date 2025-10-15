import { prisma } from '../db/prisma.js';

export const EmailRepository = {
    async createLog({to, subject, html, status, providerMessageId = null, error = null}) {
        return prisma.emailLog.create({
            data: {to, subject, html, status, providerMessageId, error}
        });
    }
}
