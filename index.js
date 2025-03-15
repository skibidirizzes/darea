// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.incrementViewerCount = functions.https.onRequest(async (req, res) => { // Changed to onRequest
    const change = parseInt(req.query.change); // Get change from query parameter

    if (isNaN(change)) { // Check for valid number
        res.status(400).send('Invalid change parameter'); // Send error response
        return;
    }

    const viewerCountRef = admin.firestore().collection('metrics').doc('redirectViewers');

    try {
        await admin.firestore().runTransaction(async (transaction) => {
            const doc = await transaction.get(viewerCountRef);
            let newCount = 1;
            if (doc.exists) {
                newCount = (doc.data().count || 0) + change;
                newCount = Math.max(0, newCount);  // Ensure count >= 0
            }
            transaction.set(viewerCountRef, { count: newCount }, { merge: true });
        });
        res.status(200).send('Counter updated'); // Send success response
    } catch (error) {
        console.error("Transaction failed: ", error);
        res.status(500).send('Counter update failed'); // Send error response
    }
});
