import React from 'react';
import persons from './services/persons.js'

const Number = (props) => {
  return (
    <tr>
      <td>{props.person.name}</td>
      <td>{props.person.number}</td>
      <td><button onClick={() => props.ondelete(props.person.name)}>poista</button></td>
    </tr>
  )
}

const Input = (props) => {
  return <tr><td>{props.label}:</td><td><input value={props.value} onChange={props.onchange}/></td></tr>
}

const FilterForm = (props) => {
  return (
    <table>
      <tbody>
        <Input label="rajaa näytettäviä" value={props.filter} onchange={props.onchange}/>
      </tbody>
    </table>
  );
}

const SubmitForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <h2>Lisää uusi / muuta olemassaolevan numeroa</h2>
      <table>
        <tbody>
          <Input label="nimi" value={props.name} onchange={props.onNameChange}/>
          <Input label="numero" value={props.number} onchange={props.onNumberChange}/>
        </tbody>
      </table>
      <div>
        <button type="submit">lisää</button>
      </div>
    </form>
  );
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="message">
      {message}
    </div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      newContact : {
        name: '',
        number: ''
      },
      filter : '',
      notification : null
    }
  }

  componentDidMount() {
    this.refresh()
  }

  inputName(event) {
    this.setState({newContact: {name: event.target.value, number: this.state.newContact.number}});
  }

  inputNumber(event) {
    this.setState({newContact: {name: this.state.newContact.name, number: event.target.value}});
  }

  inputFilter(event) {
    this.setState({filter: event.target.value});
  }

  refresh() {
    persons.getAll()
      .then(ps => {
        this.setState({ persons: ps })
      })
  }

  submit(event) {
    event.preventDefault();

    let person = {
        name : this.state.newContact.name,
        number : this.state.newContact.number
    };

    if(!person.name) {
      alert("Tyhjä henkilönnimi!");
      return;
    } else if(!person.number) {
      alert("Tyhjä puhelinnumero!");
      return;
    }

    let existing = null
    if((existing = this.state.persons.find(p => p.name === person.name))){
      if(window.confirm(existing.name + " on jo luettelossa, korvataanko vanha numero uudella?")) {
        person.id = existing.id;
        persons.update(existing.id, person)
          .then(() => {
            this.refresh();
            this.notify("muutettiin " + person.name + " numero " + person.number);
          })
          .catch(er => {
            this.notify("henkilö " + person.name + " on jo valitettavasti poistettu palvelimelta");
            this.refresh();
          });
      }
      return;
    } else {
      persons.create(person)
        .then(ps => {
          this.refresh();
          this.setState({
            newContact : {
              name: '',
              number: ''
            }
          });
          this.notify("lisättiin " + person.name);
        });
    }
  }

  notify(message) {
    this.setState({
      notification: message
    })
    setTimeout(() => {
      this.setState({notification: null})
    }, 5000)
  }

  delete(personName) {
    if(window.confirm("poistetaanko " + personName)) {
      let person = this.state.persons.find(p => p.name === personName);
      persons.remove(person.id)
        .then(() => {
          this.refresh();
          this.notify("poistettiin " + person.name);
        });
    }
  }

  render() {
    let filtered = this.state.filter ? this.state.persons.filter(p => p.name.toLowerCase().includes(this.state.filter.toLowerCase())) : this.state.persons;
    return (
      <div>
        <h1>Puhelinluettelo</h1>
        <Notification message={this.state.notification} />
        <FilterForm
          value={this.state.filter}
          onchange={(ev) => this.inputFilter(ev)}/>
        {/* miksi käyttää formia jos kuitenkin kaikki toiminnallisuus pitää kirjoittaa erikseen? samahan se olisi vaan laittaa buttonin onclick */}
        <SubmitForm
          name={this.state.newContact.name}
          number={this.state.newContact.number}
          onSubmit={(ev) => this.submit(ev)}
          onNameChange={(ev) => this.inputName(ev)}
          onNumberChange={(ev) => this.inputNumber(ev)}/>

        <h2>Numerot</h2>
        <table>
          <tbody>
            {filtered.map(p => <Number key={p.name} person={p} ondelete={(name)=>this.delete(name)}/>)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default App
