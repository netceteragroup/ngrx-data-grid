# ngrx-data-grid
Highly-customizable grid based on the [Angular](https://angular.io/) and the [NgRx](https://ngrx.io/) framework.

[![Build Status](https://github.com/netceteragroup/ngrx-data-grid/actions/workflows/build.yml/badge.svg)](https://github.com/netceteragroup/ngrx-data-grid/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/netceteragroup/ngrx-data-grid/badge.svg)](https://coveralls.io/github/netceteragroup/ngrx-data-grid?branch=master)

## Features
* Pagination
* Sorting
* Column selection
* Column resizing
* Column reordering
* Row selection (single and multiple)
* Customizable filtering
* Customizable column width
* Customizable cell content
* Customizable nested grid
* Update of the grid data
## Installing
```bash
$ npm install --save ngrx-data-grid
or
$ yarn add ngrx-data-grid
```
## Usage
### Configuration
Import the module inside your module:
```typescript
@NgModule({
    imports: [
        ... other imports
        NgRxDataGridModule
    ]
})
```
In the component create configuration for the grid:
```typescript
const gridConfig = GridConfigBuilder.gridConfig()
                     .withSelection(SelectionType.Checkbox) // multiple selection of rows
                     .withColumnReorder() // enable column reordering
                     .withColumnResize() // enable column resizing
                     .build();
```
Also for each column create an individual configuration. Here comes the customization into play: 
```typescript
const columnsConfig = [{
    headerName: 'First Name',
    field: 'firstName',
    visible: true,
    sortAvailable: true,
    filterAvailable: true,
    filter: {
        component: MyCustomFilterComponent // custom component to implement the filtering
    },
    component: MyCustomComponent, // custom component to render the cell,
    width: 150, // sets the column width,
    hideInSelection: true // hides the column from the column selection list
}, 
{
    headerName: 'Last Name',
    field: 'lastName',
    visible: true,
    sortAvailable: false,
    filterAvailable: false,
    valueGetter: (dataItem) => ... //customize the cell content
}];
```
### Initialization
Dispatch the init action to initialize the grid.
``` typescript
const data = ... // data to be rendered in the grid
const gridName = ... // name of the grid

this.store.dispatch(new initGrid({
    gridName,
    data,
    columnsConfig,
    numberOfItemsPerPage
}));
```
### HTML rendering
Add HTML tag to render the grid on the appropriate place.
```html
<ngrx-data-grid [config]="gridConfig"
                [gridName]="gridName">
</ngrx-data-grid>
```
## Demo
Github pages: https://netceteragroup.github.io/ngrx-data-grid

Stackblitz: https://netceteragroup.github.io/ngrx-data-grid/stackblitz.html

## Contributing
Please refer to our individual [contributing guide](https://github.com/netceteragroup/ngrx-data-grid/blob/master/CONTRIBUTING.md) to see how you may contribute to the project.

## License
MIT © [Netcetera](https://github.com/netceteragroup)
