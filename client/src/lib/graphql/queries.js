import { ApolloClient, ApolloLink, createHttpLink, gql, concat, InMemoryCache } from "@apollo/client"
import { getAccessToken } from "../auth.js";

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" })

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    operation.setContext({
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
  }
  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: 'network-only'
  //   },
  //   watchQuery: {
  //     fetchPolicy: 'network-only'
  //   }
  // }
})

export async function createJob({ title, description }) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `;

  const { data } = await apolloClient.mutate({ mutation, variables: { input: { title, description } } })
  return data.job;
}

export const companyByIdQuery = gql`
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`

export async function getJob(id) {
  const query = gql`
    query JobById($id: ID!) {
      job(id: $id) {
        id
        date
        title
        description
        company {
          id
          name
        }
      }
    }
  `

  const { data } = await apolloClient.query({ query, variables: { id } })
  return data.job
}

export async function getJobs() {
  const query = gql`
    query Jobs {
      jobs {
        id
        date
        title
        company {
          id
          name
        }
      }
    }
  `;

  const { data } = await apolloClient.query({ query })
  return data.jobs
}