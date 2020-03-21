import React from "react";
import { Table, Grid } from "semantic-ui-react";
import ReactCountryFlag from "react-country-flag";
import "./WFHWorldTable.scss";

const WFHWorldTable = props => {
  let { users } = props;
  const secondColumnStart = Math.floor(users.length / 2);
  let users1 = users.slice(0, secondColumnStart).map(user => (
    <Table.Row key={user.countryCodeAlpha3}>
      <Table.Cell collapsing>
        <ReactCountryFlag
          style={{
            width: "2em",
            height: "2em"
          }}
          svg
          title={user.countryName}
          countryCode={user.countryCodeAlpha2}
        />
      </Table.Cell>
      <Table.Cell>{user.countryName}</Table.Cell>
      <Table.Cell> {user.count ? user.count.toLocaleString() : 0}</Table.Cell>
    </Table.Row>
  ));

  let users2 = users.slice(secondColumnStart).map(user => (
    <Table.Row key={user.countryCodeAlpha3}>
      <Table.Cell collapsing>
        <ReactCountryFlag
          style={{
            width: "2em",
            height: "2em"
          }}
          svg
          title={user.countryName}
          countryCode={user.countryCodeAlpha2}
        />
      </Table.Cell>
      <Table.Cell>{user.countryName}</Table.Cell>
      <Table.Cell> {user.count ? user.count.toLocaleString() : 0}</Table.Cell>
    </Table.Row>
  ));

  return (
    <Grid id="wfhWorldTable">
      <Grid.Row centered>
        <Grid.Column width={8}>
          <Table celled unstackable>
            <Table.Header className="wfhWorldTableHeader">
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Country</Table.HeaderCell>
                <Table.HeaderCell>Count</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{users1}</Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Column width={8}>
          <Table celled unstackable className="wfhWorldTable2">
            <Table.Header className="wfhWorldTableHeader">
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Country</Table.HeaderCell>
                <Table.HeaderCell>Count</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{users2}</Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default WFHWorldTable;
