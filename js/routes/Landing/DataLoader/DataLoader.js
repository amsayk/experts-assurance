import { graphql } from 'react-apollo';

import pick from 'lodash.pick';

import CURRENT_USER_QUERY from './currentUser.query.graphql';
import GET_USER_QUERY from './getUser.query.graphql';
import GET_DOCS_QUERY from './getDocs.query.graphql';
import GET_MORE_DOCS_QUERY from './moreDocs.query.graphql';
import GET_DOC_QUERY from './getDoc.query.graphql';
// import USERS_BY_ROLES_QUERY from './usersByRoles.query.graphql';
import ES_USERS_BY_ROLES_QUERY from './esUsersByRoles.query.graphql';
import ES_SEARCH_DOCS_QUERY from './esSearchDocs.query.graphql';

import GET_TIMELINE_QUERY from './getTimeline.query.graphql';

import GET_RECENT_DOCS_QUERY from './recentDocs.query.graphql';

// import GET_PENDING_DOCS from './pendingDocs.query.graphql';
// import GET_MORE_PENDING_DOCS from './morePendingDocs.query.graphql';

import GET_OPEN_DOCS from './openDocs.query.graphql';
import GET_MORE_OPEN_DOCS from './moreOpenDocs.query.graphql';

import GET_UNPAID_DOCS from './unpaidDocs.query.graphql';
import GET_MORE_UNPAID_DOCS from './moreUnpaidDocs.query.graphql';

import GET_INVALID_DOCS from './invalidDocs.query.graphql';
import GET_MORE_INVALID_DOCS from './moreInvalidDocs.query.graphql';

// import GET_CLOSED_DOCS from './closedDocs.query.graphql';
// import GET_MORE_CLOSED_DOCS from './moreClosedDocs.query.graphql';

import DASHBOARD_QUERY from './dashboard.query.graphql';

import GET_DOC_OBSERVATIONS_QUERY from './getDocObservations.query.graphql';

import LAST_REFNO_QUERY from './getLastRefNo.query.graphql';

import SEARCH_MATCHING_USERS_QUERY from './searchMatchingUsers.query.graphql';

import GET_DOC_FILES_QUERY from './getDocFiles.query.graphql';

const currentUser = graphql(CURRENT_USER_QUERY, {
  options: ({ user }) => ({ variables: { id: user.id } }),
  skip: ({ user }) => user.isEmpty,
});

const esUsersByRoles = (...roles) => graphql(ES_USERS_BY_ROLES_QUERY, {
  skip: ({ open }) => !open,
  options: ({ queryString }) => ({
    variables: {
      queryString,
      roles,
    },
  }),
  props: ({ data: { loading, esUsersByRoles = { hits: [] } } }) => ({
    loading,
    result : esUsersByRoles,
  }),
});

// const usersByRoles = (...roles) => graphql(USERS_BY_ROLES_QUERY, {
//   skip: ({ open }) => !open,
//   options: ({ queryString }) => ({
//     variables: {
//       queryString,
//       roles,
//     },
//   }),
//   props: ({ data: { loading, usersByRoles = [] } }) => ({
//     loading,
//     users : usersByRoles,
//   }),
// });

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
        manager     : ownProps.manager,
        state       : ownProps.state,
        queryString : ownProps.queryString,
        sortConfig  : pick(ownProps.sortConfig, ['key', 'direction']),
      },
    },
  }),
  props: ({ ownProps, data: { loading, getDocs: { cursor = 0, length = 0, docs = [] } = {}, fetchMore } }) => ({
    loading,
    docs,
    cursor,
    length,
    loadMoreDocs() {
      return fetchMore({
        query: GET_MORE_DOCS_QUERY,
        variables: {
          query : {
            cursor,
            client      : ownProps.client,
            manager     : ownProps.manager,
            state       : ownProps.state,
            queryString : ownProps.queryString,
            sortConfig  : pick(ownProps.sortConfig, ['key', 'direction']),
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newDocs = fetchMoreResult.getDocs.docs;

          return {
            getDocs    : {
              __typename : 'DocsFetchResponse',

              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              cursor: fetchMoreResult.getDocs.cursor,

              length: previousResult.getDocs.length,

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

const searchDocs = graphql(ES_SEARCH_DOCS_QUERY, {
  skip: ({ search }) => !search.q || search.q.length < 2,
  options: ({ search }) => ({
    variables: {
      queryString : search.q,
      state       : search.state,
    },
  }),
  props: ({ ownProps, data: { loading, esSearchDocs: { length = 0, hits = [] } = {} } }) => ({
    loading,
    hits,
    length,
  }),
});

const timeline = graphql(GET_TIMELINE_QUERY, {
  skip: ({ timelineDisplayMatches, id }) => !timelineDisplayMatches && !id,
  options: (ownProps) => ({
    variables: {
      query : {
        doc : ownProps.id ? ownProps.id : null,
        ns : 'DOCUMENTS',
      },
    },
  }),
  props: ({ ownProps, data: { loading, timeline: { cursor = 0, result = [] } = {}, fetchMore } }) => ({
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
          const newActivities = fetchMoreResult.timeline.result;

          return {
            __typename : 'TimelineResponse',
            timeline   : {
              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              cursor: fetchMoreResult.timeline.cursor,

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


const recentDocs = graphql(GET_RECENT_DOCS_QUERY, {
  props: ({ data: { loading, docs = [] } }) => ({
    loading,
    docs,
  }),
});

// const pendingDocs = graphql(GET_PENDING_DOCS, {
//   options: (ownProps) => ({
//     variables: {
//       durationInDays : ownProps.durationInDays,
//       sortConfig     : pick(ownProps.sortConfig, ['key', 'direction']),
//     },
//   }),
//   props: ({ ownProps, data: { loading, pendingDashboard: { cursor = 0, length = 0, docs = [] } = {}, fetchMore } }) => ({
//     data: {
//       loading,
//       docs,
//       cursor,
//       length,
//     },
//     loadMore() {
//       return fetchMore({
//         query: GET_MORE_PENDING_DOCS,
//         variables: {
//           cursor,
//           durationInDays : ownProps.durationInDays,
//           sortConfig     : pick(ownProps.sortConfig, ['key', 'direction']),
//         },
//         updateQuery: (previousResult, { fetchMoreResult }) => {
//           const newDocs = fetchMoreResult.pendingDashboard.docs;
//
//           return {
//             pendingDashboard : {
//               // By returning `cursor` here, we update the `loadMore` function
//               // to the new cursor.
//               cursor: fetchMoreResult.pendingDashboard.cursor,
//
//               // length: fetchMoreResult.data.pendingDashboard.length,
//
//               // Put the new docs at the end of the list
//               docs: [
//                 ...previousResult.pendingDashboard.docs,
//                 ...newDocs,
//               ],
//             },
//           };
//         },
//       });
//     },
//   }),
// });

const openDocs = graphql(GET_OPEN_DOCS, {
  options: (ownProps) => ({
    variables: {
      durationInDays : ownProps.durationInDays,
      sortConfig     : pick(ownProps.sortConfig, ['key', 'direction']),
    },
  }),
  props: ({ ownProps, data: { loading, openDashboard: { cursor = 0, length = 0, docs = [] } = {}, fetchMore } }) => ({
    data: {
      loading,
      docs,
      cursor,
      length,
    },
    loadMore() {
      return fetchMore({
        query: GET_MORE_OPEN_DOCS,
        variables: {
          cursor,
          durationInDays : ownProps.durationInDays,
          sortConfig     : pick(ownProps.sortConfig, ['key', 'direction']),
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newDocs = fetchMoreResult.openDashboard.docs;

          return {
            openDashboard : {
              __typename : 'DocsFetchResponse',

              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              cursor: fetchMoreResult.openDashboard.cursor,

              length: previousResult.openDashboard.length,

              // Put the new docs at the end of the list
              docs: [
                ...previousResult.openDashboard.docs,
                ...newDocs,
              ],
            },
          };
        },
      });
    },
  }),
});

const unpaidDocs = graphql(GET_UNPAID_DOCS, {
  options: (ownProps) => ({
    variables: {
      durationInDays : ownProps.durationInDays,
      sortConfig     : pick(ownProps.sortConfig, ['key', 'direction']),
    },
  }),
  props: ({ ownProps, data: { loading, getUnpaidDocs: { cursor = 0, length = 0, docs = [] } = {}, fetchMore } }) => ({
    data: {
      loading,
      docs,
      cursor,
      length,
    },
    loadMore() {
      return fetchMore({
        query: GET_MORE_UNPAID_DOCS,
        variables: {
          cursor,
          durationInDays : ownProps.durationInDays,
          sortConfig     : pick(ownProps.sortConfig, ['key', 'direction']),
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newDocs = fetchMoreResult.getUnpaidDocs.docs;

          return {
            getUnpaidDocs : {
              __typename : 'DocsFetchResponse',

              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              cursor: fetchMoreResult.getUnpaidDocs.cursor,

              length: previousResult.getUnpaidDocs.length,

              // Put the new docs at the end of the list
              docs: [
                ...previousResult.getUnpaidDocs.docs,
                ...newDocs,
              ],
            },
          };
        },
      });
    },
  }),
});

const invalidDocs = graphql(GET_INVALID_DOCS, {
  options: (ownProps) => ({
    fetchPolicy : 'network-only',
    variables   : {
      durationInDays : -1,
      category       : ownProps.category,
      sortConfig     : pick(ownProps.sortConfig, ['key', 'direction']),
    },
  }),
  props: ({ ownProps, data: { loading, getInvalidDocs: { cursor = 0, length = 0, docs = [] } = {}, fetchMore } }) => ({
    data: {
      loading,
      docs,
      cursor,
      length,
    },
    loadMore() {
      return fetchMore({
        query: GET_MORE_INVALID_DOCS,
        variables: {
          cursor,
          durationInDays : -1,
          category       : ownProps.category,
          sortConfig     : pick(ownProps.sortConfig, ['key', 'direction']),
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newDocs = fetchMoreResult.getInvalidDocs.docs;

          return {
            getInvalidDocs : {
              __typename : 'DocsFetchResponse',

              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              cursor: fetchMoreResult.getInvalidDocs.cursor,

              length: previousResult.getInvalidDocs.length,

              // Put the new docs at the end of the list
              docs: [
                ...previousResult.getInvalidDocs.docs,
                ...newDocs,
              ],
            },
          };
        },
      });
    },
  }),
});

// const closedDocs = graphql(GET_CLOSED_DOCS, {
//   options: (ownProps) => ({
//     variables: {
//       includeCanceled : ownProps.includeCanceled,
//       durationInDays : ownProps.durationInDays,
//       sortConfig     : pick(ownProps.sortConfig, ['key', 'direction']),
//     },
//   }),
//   props: ({ ownProps, data: { loading, closedDashboard: { cursor = 0, length = 0, docs = [] } = {}, fetchMore } }) => ({
//     data: {
//       loading,
//       docs,
//       cursor,
//       length,
//     },
//     loadMore() {
//       return fetchMore({
//         query: GET_MORE_CLOSED_DOCS,
//         variables: {
//           cursor,
//           includeCanceled : ownProps.includeCanceled,
//           durationInDays  : ownProps.durationInDays,
//           sortConfig      : pick(ownProps.sortConfig, ['key', 'direction']),
//         },
//         updateQuery: (previousResult, { fetchMoreResult }) => {
//           const newDocs = fetchMoreResult.closedDashboard.docs;
//
//           return {
//             closedDashboard : {
//               // By returning `cursor` here, we update the `loadMore` function
//               // to the new cursor.
//               cursor: fetchMoreResult.closedDashboard.cursor,
//
//               // length: fetchMoreResult.closedDashboard.length,
//
//               // Put the new docs at the end of the list
//               docs: [
//                 ...previousResult.closedDashboard.docs,
//                 ...newDocs,
//               ],
//             },
//           };
//         },
//       });
//     },
//   }),
// });


const dashboard = graphql(DASHBOARD_QUERY, {
  options: ({}) => ({
    variables: {
    },
  }),
  props: ({ ownProps, data: { loading, dashboard: { /*pending = {}, */open = {}, closed = {}, canceled = {} } = {} } }) => ({
    loading,
    info: {
      // pending,
      open,
      closed,
      canceled,
    },
  }),
});


const lastRefNo = graphql(LAST_REFNO_QUERY, {
  options: ({ dateMission }) => ({
    fetchPolicy : 'network-only',
    variables: {
      now : dateMission,
    },
  }),
  props: ({ data: { loading, getLastRefNo = { value: 0 } } }) => ({
    loading,
    lastRefNo : getLastRefNo.value,
  }),
});

const searchMatchingUsers = graphql(SEARCH_MATCHING_USERS_QUERY, {
  options: (ownProps) => ({
    variables : {
      type        : ownProps.type,
      displayName : ownProps.displayName || '',
      email       : ownProps.email       || '',
    },
  }),
  skip: ({ userKey, displayName, email }) => userKey === 'id' || (!displayName && !email),
  props: ({ data: { loading, users = [] } }) => ({
    loading,
    users,
  }),
});

const docFiles = graphql(GET_DOC_FILES_QUERY, {
  options: (ownProps) => ({
    variables : {
      id : ownProps.id,
    },
  }),
  props: ({ data: { loading, getDocFiles = [] } }) => ({
    loading,
    files : getDocFiles,
  }),
});

const docObserations = graphql(GET_DOC_OBSERVATIONS_QUERY, {
  options: (ownProps) => ({
    variables : {
      id : ownProps.id,
    },
  }),
  props: ({ data: { loading, getDocObservations = { items : [], cursor : 0, prevCursor : 0 } } }) => ({
    loading,
    observations : getDocObservations,
  }),
});

export default {
  currentUser/*, usersByRoles*/,
  esUsersByRoles,
  searchDocs,
  user,
  doc,
  docs,
  timeline,
  recentDocs,
  // pendingDocs,
  openDocs,
  // closedDocs,
  dashboard,
  lastRefNo,
  searchMatchingUsers,
  docFiles,
  docObserations,
  unpaidDocs,
  invalidDocs,
};

