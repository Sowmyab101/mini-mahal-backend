const db = require('./services/firebase');

async function test() {

    try {

        const testDoc = await db.collection('test').add({
            message: 'Firestore Connected',
            createdAt: new Date()
        });

        console.log('Success!');
        console.log('Document ID:', testDoc.id);

    } catch (error) {

        console.error('Firestore Error:', error);

    }

}

test();