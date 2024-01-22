import { config, list } from "@keystone-6/core"
import { checkbox, password, text } from "@keystone-6/core/fields"
import {
  allowPublicQuery,
  requireSessionForAllOps,
  session,
  withAuth,
} from "./auth"

const lists = {
  Person: list({
    access: requireSessionForAllOps,
    fields: {
      name: text(),
      email: text({ isIndexed: "unique" }),
      password: password(),
      isAdmin: checkbox(),
    },
  }),
  ExampleContent: list({
    access: allowPublicQuery,
    fields: {
      name: text({
        label: "Name",
        isIndexed: true,
        validation: { isRequired: true },
      }),
    },
  }),
}

export default withAuth(
  config({
    db: {
      provider: "postgresql",
      idField: { kind: "uuid" },
      url: "postgres://postgres:password@localhost:5432/keystone",
    },
    lists,
    session,
  })
)
