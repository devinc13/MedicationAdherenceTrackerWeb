import React from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';

const DosageDiv = styled.div`
  margin-left: 20px;
`;

const AdherenceDiv = styled.div`
  margin-left: 40px;
`;

class Graph extends React.Component {
  graphError = function() {
    return (
      <div>
        <h3>Error creating graph</h3>
      </div>
      );
  }

  render() {
    let user = this.props.user;
    let medications = user.medications;
    //console.log(this.props.user.medications.edges[0].node.dosages.edges[0].node.id);
    console.log(medications);
    let unwrappedMedications = medications.edges.map(edge => edge.node);
    console.log(unwrappedMedications);
    console.log(unwrappedMedications[0].dosages.edges[0]);


    return (
    	<div>
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

		  </div>
    );
  }
}

export default Relay.createContainer(Graph, {
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
                    dosageAdherences(first: 20) {
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
