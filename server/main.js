import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import '/server/publish.js'
import { Items } from '/imports/collections/Collections.js'
import { MockItems} from '/server/LogBDE.js'


Meteor.startup(() => {
  if(Meteor.isDevelopment){
    if(Items.find().count() === 0){
      MockItems.forEach(element => {
        if(!element.isConsumable)
          Items.insert(element)
      });
    }
  }
  ServiceConfiguration.configurations.update(
    { "service": "utt" },
    {
      $set: {
        "clientId": process.env.CLIENT_ID,
        "secret": process.env.SECRET_ID,
        "loginStyle":"redirect",
        "redirectUrl":process.env.ROOT_URL
      }
    },
    { upsert: true }
  );



});


Accounts.onCreateUser((options, user) => {
    if (!user.services.utt) {
      throw new Error('Expected login with UTT oAuth only.');
    }

    //if(!user.bdeMember)
      //throw new Error("You're not a BDE member");

    if(user.services.utt.id == 44142 || user.services.utt.id == 39870){
      var userId = user._id = Random.id();
      var handle = Meteor.users.find({_id: userId}, {fields: {_id: 1}}).observe({
          added: function () {
              Roles.addUsersToRoles(userId, ['admin'],'bde');
              handle.stop();
              handle = null;
          }
      });
  
      // In case the document is never inserted
      Meteor.setTimeout(function() {
          if (handle) {
              handle.stop();
          }
      }, 30000);
    }
    

    _.extend(user, options)

    return user;
  
  });

  Meteor.users.deny({ update: () => true });
