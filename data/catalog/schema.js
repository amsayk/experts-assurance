import parseGraphqlObjectFields from '../parseGraphqlObjectFields';
import parseGraphqlScalarFields from '../parseGraphqlScalarFields';

import { fromJS } from 'immutable';

import productValidations from 'routes/ProductCatalog/containers/StartPage/ProductFormPopup/validations';

export const schema = [`

  # ------------------------------------
  # Create product
  # ------------------------------------
  type CreateProductResponse {
    product: Product,
    errors: JSON!
  }

  input LabelInput {
    displayName: String,
    color: String
  }

  input CreateProductPayload {
    displayName: String
    brandName: String
    labels: [LabelInput!]!
  }

  # Sort
  enum CatalogSortKey {
    displayName
    date
  }

  enum SortDirection {
    SORT_DIRECTION_DESC
    SORT_DIRECTION_ASC
  }
  input SortConfig {
    key: CatalogSortKey
    direction: SortDirection
  }

  # Queries
  type RecentProductsQueryResponse {
    labels: [Label!]!
    products: [Product!]!
  }

  type ProductsFetchResponse {
    cursor: Int!
    length: Int!
    products: [Product!]!
  }

  input ProductsFetchQuery {
    cursor: Int
    label: String
    sortConfig: SortConfig
  }

  # ------------------------------------
  # Product type
  # ------------------------------------
  type Product {
    id: ID!

    displayName: String!
    brandName: String

    labels: [Label!]!

    createdAt: Date!
    updatedAt: Date!
  }

  # ------------------------------------
  # Label type
  # ------------------------------------
  type Label {
    slug: String!

    displayName: String!
    color: String
  }

`];

export const resolvers = {

  Product: Object.assign(
    {
    },
    parseGraphqlScalarFields([
      'id',
      'displayName',
      'brandName',
      'labels',
      'createdAt',
      'updatedAt',
    ])
  ),

  CreateProductResponse : Object.assign(
    {
    },
    parseGraphqlObjectFields([
      'product',
    ]),
    parseGraphqlScalarFields([
      'errors',
    ])
  ),

  Mutation: {
    async addProduct(_, { info }, context) {
      try {
        await productValidations.asyncValidate(fromJS(info));
      } catch (errors) {
        return { errors };
      }
      const product = await context.Products.add(info);
      return { product, errors: {} };
    },
  },

  Query: {
    getProduct(_, { id }, context) {
      return context.Products.get(id);
    },
    getProducts(_, { query }, context) {
      return context.Products.fetchAll(query);
    },
    catalogRecent(_, { query }, context) {
      return context.Products.recent(query);
    },
    labels(_, {}, context) {
      return context.Products.labels();
    },
  },

};

