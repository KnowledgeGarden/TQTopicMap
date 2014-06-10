/**
 * querytest
 */

var qd = require('../lib/util/querydsl');

var queryDSL = new qd();
var q1 =  queryDSL.findNodeByType("foo");
console.log('q1 '+q1.toString());
q1 = queryDSL.findNodeByURL("http://google.com/");
console.log('q2 '+q1.toString());
