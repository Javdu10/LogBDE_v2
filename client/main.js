

import '/client/routes.js'
import { Items } from '/imports/api/Collections.js';

Meteor.subscribe('userData');
Meteor.subscribe('items');

FlowRouter.wait();

Tracker.autorun(() => {
  // wait on roles to intialise so we can check is use is in proper role
  if (Roles.subscription.ready() && !FlowRouter._initialized) {
    FlowRouter.initialize()
  }
});


