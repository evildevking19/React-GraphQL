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
    createJob: (__root, { input: { title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication")
      }
      return createJob({ companyId: user.companyId, title, description })
    },

    deleteJob: async (__root, { id }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication")
      }
      const job = await deleteJob(id, user.companyId)
      if (!job) {
        throw notFoundError("No Job found with id " + id)
      }
      return job
    },

    updateJob: async (__root, { input: { id, title, description } }, { user }) => {
      if (!user) {
        throw unauthorizedError("Missing authentication")
      }
      const job = await updateJob({ id, companyId: user.companyId, title, description })
      if (!job) {
        throw notFoundError("No Job found with id " + id)
      }
      return job
    }
  }
}

function notFoundError(message) {
    return new GraphQLError(message, {
      extensions: { code: "NOT_FOUND" }
    })
}

function unauthorizedError(message) {
  return new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" }
  })
}

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length)
}