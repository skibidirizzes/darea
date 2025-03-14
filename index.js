const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.incrementViewerCount = functions.https.onCall(async (data, context) => {
    const change = data.change;

    if (typeof change !== 'number') {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "change" argument which is a number.');
    }

    const viewerCountRef = admin.firestore().collection('metrics').doc('redirectViewers');

    try {
        await admin.firestore().runTransaction(async (transaction) => {
            const doc = await transaction.get(viewerCountRef);
            let newCount = 1;
            if (doc.exists) {
                newCount = (doc.data().count || 0) + change;
                newCount = Math.max(0, newCount);
            }
            transaction.set(viewerCountRef, { count: newCount }, { merge: true });
        });
        return { success: true }; // Return success
    } catch (error) {
        console.error("Transaction failed: ", error);
        throw new functions.https.HttpsError("internal", "Could not update viewer count.");
    }
});
