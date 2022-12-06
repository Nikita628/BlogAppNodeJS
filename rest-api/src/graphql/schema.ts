import { buildSchema } from "graphql";

export const schema = buildSchema(`
    input SignupData {
        password: String!
        name: String!
        email: String!
    }

    type Post {
        id: String!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String
    }

    type User {
        id: String!
        name: String!
        email: String!
        status: String!
        posts: [Post]
    }

    type LoginResult {
        token: String
        userId: String
    }

    type Status {
        status: String
    }

    type RootMutation {
        signup(signupData: SignupData): User
        updateStatus(status: String): Status
    }

    type RootQuery {
        login(email: String, password: String): LoginResult
        getStatus: Status
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
