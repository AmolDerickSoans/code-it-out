import React from 'react';
import ReactDOM from 'react-dom/client';
import VisualFilter from 'react-visual-filter';

const FIELDS = [
  {name: 'name', type: 'text', label: 'Name', operators: ['eq', 'ne', 'ct', 'nct', 'sw', 'fw', 'in', 'nn']},
  {name: 'age', type: 'number', label: 'Age', operators: ['eq', 'ne',  'gt', 'lt']},
  {name: 'birth_date', type: 'date', label: 'Birth date', operators: ['eq', 'ne', 'gt', 'lt', 'in', 'nn']},
  {name: 'preference', type: 'list',  label: 'Language', operators: ['eq', 'ne'], list: [
    {name: 'python', label: 'Python'},
    {name: 'javascript', label: 'JavaScript'},
    {name: 'go', label: 'Go'}
  ]}
];

class App extends React.Component {
  handleChange(data) {
    console.log(data);
  }

  ReactDOM() {
    return(
      <VisualFilter
        fields={FIELDS}
        dateFormat="Y-M-D"
        onChange={this.handleChange} />
    )
  }
}

ReactDOM(<App />, document.getElementById("root"));
export default App;