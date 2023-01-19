import CustomServerError from './custom_server_error';
import { NextApiResponse } from 'next';

const handleError = (err: unknown, res: NextApiResponse) => {
  let unknownErr = err;
  //예외처리 먼저 하고 다른 처리를 하는게 편함
  if (err instanceof CustomServerError === false) {
    unknownErr = new CustomServerError({ statusCode: 499, message: 'unknown err' });
  }

  const custonError = unknownErr as CustomServerError;
  res
    .status(custonError.statusCode) //statusCode 전달
    .setHeader('location', custonError.location ?? '')
    .send(custonError.serializeErrors()); // 에러 응답에 body 전달
};

export default handleError;
