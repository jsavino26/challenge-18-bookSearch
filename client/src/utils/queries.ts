// filepath: c:\Users\Albert\bootcamp\challenge-18-bookSearch\client\src\utils\queries.ts
import { gql } from '@apollo/client';

export const GET_ME = gql`
  query Me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;