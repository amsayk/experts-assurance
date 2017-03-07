import { createSelector } from 'utils/reselect';

const userSelector = state => state.get('user');
const agentSelector = state => state.getIn(['cases', 'agent']);

export default createSelector(
  userSelector,
  agentSelector,
  (user, agent) => ({ user, agent })
);

