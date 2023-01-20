import { NextApiRequest, NextApiResponse } from 'next';
import MemberModel from '@/models/member/member_model';
import BadReqError from './error/bad_request_error';
import { responseSymbol } from 'next/dist/server/web/spec-compliant/fetch-event';

async function add(req: NextApiRequest, res: NextApiResponse) {
  const { uid, email, displayName, photoURL } = req.body;
  if (uid === undefined || uid === null) {
    throw new BadReqError('uid -> 누락되었어요.');
  }
  if (email === undefined || email === null) {
    throw new BadReqError('email -> 누락되었어요.');
  }

  const addResult = await MemberModel.add({ uid, email, displayName, photoURL });
  if (addResult.result === true) {
    return res.status(200).json(addResult);
  } else {
    res.status(500).json(addResult);
  }
}

async function findByScreenName(req: NextApiRequest, res: NextApiResponse) {
  const { screenName } = req.query;
  if (screenName === undefined || screenName === null) {
    throw new BadReqError('screenName이 누락되었어요.');
  }
  //findByScreenName(screenName)이 Array일 수도 있음
  const extractScreenName = Array.isArray(screenName) ? screenName[0] : screenName;
  const findResult = await MemberModel.findByScreenName(extractScreenName);

  if (findResult === null) {
    return res.status(404).end();
  }
  res.status(200).json(findResult);
}

const MemberCtrl = {
  add,
  findByScreenName,
};

export default MemberCtrl;