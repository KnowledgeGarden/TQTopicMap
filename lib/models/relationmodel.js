/**
 * RelationModel
 */
var SubjectProxy = require('../models/subjectproxy')
  , types	= require('../types')
  , icons = require('../icons')
  , constants = require('../constants')
;
var RelationModel = module.exports = function(environment) {
	  var dataProvider = environment.getDataProvider();
	  var topicModel = environment.getTopicModel();
	  console.log('RelationModel '+ dataProvider);
	  var defaultCredentials = [];
	  defaultCredentials.push(constants.SYSTEM_USER);
	  var self = this;
	  
	  /**
	   * Helper function
	   * @param relationTypeLocator
       * @param sourceNode
	   * @param targetNode
	   * @param userLocator
	   * @param credentials
	   * @param isPrivate
	   * @param sourceLabel
	   * @param targetLabel
	   * @param relationSmallIcon
	   * @param callback signature(err,data)
	   */
	  self._assert = function(relationTypeLocator, sourceNode, targetNode, userLocator, credentials, isPrivate,
			  sourceLabel, targetLabel, relationSmallIcon, relationLargeIcon, callback) {
          //sourceNode, targetNode,
		  //	relationTypeLocator, userLocator, smallImagePath,
          // largeImagePath, isPrivate, credentials, callback
		  topicModel.relateExistingNodes(sourceNode, targetNode, relationTypeLocator, userLocator,
                                         relationSmallIcon, relationLargeIcon, isPrivate,credentials, function(err,data) {
              //returns null if relation already exists, otherwise, returns new tuple
              //TODO add labels and save again
              // set lasteditdate
              //TODO: leave for some other time.
              return callback(err,data);
          });
	  },
	  
          //NOTE: sourceLabel and targetLabel are ignored for now
	  self.cause = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "Causes";
          var targetLabel = "Is caused by";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.CAUSES_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });
	  },
	  self.what = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          //TODO
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.EXPLAINS_WHAT_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.why = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.EXPLAINS_WHY_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.how = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.EXPLAINS_HOW_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.similar = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_SIMILAR_TO_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.analogous = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_ANALOGOUS_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.notAnalogous = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_NOT_ANALOGOUS_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.metaphor = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_METAPHOR_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.agree = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.PRO_SM;  //need better
          var licon = icons.PRO; // need better
		  self._assert(types.AGREES_WITH_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.disagree = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.CON_SM;  //need better
          var licon = icons.CON; // need better
		  self._assert(types.DISAGREES_WITH_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.different = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_DIFFERENT_TO_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.opposite = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_OPPOSITE_OF_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.same = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_SAME_AS_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.uses = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.USES_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.implies = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IMPLIES_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.enables = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.ENABLES_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.improves = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IMPROVES_ON_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.addresses = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.ADDRESSES_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.solves = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.SOLVES_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.prerequisite = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_PREREQUISITE_FOR_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.impairs = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IMPAIRS_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.prevents = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.PREVENTS_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.proves = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.PROVES_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.refutes = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.CON_SM;  //need better
          var licon = icons.CON; // need better
		  self._assert(types.REFUTES_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.evidenceFor = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_EVIDENCE_FOR_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.evidenceAgainst = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_EVIDENCE_AGAINST_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
          function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.consistent = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_CONSISTENT_WITH_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.inconsistent = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_INCONSISTENT_WITH_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.example = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_EXAMPLE_OF_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.predicts = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.PREDICTS_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.envisages = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.ENVISAGES_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.responds = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var licon = icons.POSITION_SM;
          var icon = icons.POSITION;
		  self._assert(types.RESPONDS_TO_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.related = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_RELATED_TO_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.hasRole = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.HAS_ROLE_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.partOf = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_PART_OF_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
	  self.containedIn = function(sourceNode, targetNode, userLocator, credentials, isPrivate, callback) {
          var sourceLabel = "What";
          var targetLabel = "What";
          var icon = icons.RELATION_ICON_SM;  //need better
          var licon = icons.RELATION_ICON; // need better
		  self._assert(types.IS_CONTAINED_IN_RELATION_TYPE, sourceNode,targetNode,userLocator,credentials,isPrivate, sourceLabel, targetLabel, icon, licon,
                       function(err,data) {
              return callback(err,data);
          });		  
	  },
    
    /** 
     * Given a <code>relationType</code>, select the appropriate function and return its results
     * @param sourceNode
     * @param targetNode
     * @param relationType
     * @param userLocator
     * @param credentials
     * @param isPrivate
     * @param callback signature(err,data)
     */
    self.createRelation = function(sourceNode, targetNode, relationType, userLocator, credentials, isPrivate, callback) {
          var error,
              result;
          if (relationType === types.CAUSES_RELATION_TYPE) {
              self.cause(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.EXPLAINS_WHAT_RELATION_TYPE) {
              self.what(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.EXPLAINS_WHY_RELATION_TYPE) {
              self.why(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.EXPLAINS_HOW_RELATION_TYPE) {
              self.how(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_SIMILAR_TO_RELATION_TYPE) {
              self.similar(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_ANALOGOUS_RELATION_TYPE) {
              self.analogous(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_NOT_ANALOGOUS_RELATION_TYPE) {
              self.notAnalogous(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_METAPHOR_RELATION_TYPE) {
              self.metaphor(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.AGREES_WITH_RELATION_TYPE) {
              self.agree(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.DISAGREES_WITH_RELATION_TYPE) {
              self.disagree(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_DIFFERENT_TO_RELATION_TYPE) {
              self.different(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_OPPOSITE_OF_RELATION_TYPE) {
              self.opposite(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_SAME_AS_RELATION_TYPE) {
              self.same(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.USES_RELATION_TYPE) {
              self.uses(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IMPLIES_RELATION_TYPE) {
              self.implies(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.ENABLES_RELATION_TYPE) {
              self.enables(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IMPROVES_ON_RELATION_TYPE) {
              self.improves(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.ADDRESSES_RELATION_TYPE) {
              self.addresses(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.SOLVES_RELATION_TYPE) {
              self.solves(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_PREREQUISITE_FOR_RELATION_TYPE) {
              self.prerequisite(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IMPAIRS_RELATION_TYPE) {
              self.impairs(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.PREVENTS_RELATION_TYPE) {
              self.prevents(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.PROVES_RELATION_TYPE) {
              self.proves(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.REFUTES_RELATION_TYPE) {
              self.refutes(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_EVIDENCE_FOR_RELATION_TYPE) {
              self.evidenceFor(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
           } else if (relationType === types.IS_EVIDENCE_AGAINST_RELATION_TYPE) {
              self.evidenceAgainst(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_CONSISTENT_WITH_RELATION_TYPE) {
              self.consistent(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_INCONSISTENT_WITH_RELATION_TYPE) {
              self.inconsistent(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_EXAMPLE_OF_RELATION_TYPE) {
              self.example(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.PREDICTS_RELATION_TYPE) {
              self.predicts(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.ENVISAGES_RELATION_TYPE) {
              self.envisages(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.RESPONDS_TO_RELATION_TYPE) {
              self.respnds(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_RELATED_TO_RELATION_TYPE) {
              self.related(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.HAS_ROLE_RELATION_TYPE) {
              self.hasRole(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_PART_OF_RELATION_TYPE) {
              self.partOf(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else if (relationType === types.IS_CONTAINED_IN_RELATION_TYPE) {
              self.containedIn(sourceNode,targetNode,userLocator,credentials,isPrivate,function(err,data) {
                  error = err;
                  result = data;
              });
          } else {
              error = "RelationModel.createRelation bad RelationType: "+relationType;
          }
          callback(error,result);
   };

};