import { MockModel } from '@example/mock/mock-model';
import { mockData } from '@example/mock/mock-data';

export class MockService {
  private data: MockModel[];

  constructor() {
    this.data = mockData;
    this.data.map(dataRow => {
      dataRow.experience.map(experienceItem => {
        experienceItem.from.localDate = experienceItem.from.localDate.map((dateItem, index, array) => this.convertDMY(dateItem, index, array));
        experienceItem.to.localDate = experienceItem.to.localDate.map((dateItem, index, array) => this.convertDMY(dateItem, index, array));

        let DMY = experienceItem.from.localTime.splice(0, 3).map((dateItem, index, array) => this.convertDMY(dateItem, index, array));
        let HMS = experienceItem.from.localTime.splice(0, 3).map((dateItem, index) => this.convertHMS(dateItem, index));

        experienceItem.from.localTime = [...DMY, ...HMS];


        DMY = experienceItem.to.localTime.splice(0, 3).map((dateItem, index, array) => this.convertDMY(dateItem, index, array));
        HMS = experienceItem.to.localTime.splice(0, 3).map((dateItem, index) => this.convertHMS(dateItem, index));

        experienceItem.to.localTime = [...DMY, ...HMS];

      });
    });
  }

  getData() {
    return {
      columns: this.getColumnNames(this.data),
      rows: this.data
    };
  }

  getExperienceAndSkills() {
    const experienceAndSkillArray = this.data.map(dataItem => {
      const newObject = {};

      for (const property in dataItem) {
        if (dataItem.hasOwnProperty(property)) {
          switch (property) {
            case 'experience':
              newObject[property] = dataItem[property];
              break;
            case 'skills':
              newObject[property] = dataItem[property];
              break;
            default:
              break;
          }
        }
      }
      return newObject;
    });
    return {
      rows: experienceAndSkillArray,
      columns: this.getColumnNames(experienceAndSkillArray)
    };
  }

  getUserInfo() {
    const userInfoArray = this.data.map(dataItem => {
      const newObject = {};
      for (const property in dataItem) {
        if (dataItem.hasOwnProperty(property)) {
          switch (property) {
            case 'userId':
              newObject[property] = dataItem[property];
              break;
            case 'handle':
              newObject[property] = dataItem[property];
              break;
            case 'age':
              newObject[property] = dataItem[property];
              break;
            case 'company':
              newObject[property] = dataItem[property];
              break;
            case 'website':
              newObject[property] = dataItem[property];
              break;
            case 'mail':
              newObject[property] = dataItem[property];
              break;
            default:
              break;
          }
        }
      }
      return newObject;
    });
    return {
      rows: userInfoArray,
      columns: this.getColumnNames(userInfoArray)
    };
  }

  getAdditionalData() {
    const additionalDataArray = this.data.map(dataItem => {
      const newObject = {};
      for (const property in dataItem) {
        if (dataItem.hasOwnProperty(property)) {
          switch (property) {
            case 'isStudent':
              newObject[property] = dataItem[property];
              break;
            case 'social':
              newObject[property] = dataItem[property];
              break;
            default:
              break;
          }
        }
      }
      return newObject;
    });
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

    const randomDataArray = this.data.map(dataItem => {
      const newObject = {};
      for (let i = 0; i < indexes.length; i++) {
        newObject[indexes[i]] = dataItem[indexes[i]];
      }
      return newObject;
    });

    return {
      rows: randomDataArray,
      columns: this.getColumnNames(randomDataArray)
    };
  }

  private convertHMS(dateItem, index) {
    if (index === 0) {
      return dateItem % 23 + 1;
    } else if (index === 1 || index === 2) {
      return dateItem % 60 + 1;
    }
  }

  private convertDMY(dateItem, index, array) {
    if (index === 1) {
      return dateItem % 12 + 1;
    } else if (index === 2) {
      return (dateItem % 19) + 2000;
    } else if (index === 0) {
      if (
        (array[1] % 12 + 1) === 1
        || (array[1] % 12 + 1) === 4
        || (array[1] % 12 + 1) === 6
        || (array[1] % 12 + 1) === 9
        || (array[1] % 12 + 1) === 11
      ) {
        return dateItem % 28 + 1;
      }
      return dateItem % 31 + 1;
    }
  }

  private getColumnNames(data: any[]) {
    const columns = [];
    for (const property in data[0]) {
      if (data[0].hasOwnProperty(property)) {
        columns.push(property);
      }
    }
    return columns;
  }
}
