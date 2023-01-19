import BadReqError from './bad_request_error';

export default function checkSupportMethod(supportMethod: string[], method?: string) {
  if (supportMethod.indexOf(method!) === -1) {
    //error 반환(상시 나는 에러)
    throw new BadReqError('지원하지 않는 method');
  }
}
