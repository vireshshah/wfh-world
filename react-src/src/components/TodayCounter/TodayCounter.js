import React, { useState, useEffect } from "react";
import { Grid, Header } from "semantic-ui-react";
import axios from "axios";
import moment from "moment";
import "./TodayCounter.scss";
import { Loader } from 'semantic-ui-react'
import converter from "number-to-words";

const TodayCounter = props => {
  const { users } = props;
  const [totalCount, setTotalCount] = useState();

  async function fetchData() {
    const startDate =  moment().subtract(365,'d').format("YYYY-MM-DDT00:00:00.000") + "Z";
    const endDate = moment().add(1, 'd').format("YYYY-MM-DDT00:00:00.000") + "Z";
    const response = await axios.get(
      `${props.server}/api/users/count/${startDate}/${endDate}`
    );
    if (response && response.data) {
      const totalCount =
        response.data.length && response.data[0].totalCount > 0
          ? response.data[0].totalCount
          : 0;
      setTotalCount(totalCount);
    }
  }

  useEffect(() => {
    fetchData();
  }, [users]);

  return (
    <Grid id="todayCounter">
      <Grid.Row centered>
        <Header as="h3">
          Stay home to help in global fight against Corona
        </Header>
        <Header as="h1">
          {totalCount > 0 ? totalCount.toLocaleString() : <Loader active inline='centered' size='large'></Loader>}  
        </Header>
        <Header as="h5">
          {totalCount > 0 ? converter.toWords(totalCount) : ''}
        </Header>
        <Header as="h2">
          people around the world are working from home since month to help fight Corona virus spread.
        </Header>
      </Grid.Row>
    </Grid>
  );
};

export default TodayCounter;
