import { graphql } from 'react-apollo';

import pick from 'lodash.pick';

import ES_QUERY_DOCS_QUERY from './esQueryDocs.query.graphql';
import GET_VEHICLE_BY_PLATE_NUMBER_QUERY from './vehicleByPlateNumber.query.graphql';
import SEARCH_VEHICLES_QUERY from './searchVehicles.query.graphql';

import moment from 'moment';

function rangeToDate(range) {
  if (range) {
    return {
      from: momentToDate(range.from || range.get('from')),
      to: momentToDate(range.to || range.get('to')),
    };
  } else {
    return null;
  }
}

function momentToDate(date) {
  if (date) {
    return +moment.utc(date);
  } else {
    return null;
  }
}

const queryDocs = graphql(ES_QUERY_DOCS_QUERY, {
  skip: ({ search, skip }) => typeof skip === 'undefined' ? !search.q || search.q.length < 2 : skip,
  options: ({ search }) => ({
    variables: {
      query : {
        q                      : search.q,

        company                : search.company,
        client                 : search.client,
        manager                : search.manager,
        agent                  : search.agent,

        vehicleModel           : search.vehicleModel,
        vehicleManufacturer    : search.vehicleManufacturer,

        validator              : search.validator,
        closer                 : search.closer,
        user                   : search.user,

        missionRange           : rangeToDate(search.missionRange),
        range                  : rangeToDate(search.range),
        // validationRange     : rangeToDate(search.validationRange),
        closureRange           : momentToDate(search.closureRange),

        state                  : search.state,

        lastModified           : momentToDate(search.lastModified),

        sortConfig             : search.sortConfig ? pick(search.sortConfig, ['key', 'direction']) : null,
      },
    },
  }),
  props: ({ ownProps, data: { loading, esQueryDocs: { took = 0, cursor = 0, length = 0, hits = [] } = {}, fetchMore } }) => ({
    loading,
    hits,
    cursor,
    length,
    took,
    loadMoreDocs() {
      return fetchMore({
        variables: {
          query : {
            cursor,

            q                        : ownProps.search.q,

            company                  : ownProps.search.company,
            client                   : ownProps.search.client,
            manager                  : ownProps.search.manager,
            agent                    : ownProps.search.agent,


            vehicleModel             : ownProps.search.vehicleModel,
            vehicleManufacturer      : ownProps.search.vehicleManufacturer,


            validator                : ownProps.search.validator,
            closer                   : ownProps.search.closer,
            user                     : ownProps.search.user,

            missionRange             : rangeToDate(ownProps.search.missionRange),
            range                    : rangeToDate(ownProps.search.range),
            // validationRange       : rangeToDate(ownProps.search.validationRange),
            closureRange             : momentToDate(ownProps.search.closureRange),

            state                    : ownProps.search.state,

            lastModified             : momentToDate(ownProps.search.lastModified),

            sortConfig               : ownProps.search.sortConfig ? pick(ownProps.search.sortConfig, ['key', 'direction']) : null,
          },
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newDocs = fetchMoreResult.esQueryDocs.hits;

          return {
            esQueryDocs : {
              // By returning `cursor` here, we update the `loadMore` function
              // to the new cursor.
              cursor: fetchMoreResult.esQueryDocs.cursor,

              length: fetchMoreResult.esQueryDocs.length,

              // Put the new docs at the end of the list
              hits: [
                ...previousResult.esQueryDocs.hits,
                ...newDocs,
              ],
            },
          };
        },
      });
    },
  }),
});

const vehicleByPlateNumber = graphql(GET_VEHICLE_BY_PLATE_NUMBER_QUERY, {
  options: ({ plateNumber }) => ({
    variables: {
      plateNumber,
    },
  }),
  props: ({ ownProps, data: { loading, vehicleByPlateNumber = {} } }) => ({
    loading,
    vehicle : vehicleByPlateNumber,
  }),
});

const searchVehicles = graphql(SEARCH_VEHICLES_QUERY, {
  skip: ({ queryString, skip }) => typeof skip === 'undefined' ? !queryString || queryString < 2 : skip,
  options: ({ queryString }) => ({
    variables: {
      queryString,
    },
  }),
  props: ({ ownProps, data: { loading, searchVehicles = [] } }) => ({
    loading,
    vehicles : searchVehicles,
  }),
});

export default { queryDocs, vehicleByPlateNumber, searchVehicles };

