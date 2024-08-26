import dayjs from 'dayjs';
import { IUser, IChat, IDM } from '@typings/db';

const makeSection = (chatData: (IDM | IChat)[]) => {
  return chatData.reduce((a, c) => {
    if (!a[dayjs(c.createdAt).format('YYYY-MM-DD')]) {
      a[dayjs(c.createdAt).format('YYYY-MM-DD')] = [c];
    } else {
      a[dayjs(c.createdAt).format('YYYY-MM-DD')].push(c);
    }
    return a;
  }, {} as { [key: string]: (IDM | IChat)[] });
};

export default makeSection;
