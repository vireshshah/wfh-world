import React from "react";
import { Header, Icon, Grid } from "semantic-ui-react";
import "./Footer.scss";

const Footer = () => {
  return (
    <Grid id="footer">
      <Grid.Row centered>
        <Header as="h3">
          ॐ सर्वे भवन्तु सुखिनः<br /> सर्वे सन्तु निरामयाः।<br /> सर्वे भद्राणि पश्यन्तु<br />
          मा कश्चिद्दुःखभाग्भवेत।<br /> ॐ शान्तिः शान्तिः शान्तिः॥
        </Header>
        <Header as="h3" id="englishSloka">
          May all sentient beings be at peace.<br />May no one suffer from illness.<br />
          May all see what is auspicious.<br />May no one suffer.<br /> Om peace, peace,
          peace.
        </Header>
        <Header floated="left">Made with</Header>
        <Icon color="red" name="heart" floated="left" />
        <Header className="by" floated="left">
          by
        </Header>
        <Header
          color="blue"
          floated="left"
          as="a"
          className="viresh"
          target="_blank"
          href="https://www.linkedin.com/in/vireshvshah"
        >
          Viresh Shah
        </Header>
      </Grid.Row>
    </Grid>
  );
};

export default Footer;
