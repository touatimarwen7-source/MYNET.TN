// إضافة منع التعديل بعد أول عرض

// أضف هذا الكود في TenderService.js قبل أي UPDATE:

async checkIfTenderLocked(tenderId) {
    const pool = getPool();
    try {
        const result = await pool.query(
            'SELECT first_offer_at FROM tenders WHERE id = $1',
            [tenderId]
        );
        return result.rows[0]?.first_offer_at !== null;
    } catch (error) {
        throw new Error(`Failed to check tender lock: ${error.message}`);
    }
}

async lockTenderAfterFirstOffer(tenderId) {
    const pool = getPool();
    try {
        await pool.query(
            'UPDATE tenders SET first_offer_at = CURRENT_TIMESTAMP WHERE id = $1 AND first_offer_at IS NULL',
            [tenderId]
        );
    } catch (error) {
        console.error('Failed to lock tender:', error.message);
    }
}

// في updateTender:
async updateTender(tenderId, updateData, userId) {
    const isLocked = await this.checkIfTenderLocked(tenderId);
    if (isLocked) {
        throw new Error('Tender cannot be modified after first offer has been received');
    }
    // ... باقي الكود
}
