/**
 * types.js
 * <p>These are all derived from the interface specifications of the
 * Java topic map at https://github.com/SolrSherlock/JSONTopicMap</p>
 * <p>They must be the same in order to insure database compatibility:<br/>
 * both the NodeJS and Java topic maps should be able to work from the
 * same database.</p>
 */
///////////////////////////
// Types
///////////////////////////
module.exports.TYPE_TYPE								= 'TypeType';

module.exports.CLASS_TYPE 								= 'ClassType';
	//needed in export of a tuple
module.exports.NODE_TYPE								= 'NodeType';
//	TUPLE_TYPE								= 'TypleType';
module.exports.GRAPH_TYPE								= 'GraphType';
	//needed in merge and export of a tuple
module.exports.VIRTUAL_NODE_TYPE						= 'VirtualNodeType';
module.exports.ONTOLOGY_TYPE 							= 'OntologyType';

module.exports.RULE_TYPE 								= 'RuleType';
module.exports.MERGE_RULE_TYPE 							= 'MergeRuleType';
module.exports.RESOURCE_TYPE 							= 'ResourceType';
module.exports.WEB_RESOURCE_TYPE						= 'WebResourceType';
module.exports.RELATION_TYPE 							= 'RelationType';
module.exports.ROLE_TYPE 								= 'RoleType';
module.exports.USER_TYPE 								= 'UserType';
module.exports.UNKNOWN_USER_TYPE						= 'UnknownUserType';
    /**
     * A USER_TYPE generated on import from a different map
     */
module.exports.FOREIGN_USER_TYPE 						= 'ForeignUserType';
module.exports.AGENT_TYPE								= 'AgentType';
module.exports.MERGE_AGENT_TYPE							= 'MergeAgentType';
module.exports.HARVEST_AGENT_TYPE						= 'HarvestAgentType';

/**
 * The following <em>LEGEND</em> types are defined for exporting.
 * Is a CLASS_TYPE
 */
module.exports.LEGEND_TYPE 								= 'LegendType';
module.exports.SCOPE_TYPE 								= 'ScopeType';
module.exports.MERGE_RULE_SCOPE_TYPE					= 'MergeRuleScopeType';
module.exports.THEME_TYPE								= 'ThemeType';

///////////////////////
// Assertions
///////////////////////
module.exports.ASSERTION_TYPE 							= 'AssertionType';
module.exports.MERGE_ASSERTION_TYPE 					= 'MergeAssertionType';
module.exports.POSSIBLE_MERGE_ASSERTIONTYPE				= 'PossibleMergeAssertionType';
module.exports.UNMERGE_ASSERTION_TYPE					= 'UnMergeAssertionType';
	
module.exports.ROLE_BASED_RELATION_TYPE 				= 'RoleBasedRelationType';
module.exports.LINGUISTIC_RELATION_TYPE 				= 'linguisticRelationType';
module.exports.SIMPLE_ASSERTION_TYPE 					= 'SimpleAssertionType';
    /**
     * Predefines as subclass of LEGEND_TYPE: user must subclass which assertion type
     */
module.exports.LEGEND_ASSERTION_TYPE 					= 'LegendAssertionType';