import { graphql } from 'react-apollo';

import CURRENT_USER_QUERY from './currentUser.query.graphql';
import GET_USERS_QUERY from './getUsers.query.graphql';
import GET_MORE_USERS_QUERY from './moreUsers.query.graphql';
// import SEARCH_USERS_QUERY from './searchUsers.query.graphql';
import ES_SEARCH_USERS_QUERY from './esSearchUsers.query.graphql';

import pick from 'lodash.pick';

const users = graphql(GET_USERS_QUERY, {
  options: (ownProps) => ({
    variables: {
      query : {
        role        : ownProps.role,
        queryString : ownProps.queryString,
        sortConfig  : pick(ownProps.sortConfig, ['key', 'direction']),
      },
    },
  }),
  props: ({ ownProps, data: { loading, getUsers: { cursor, length, users = [] } = {}, fetchMore } }) => ({
    loading,
    users,
    cursor,
    length,
    loadMoreUsers() {
      return fetchMore({
        query: GET_MORE_USERS_QUERY,
        variables: {
          query : {
            cursor,
            role        : ownProps.role,
            queryString : ownProps.queryString,
            sortConfig  : pick(ownProps.sortConfig, ['key', 'direction']),
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newUsers = fetchMoreResult.data.getUsers.users;

          return {
            getUsers : {
              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              cursor: fetchMoreResult.data.getUsers.cursor,

              // length: fetchMoreResult.data.getUsers.length,

              // Put the new users at the end of the list
              users: [
                ...previousResult.getUsers.users,
                ...newUsers,
              ],
            },
          };
        },
      });
    },
  }),
});

// const search = graphql(SEARCH_USERS_QUERY, {
//   options: (ownProps) => ({
//     variables: {
//       queryString : ownProps.queryString,
//     },
//   }),
//   props: ({ ownProps, data: { loading, searchUsers = [] } }) => ({
//     loading,
//     users : searchUsers,
//   }),
// });

const esSearch = graphql(ES_SEARCH_USERS_QUERY, {
  options: (ownProps) => ({
    variables: {
      queryString : ownProps.queryString,
    },
  }),
  props: ({ ownProps, data: { loading, esSearchUsers = { hits: [] } } }) => ({
    loading,
    result : esSearchUsers,
  }),
});

const currentUser = graphql(CURRENT_USER_QUERY, {
  options: ({ user }) => ({ variables: { id: user.id } }),
  skip: ({ user }) => user.isEmpty,
});

export default { users, currentUser,/* search,*/ esSearch };

