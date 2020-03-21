import React, { useState } from "react";
import { Grid, Button, Message } from "semantic-ui-react";
import axios from "axios";
import getUserCountry from "js-user-country";
import Cookies from "js-cookie";
import "./WFHButton.scss";

const WFHButton = props => {
  const messageBannerTimeout = 5000;
  const { socket, server, onUserUpdated } = props;
  const isCookieSet = Cookies.get("pappu");
  const [isButtonVisible, setIsButtonVisible] = useState(!isCookieSet);
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const handleDismiss = timeout => {
    setIsMessageVisible(true);

    setTimeout(() => {
      setIsMessageVisible(false);
    }, timeout);
  };

  const handleSubmit = e => {
    // Prevent browser refresh
    e.preventDefault();

    const timezone = getUserCountry();
    const countryCodeAlpha2 = timezone.id;
    
    const user = {
      countryCodeAlpha2: countryCodeAlpha2
    };

    axios({
      method: "put",
      responseType: "json",
      url: `${server}/api/users`,
      data: user
    })
      .then(response => {
        //socket.emit("update", response.data.result);
        onUserUpdated(response.data.result);
        Cookies.set("pappu", true, { expires: 30 });
        setIsButtonVisible(false);
        handleDismiss(messageBannerTimeout);
      })
      .catch(err => {
        if (err.response) {
          if (err.response.data) {
          }
        } else {
        }
      });
  };

  return isButtonVisible && !isMessageVisible ? (
    <Grid id="wfhButton">
      <Grid.Row centered>
        <Button positive size="massive" onClick={handleSubmit}>
          Click here if you are also working from home
        </Button>
      </Grid.Row>
    </Grid>
  ) : isMessageVisible ? (
    <Message id="wfhMessage" color="blue" onDismiss={handleDismiss}>
      Thanks for letting world know that you are working from home.
    </Message>
  ) : null;
};

export default WFHButton;
