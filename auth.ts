import { createAuth } from "@keystone-6/auth"
import { statelessSessions } from "@keystone-6/core/session"
import type { ListOperationAccessControl } from "@keystone-6/core/dist/declarations/src/types"
import type { AccessOperation } from "@keystone-6/core/dist/declarations/src/types/config/access-control"

export type Session = {
  data: {
    id: string
    name: string
  }
}

const isAuthenticated = ({ session }: { session?: Session }): boolean => {
  return session?.data?.id !== undefined
}

const requireSessionForAllOps: {
  operation: ListOperationAccessControl<AccessOperation, any>
} = {
  operation: isAuthenticated,
}

const allowPublicQuery: {
  operation: {
    query: ListOperationAccessControl<"query", any>
    create: ListOperationAccessControl<"create", any>
    update: ListOperationAccessControl<"update", any>
    delete: ListOperationAccessControl<"delete", any>
  }
} = {
  operation: {
    query: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
}

const { withAuth } = createAuth({
  listKey: "Person",
  identityField: "email",
  sessionData: "id, name",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
  },
})

const session = statelessSessions({
  secret: "-- EXAMPLE COOKIE SECRET; CHANGE ME --",
})

export {
  withAuth,
  session,
  allowPublicQuery,
  isAuthenticated,
  requireSessionForAllOps,
}
