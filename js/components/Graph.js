import React from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';

const DatePicker = require("react-bootstrap-date-picker");
const dateFormat = require('dateformat');

const AdherenceDiv = styled.div`
  margin: 1%;
  display: inline-block;
  width: 12%;
  vertical-align: top;
  text-align: center;
`;

const GreenCircleDiv = styled.div`
  border: 2px solid #a1a1a1;
  padding: 20px;
  background: green;
  width: 2px;
  border-radius: 100%;
  margin-left: auto;
  margin-right: auto;
  width: 1%;
`;

const YellowCircleDiv = styled.div`
  border: 2px solid #a1a1a1;
  padding: 20px;
  background: yellow;
  width: 2px;
  border-radius: 100%;
  margin-left: auto;
  margin-right: auto;
  width: 1%;
`;

const RedCircleDiv = styled.div`
  border: 2px solid #a1a1a1;
  padding: 20px;
  background: red;
  width: 2px;
  border-radius: 100%;
  margin-left: auto;
  margin-right: auto;
  width: 1%;
`;

const MainDiv = styled.div`
  overflow: auto;
  height: 500px;
`;

const DatePickerDiv = styled.div`
  margin: 2%;
  display: inline-block;
  width: 46%;
  vertical-align: top;
  height: 100%;
`;

class Graph extends React.Component {
  constructor() {
    super();
    var currentDate = new Date();
    // Start with the current week
    currentDate.setDate(currentDate.getDate() - 7);
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    var endDate = new Date(currentDate);
    // Show end date as inclusive
    endDate.setDate(currentDate.getDate() + 6);

    this.state = {
      value: currentDate.toISOString(),
      endValue: endDate.toISOString(),
    };
  }

  handleChange(value, formattedValue) {
    let start = new Date(Date.parse(value));
    start.setHours(0);

    let end = new Date(Date.parse(value));

    // We only want a weekly window
    end.setDate(end.getDate() + 7);
    end.setHours(0);

    // Make sure we show an inclusive date
    let inclusiveEnd = new Date(end);
    inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);

    this.setState({
      value: start.toISOString(),
      endValue: inclusiveEnd.toISOString(),
    });

    this.props.relay.setVariables({
      startTimestamp: start.toISOString(),
      endTimestamp: end.toISOString(),
    });
  }

  render() {
    let startDate = new Date(Date.parse(this.state.value));
    let data = [];
    for (let i = 0; i < 7; i++) {
      data.push({date: dateFormat(startDate, "yyyy-mm-dd"), adherences: []});
      startDate.setDate(startDate.getDate() + 1);
    }

    let user = this.props.user;
    let medications = user.medications;
    let unwrappedMedications = medications.edges.map(edge => edge.node);

    // Loop through data and create list of adherence entries grouped by date
    let unwrappedMedicationsLength = unwrappedMedications.length;
    for (let i = 0; i < unwrappedMedicationsLength; i++) {
      let medication = unwrappedMedications[i];
      let unwrappedDosages = medication.dosages.edges.map(edge => edge.node);
      let unwrappedDosagesLength = unwrappedDosages.length;

      for (let j = 0; j < unwrappedDosagesLength; j++) {
        let dosage = unwrappedDosages[j];
        let unwrappedDosageAdherences = dosage.dosageAdherences.edges.map(edge => edge.node);
        let unwrappedDosageAdherencesLength = unwrappedDosageAdherences.length;

        for (let k = 0; k < unwrappedDosageAdherencesLength; k++) {
          let dosageAdherence = unwrappedDosageAdherences[k];
          let dataEntry = data.find(d => {
            let dosageAdherenceDate = new Date(Date.parse(dosageAdherence.timestamp));
            return d.date == dateFormat(dosageAdherenceDate, "yyyy-mm-dd");
          });

          if (dataEntry) {
            let adherenceEntry = {};
            adherenceEntry.adhered = dosageAdherence.adhered;
            adherenceEntry.timestamp = dosageAdherence.timestamp;
            adherenceEntry.notes = dosageAdherence.notes;
            adherenceEntry.dosageAmount = dosage.dosageAmount;
            adherenceEntry.medicationName = medication.name;
            dataEntry.adherences.push(adherenceEntry);
          }
        }
      }
    }

    // Compute if we should show a green, yellow or red face (green == all adhered, yellow == some, red == none)
    for (let i = 0; i < 7; i++) {
      let dataEntry = data[i];
      let adherencesLength = dataEntry.adherences.length;
      let adheredCount = 0;
      for (let j = 0; j < adherencesLength; j++) {
        if (dataEntry.adherences[j].adhered) {
          adheredCount++;
        }
      }

      if (adheredCount == adherencesLength) {
        dataEntry.result = "green";
      } else if (adheredCount == 0) {
        dataEntry.result = "red";
      } else {
        dataEntry.result = "yellow";
      }
    }

    return (
    	<MainDiv>
        <div>
          <DatePickerDiv>
            From:
            <DatePicker id="start-date-datepicker" value={this.state.value} onChange={this.handleChange.bind(this)} showClearButton={false} />
          </DatePickerDiv>

          <DatePickerDiv>
            To:
            <DatePicker id="end-date-datepicker" value={this.state.endValue} disabled={true} showClearButton={false} />
          </DatePickerDiv>
        </div>

        {data.map(dataEntry =>
          <AdherenceDiv key={dataEntry.date}>
            {dataEntry.result == "green" ? <GreenCircleDiv></GreenCircleDiv> : ""}
            {dataEntry.result == "yellow" ? <YellowCircleDiv></YellowCircleDiv> : ""}
            {dataEntry.result == "red" ? <RedCircleDiv></RedCircleDiv> : ""}
            <br />
            {dataEntry.date}
          </AdherenceDiv>
        )}

		  </MainDiv>
    );
  }
}

export default Relay.createContainer(Graph, {
  initialVariables: {
    startTimestamp: null,
    endTimestamp: null,
  },
  prepareVariables: prevVariables => {
    if (prevVariables.startTimestamp == null) {
      var start = new Date();
      start.setDate(start.getDate() - 7);
      start.setHours(0);
      start.setMinutes(0);
      start.setSeconds(0);
      start.setMilliseconds(0);
      var end = new Date(start);
      // Make sure we include the current day by starting at 00:00:00 of the next day
      end.setDate(end.getDate() + 8);

      return {
        ...prevVariables,
        startTimestamp: start.toISOString(),
        endTimestamp: end.toISOString(),
      }
    } else {
      return prevVariables;
    }
  },
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        medications(first: 20) {
          edges {
            node {
              id,
              name,
              start,
              end,
              repeating,
              notes,
              dosages(first: 20) {
                edges {
                  node {
                    id,
                    dosageAmount,
                    windowStartTime,
                    windowEndTime,
                    dosageAdherences(first: 20, startTimestamp: $startTimestamp, endTimestamp: $endTimestamp) {
                      edges {
                        node {
                          id,
                          adhered,
                          timestamp,
                          notes,
                        }
                      }
                    }
                  }
                }
              }
            },
          },
        },
      }
    `,
  },
});
