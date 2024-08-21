import { GraphQLError } from "graphql";
import { getJobs, getJob, getJobsByCompany, createJob, deleteJob, updateJob } from "./db/jobs.js"
import { getCompany } from "./db/companies.js"

export const resolvers = {
  Query: {
    job: async (__root, { id }) => {
      const job = await getJob(id)
      if (!job) {
        throw notFoundError("No Job found with id " + id)
      }
      return job
    },
    jobs: () => getJobs(),
    company: async (__root, { id }) => {
      const company = await getCompany(id)
      if (!company) {
        throw notFoundError("No Company found with id " + id)
      }
      return company
    }
  },
  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job) => getCompany(job.companyId)
  },
  Company: {
    jobs: (company) => getJobsByCompany(company.id)
  },
  Mutation: {
    createJob: (__root, { input: { title, description } }) => {
      const companyId = "Gu7QW9LcnF5d"
      return createJob({ companyId, title, description })
    },
    deleteJob: (__root, { id }) => deleteJob(id),
    updateJob: (__root, { input: { id, title, description } }) => updateJob({ id, title, description })
  }
}

function notFoundError(message) {
    throw new GraphQLError(message, {
      extensions: { code: "NOT_FOUND" }
    })
}

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length)
}