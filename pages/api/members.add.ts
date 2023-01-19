import { NextApiRequest, NextApiResponse } from 'next';
import FirebaseAdmin from '@/models/firebase_admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body;
  if (uid === undefined || uid === null) {
    res.status(400).json({ result: false, message: 'uid -> 누락되었어요.' });
  }
  if (email === undefined || email === null) {
    res.status(400).json({ result: false, message: 'email -> 누락되었어요.' });
  }

  try {
    const addResult = await FirebaseAdmin.getInstance()
      .Firebase.collection('members')
      .doc(uid)
      .set({
        uid,
        email,
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      });
    const screenName = (email as string).replace('@gmail.com', '');
    await FirebaseAdmin.getInstance()
      .Firebase.collection('screen_names')
      .doc(screenName)
      .set({
        uid,
        email,
        displayName: displayName ?? '',
        photoURL: photoURL ?? '',
      });

    return res.status(200).json({ result: true, id: addResult });
  } catch (err) {
    console.error(err);
    /** server side쪽의 에러 */
    res.status(500).json({ result: false });
  }
}
