import { commitMutation, graphql } from 'react-relay'

const mutation = graphql`
  mutation LoginMutation($input: LoginInput!) {
    login(input: $input) {
      user {
        id
      }
    }
  }
`

function commit(environment, input, onCompleted, onError) {

  commitMutation(environment, {
    mutation,
    variables,
    onCompleted,
    onError,
  })
}

export default commit;