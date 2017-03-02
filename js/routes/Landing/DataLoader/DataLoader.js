import { graphql } from 'react-apollo';

import pick from 'lodash.pick';

import CURRENT_USER_QUERY from './currentUser.query.graphql';
import GET_USER_QUERY from './getUser.query.graphql';
import GET_DOCS_QUERY from './getDocs.query.graphql';
import GET_DOC_QUERY from './getDoc.query.graphql';
import USERS_BY_ROLES_QUERY from './usersByRoles.query.graphql';

import GET_TIMELINE_QUERY from './getTimeline.query.graphql';

const currentUser = graphql(CURRENT_USER_QUERY, {
  options: ({ user }) => ({ variables: { id: user.id } }),
  skip: ({ user }) => user.isEmpty,
});

const usersByRoles = (...roles) => graphql(USERS_BY_ROLES_QUERY, {
  skip: ({ open }) => !open,
  options: ({ queryString }) => ({
    variables: {
      queryString,
      roles,
    },
  }),
  props: ({ data: { loading, usersByRoles = [] } }) => ({
    loading,
    users : usersByRoles,
  }),
});

const user = graphql(GET_USER_QUERY, {
  skip: ({ docLoading, id }) => docLoading || typeof id === 'undefined',
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
  props: ({ data: { loading, getUser } }) => ({
    loading,
    user : getUser,
  }),
});

const doc = graphql(GET_DOC_QUERY, {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
  props: ({ data: { loading, getDoc } }) => ({
    loading,
    doc : getDoc,
  }),
});

const docs = graphql(GET_DOCS_QUERY, {
  options: (ownProps) => ({
    variables: {
      query : {
        client      : ownProps.client,
        insurer     : ownProps.insurer,
        state       : ownProps.state,
        queryString : ownProps.queryString,
        sortConfig  : pick(ownProps.sortConfig, ['key', 'direction']),
      },
    },
  }),
  props: ({ ownProps, data: { loading, getDocs: { cursor, length, docs = [] } = {}, fetchMore } }) => ({
    loading,
    docs,
    cursor,
    length,
    loadMoreDocs() {
      return fetchMore({
        variables: {
          query : {
            cursor,
            client      : ownProps.client,
            insurer     : ownProps.insurer,
            state       : ownProps.state,
            queryString : ownProps.queryString,
            sortConfig  : pick(ownProps.sortConfig, ['key', 'direction']),
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newDocs = fetchMoreResult.data.getDocs.docs;

          return {
            getDocs : {
              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              cursor: fetchMoreResult.data.getDocs.cursor,

              length: fetchMoreResult.data.getDocs.length,

              // Put the new docs at the end of the list
              docs: [
                ...previousResult.getDocs.docs,
                ...newDocs,
              ],
            },
          };
        },
      });
    },
  }),
});

const timeline = graphql(GET_TIMELINE_QUERY, {
  options: (ownProps) => ({
    variables: {
      query : {
        doc : ownProps.id ? ownProps.id : null,
        ns : 'DOCUMENTS',
      },
    },
  }),
  props: ({ ownProps, data: { loading, timeline: { cursor, result = [] } = {}, fetchMore } }) => ({
    loading,
    result,
    cursor,
    loadMore() {
      return fetchMore({
        variables: {
          cursor,
          query : {
            doc : ownProps.id ? ownProps.id : null,
            ns : 'DOCUMENTS',
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newActivities = fetchMoreResult.data.timeline.result;

          return {
            timeline : {
              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              cursor: fetchMoreResult.data.timeline.cursor,

              // Put the new activies at the end of the list
              result: [
                ...previousResult.timeline.result,
                ...newActivities,
              ],
            },
          };
        },
      });
    },
  }),
});

export default { currentUser, usersByRoles, user, doc, docs, timeline };

