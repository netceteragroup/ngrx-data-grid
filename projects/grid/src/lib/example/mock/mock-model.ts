export interface MockModel {
  userId: string;
  handle: string;
  company: string;
  website: string;
  mail: string;
  age: number;
  skills: Array<string>;
  isStudent: boolean;
  experience: {
    title: string,
    company: string,
    from: {
      fromDate: number,
      localDate: Array<number>,
      localTime: Array<number>
    },
    to: {
      toDate: number,
      localDate: Array<number>,
      localTime: Array<number>;
    },
    current: boolean;
  }[];
  social: {
    youtube: string,
    linkedIn: string,
    instagram: string
  };
}
