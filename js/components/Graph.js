import React from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';

var DatePicker = require("react-bootstrap-date-picker");

const DosageDiv = styled.div`
  margin-left: 20px;
`;

const AdherenceDiv = styled.div`
  margin-left: 40px;
`;

const MainDiv = styled.div`
  overflow: auto;
  height: 500px;
`;

class Graph extends React.Component {
  constructor() {
    super();
    var value = new Date().toISOString();

    this.state = {
      value: value
    };
  }

  handleChange(value, formattedValue) {
    this.setState({
      value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z" 
      formattedValue: formattedValue // Formatted String, ex: "11/19/2016" 
    });

    console.log(value);

    this.props.relay.setVariables({
      startTimestamp: value,
      endTimestamp: value,
    });
  }

  // componentDidUpdate(){
  //   var hiddenInputElement = document.getElementById("start-date-datepicker");
  //   console.log(hiddenInputElement.value); // ISO String, ex: "2016-11-19T12:00:00.000Z" 
  //   console.log(hiddenInputElement.getAttribute('data-formattedvalue')) // Formatted String, ex: "11/19/2016"


  // }

  render() {
    let user = this.props.user;
    let medications = user.medications;
    let unwrappedMedications = medications.edges.map(edge => edge.node);

    return (
    	<MainDiv>
	      {unwrappedMedications.map(medication =>
          <div key={medication.id}>
            {medication.name}
            {medication.dosages.edges.map(dosageEdge =>
              <DosageDiv key={dosageEdge.node.id}>
                Dosage amount: {dosageEdge.node.dosageAmount} Window start: {dosageEdge.node.windowStartTime} Window end: {dosageEdge.node.windowEndTime}
                {dosageEdge.node.dosageAdherences.edges.map(adherenceEdge => 
                  <AdherenceDiv key={adherenceEdge.node.id}>
                    {adherenceEdge.node.timestamp}
                    {adherenceEdge.node.adhered ? " Adhered" : " Not-Adhered"}
                  </AdherenceDiv>
                )}
              </DosageDiv>
            )}
          </div>
        )}

      <DatePicker id="start-date-datepicker" value={this.state.value} onChange={this.handleChange.bind(this)} />

		  </MainDiv>
    );
  }
}

export default Relay.createContainer(Graph, {
  initialVariables: {
    startTimestamp: null,
    endTimestamp: null,
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
