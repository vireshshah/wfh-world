import React, { useEffect } from "react";
import Datamap from "datamaps";
import lookup from "country-code-lookup";
import "./WFHWorldMap.scss";

const WFHWorldMap = props => {
  const { users } = props;
  const mapContainerId = "mapContainer";
  const allCountries = lookup.countries;
  let allCountriesCodeAlpha3 = {};
  allCountries.map((a) => { return allCountriesCodeAlpha3[a.iso3] = a.iso2;});

  function getMinCount() {
    if (users.length)
      return users.reduce((min, p) => p.count < min ? p.count : min, users[0].count);
  }

  function getMaxCount() {
    if (users.length)
      return users.reduce((max, p) => p.count > max ? p.count : max, users[0].count);
  }
  
  // create color palette function
  // color can be whatever you wish
  const paletteScale = d3.scale //eslint-disable-line
    .linear() 
    .domain([getMinCount(), getMaxCount()])
    .range(["#deebf7", "#2171b5"]);

  const renderMap = () => {
    let defaultOptions = {
      element: document.getElementById(mapContainerId),
      scope: "world",
      projection: "mercator",
      height: null,
      width: null,
      fills: {
        defaultFill: "#F5F5F5"
      },
      responsive: true,
      geographyConfig: {
        borderColor: "#DEDEDE",
        highlightBorderWidth: 2,
        // don't change color on mouse hover
        highlightFillColor: function(geography) {
          return geography["fillColor"] || "#F5F5F5";
        },
        highlightOnHover: true,
        highlightBorderColor: "#B7B7B7",
        popupTemplate: function(geography, data) {
          //this function should just return a string
          // tooltip content
          //if (!data.count > 0) return;
          return [
            '<div class="hoverinfo">',
            '<strong class="hoverInfoCountryName">',
            geography.properties.name,
            "</strong>",
            '<br><span class="hoverInfoCount">',
            data.count ? data.count.toLocaleString() : 0,
            "</span>",
            "</div>"
          ].join("");
        },
        // popupOnHover: true,
        // highlightBorderWidth: 2,
        // highlightBorderOpacity: 1
      }
    };

    for (let key in allCountriesCodeAlpha3) {
      const user = users.find(p => p.countryCodeAlpha3 === key);
      let userCount = 0,
        countryData;
      if (user) {
        userCount = user.count;
        countryData = {
          count: userCount,
          fillColor: paletteScale(userCount)
        };
      } else {
        countryData = { count: userCount };
      }
      allCountriesCodeAlpha3[key] = countryData;
    }

    defaultOptions.data = allCountriesCodeAlpha3;
    new Datamap(defaultOptions);
  };

  useEffect(() => {
    if (users.length > 0) {
      document.getElementById(mapContainerId).innerHTML = "";
      renderMap();
    }
  }, [renderMap]);

  return <div id="mapContainer"></div>;
};

export default WFHWorldMap;
