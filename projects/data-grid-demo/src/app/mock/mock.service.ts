import { User } from './user';
import { mockData } from './mock-data';
import * as R from 'ramda';

export class MockService {
  private data: User[];

  constructor() {
    this.data = mockData;
    R.map(this.iterateMockData, this.data);
  }

  getData() {
    return {
      columns: this.getColumnNames(this.data),
      rows: this.data
    };
  }

  getExperienceAndSkills() {
    const experienceAndSkillArray = R.map(dataItem => {
      const {experience, skills} = dataItem;
      return {
        experience,
        skills
      };
    }, this.data);

    return {
      rows: experienceAndSkillArray,
      columns: this.getColumnNames(experienceAndSkillArray)
    };
  }

  getUserInfo() {
    const userInfoArray = R.map(dataItem => {
      const {userId, handle, age, company, website, mail} = dataItem;
      return {
        userId,
        handle,
        age,
        company,
        website,
        mail
      };
    }, this.data);
    return {
      rows: userInfoArray,
      columns: this.getColumnNames(userInfoArray)
    };
  }

  getAdditionalData() {
    const additionalDataArray = R.map(dataItem => {
      const {isStudent, social} = dataItem;
      return {
        isStudent,
        social
      };
    }, this.data);
    return {
      rows: additionalDataArray,
      columns: this.getColumnNames(additionalDataArray)
    };
  }

  getRandomData() {
    const columns = this.getColumnNames(this.data);

    const randomNum = Math.ceil(Math.random() * columns.length);
    const indexes = [];
    const duplicatesStorage = {};

    for (let i = 0; i < randomNum; i++) {
      const randomIndex = Math.floor(Math.random() * columns.length);
      if (duplicatesStorage[randomIndex] === undefined) {
        indexes.push(columns[randomIndex]);
        duplicatesStorage[columns[randomIndex]] = true;
      } else {
        break;
      }
    }

    const randomDataArray = R.map(dataItem => {
      const newObject = {};
      for (let i = 0; i < indexes.length; i++) {
        newObject[indexes[i]] = dataItem[indexes[i]];
      }
      return newObject;
    }, this.data);
    return {
      rows: randomDataArray,
      columns: this.getColumnNames(randomDataArray)
    };
  }

  private iterateMockData = dataRow => {
    R.map(this.iterateExperienceItem, dataRow.experience);
    dataRow.fromDate = new Date(dataRow.experience[0].from.fromDate);
  }

  private iterateExperienceItem = experienceItem => {
    experienceItem.from.localDate = experienceItem.from.localDate.map((dateItem, index, array) => this.convertDMY(dateItem, index, array));
    experienceItem.to.localDate = experienceItem.to.localDate.map((dateItem, index, array) => this.convertDMY(dateItem, index, array));

    let DMY = experienceItem.from.localTime.splice(0, 3).map((dateItem, index, array) => this.convertDMY(dateItem, index, array));
    let HMS = experienceItem.from.localTime.splice(0, 3).map((dateItem, index) => this.convertHMS(dateItem, index));

    experienceItem.from.localTime = [...DMY, ...HMS];


    DMY = experienceItem.to.localTime.splice(0, 3).map((dateItem, index, array) => this.convertDMY(dateItem, index, array));
    HMS = experienceItem.to.localTime.splice(0, 3).map((dateItem, index) => this.convertHMS(dateItem, index));

    experienceItem.to.localTime = [...DMY, ...HMS];

  }

  private convertHMS(dateItem, index) {
    const fn = R.cond([
      [R.equals(0), R.always(dateItem % 23 + 1)],
      [R.T, R.always(dateItem % 60 + 1)]
    ]);
    return fn(index);
  }

  private convertDMY(dateItem, index, array) {
    const fn = R.cond([
      [R.equals(1), R.always(dateItem % 12 + 1)],
      [R.equals(2), R.always((dateItem % 19) + 2000)],
      [R.equals(0), () => R.cond([
        [R.equals(1), R.always(dateItem % 28 + 1)],
        [R.equals(4), R.always(dateItem % 28 + 1)],
        [R.equals(6), R.always(dateItem % 28 + 1)],
        [R.equals(9), R.always(dateItem % 28 + 1)],
        [R.equals(11), R.always(dateItem % 28 + 1)],
        [R.T, R.always(dateItem % 31 + 1)]
      ])(array[1] % 12 + 1)]
    ]);
    return fn(index);
  }

  private getColumnNames(data: any[]) {
    return Object.keys(data[0]);
  }
}
