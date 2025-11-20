// Server Time Check - إضافة هذا في OfferService.js قبل decryption:

async decryptOfferData(offerId, userId) {
    const pool = getPool();
    
    try {
        const result = await pool.query(
            `SELECT o.*, t.opening_date, t.buyer_id, t.status as tender_status
             FROM offers o 
             JOIN tenders t ON o.tender_id = t.id 
             WHERE o.id = $1`,
            [offerId]
        );

        if (!result.rows[0]) {
            throw new Error('Offer not found');
        }

        const offer = result.rows[0];
        const isBuyer = userId === offer.buyer_id;
        const currentTime = new Date();
        const openingDate = new Date(offer.opening_date);

        // ✅ Server Time Check - منع فك التشفير قبل موعد الفتح
        if (!isBuyer) {
            throw new Error('Only the buyer can decrypt offer data');
        }

        if (currentTime < openingDate) {
            throw new Error(`Offer cannot be decrypted before opening date: ${openingDate.toISOString()}`);
        }

        if (offer.tender_status !== 'opened') {
            throw new Error('Tender must be in opened status to decrypt offers');
        }

        // فك التشفير
        const decrypted = KeyManagementService.decryptData(
            offer.encrypted_data,
            offer.encryption_iv,
            null,
            process.env.MASTER_ENCRYPTION_KEY
        );

        return JSON.parse(decrypted);
    } catch (error) {
        throw new Error(`Failed to decrypt offer: ${error.message}`);
    }
}
