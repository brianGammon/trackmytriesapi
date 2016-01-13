exports.up = function(db, next){
  var categories = db.collection('categories'),
      seedData = [
        {
        	name: 'Sit Ups',
        	description: 'Number of sit ups completed in 2 minutes',
        	dataType: 'number',
        	goalType: 'most'
        },
        {
        	name: 'Push Ups',
        	description: 'Number of push ups completed in 2 minutes',
        	dataType: 'number',
        	goalType: 'most'
        },
        {
        	name: 'Pull Ups',
        	description: 'Number of pull ups completed',
        	dataType: 'number',
        	goalType: 'most'
        },
        {
        	name: '1.5 Mile Run',
        	description: 'Time in minutes and seconds (MM:SS) to run 1.5 miles',
        	dataType: 'time',
        	goalType: 'least'
        }
      ];
  categories.insert(seedData, next);
};

exports.down = function(db, next){
  var categories = db.collection('categories');
  categories.remove({},next);
};
