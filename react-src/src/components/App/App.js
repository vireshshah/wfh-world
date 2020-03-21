import React, { Component } from "react";
import { Container } from "semantic-ui-react";
import axios from "axios";
import io from "socket.io-client";
import WFHWorldTable from "../WFHWorldTable/WFHWorldTable";
import TodayCounter from "../TodayCounter/TodayCounter";
import WFHButton from "../WFHButton/WFHButton";
import WFHWorldMap from "../WFHWorldMap/WFHWorldMap";
import Footer from "../Footer/Footer";
import moment from "moment";
import lookup from "country-code-lookup";
class App extends Component {
  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || "";
    //this.socket = io.connect(this.server);

    this.state = {
      users: []
    };

    this.fetchUsers = this.fetchUsers.bind(this);
    this.appendAdditionalUserFields = this.appendAdditionalUserFields.bind(
      this
    );
    this.handleUserUpdated = this.handleUserUpdated.bind(this);
  }

  // Place socket.io code inside here
  componentDidMount() {
    this.fetchUsers();
    // this.socket.on("update", data => {
    //   this.handleUserUpdated(data);
    // });
  }

  appendAdditionalUserFields = users => {
    users.map(
      user => {
          user.countryCodeAlpha2 = lookup.byIso(
            user.countryCodeAlpha3
          ).iso2;
          user.countryName = lookup.byIso(user.countryCodeAlpha2).country;
          return '';
        }
    );
    return users;
  };

  fetchUsers() {
    const startDate =  moment().subtract(30,'d').format("YYYY-MM-DDT00:00:00.000") + "Z";
    const endDate =  moment().add(1, 'd').format("YYYY-MM-DDT00:00:00.000") + "Z";
    axios
      .get(`${this.server}/api/users/${startDate}/${endDate}`)
      .then(response => {
        let users = this.appendAdditionalUserFields(response.data);
        this.setState({ users: users });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleUserUpdated(user) {
    let users = this.state.users.slice();
    let found = false;
    for (let i = 0, n = users.length; i < n; i++) {
      if (users[i].countryCodeAlpha3 === user.countryCodeAlpha3) {
        users[i].countryCodeAlpha3 = user.countryCodeAlpha3;
        const newCount = users[i].count - user.count;
        users[i].count = users[i].count + (newCount <= 0 ? 1 : newCount);
        found = true;
        break; // Stop this loop, we found it!
      }
    }

    if (!found) {
      let userNew = [];
      userNew.push({
        countryCodeAlpha3: user.countryCodeAlpha3,
        count: user.count
      });
      userNew = this.appendAdditionalUserFields(userNew);
      users = users.concat(userNew);
    }
    this.setState({ users: users });
  }

  render() {
    return (
      <div>
        <Container>
          <TodayCounter users={this.state.users} server={this.server} />
          {/* <WFHButton onUserUpdated={this.handleUserUpdated} socket={this.socket} server={this.server}></WFHButton> */}
          <WFHButton onUserUpdated={this.handleUserUpdated} server={this.server}></WFHButton>
          <WFHWorldMap users={this.state.users} />
          <WFHWorldTable
            onUserUpdated={this.handleUserUpdated}
            users={this.state.users}
            server={this.server}
          />
          <Footer />
        </Container>
      </div>
    );
  }
}

export default App;
