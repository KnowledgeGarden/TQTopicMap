/**
 * queryutil
 * Useful for putting labels and details into a query
 */
var StringBuilder = require('./stringbuilder');

/**
 * http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax
 * + - && || ! ( ) { } [ ] ^ " ~ * ? : \ /
 */
var QueryUtil = function() {
  var self = this;
	
  self.escapeQueryCulprits = function(s) {
    var sb = new StringBuilder();
    var len = s.length;
    for (var i = 0; i < len; i++) {
      var c = s.charAt(i);
      // These characters are part of the query syntax and must be escaped
      if (c === '\\' || c === '+' || c === '-' || c === '!' || c === '(' || c === ')' || c === ':'
        || c === '^' || c === '[' || c === ']' || c === '\"' || c === '{' || c === '}' || c === '~'
        || c === '*' || c === '?' || c === '|' || c === '&' || c === ';' || c=== '/') {
    	  //TODO not dealing with "&&"
            sb.append("\\");
      }
      sb.append(c);
    }
    var x = sb.toString();
    if (x.indexOf(' ') > -1) {
      x = "\""+x+"\"";  //turn into a phrase query
    }
    return x;
  };
	
  self.unEscapeQueryCulprits = function(s) {
    var sb = new StringBuilder();
    var len = s.length;
    var c, c1;
    for (var i = 0; i < len; i++) {
      c = s.charAt(i);
      if (c == '\\') {
        if ((i+1) < (len-1)) {
          c1 = s.charAt(i+1);
          if (c1 == '\\') {
            sb.append(c);
            i++;
          } else if (c1 == '+') {
						sb.append(c1);
						i++;
          } else if (c1 == '-') {
						sb.append(c1);
						i++;
          } else if (c1 == '!') {
						sb.append(c1);
						i++;
          } else if (c1 == '(') {
						sb.append(c1);
						i++;
          } else if (c1 == ')') {
						sb.append(c1);
						i++;
          } else if (c1 == ':') {
						sb.append(c1);
						i++;
          } else if (c1 == '^') {
						sb.append(c1);
						i++;
          } else if (c1 == '[') {
						sb.append(c1);
						i++;
          } else if (c1 == ']') {
						sb.append(c1);
						i++;
          } else if (c1 == '\"') {
						sb.append(c1);
						i++;
          } else if (c1 == '+') {
						sb.append(c1);
						i++;
          } else if (c1 == '{') {
						sb.append(c1);
						i++;
          } else if (c1 == '}') {
						sb.append(c1);
						i++;
          } else if (c1 == '~') {
						sb.append(c1);
						i++;
          } else if (c1 == '*') {
						sb.append(c1);
						i++;
          } else if (c1 == '?') {
						sb.append(c1);
						i++;
          } else if (c1 == '|') {
						sb.append(c1);
						i++;
          } else if (c1 == '&') {
						sb.append(c1);
						i++;
          } else if (c1 == ';') {
						sb.append(c1);
						i++;
          }
        }
      } else
        sb.append(c);
    }
    return sb.toString();
  };
	
	
	
	
	
	
	
	
};

module.exports = QueryUtil;