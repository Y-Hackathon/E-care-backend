import dayjs from 'dayjs';

const getTimestamp = (): number => dayjs().unix();

export default getTimestamp;
