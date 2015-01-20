# TQTopicMap [![Build Status](https://travis-ci.org/KnowledgeGarden/TQTopicMap.svg?branch=develop)](https://travis-ci.org/KnowledgeGarden/TQTopicMap)
A NodeJS version of the [https://github.com/SolrSherlock/JSONTopicMap](https://github.com/SolrSherlock/JSONTopicMap "JSONTopicMap") Java platform

## Latest
20140708<br/>
NOTE: a major change to the relations list property was made. That's a ***database breaker*** if you already have topics using tuples. (20140708)

## Usage
This project is, first, an *embedded* platform, designed to be used by creating an instancc of index.js with a callback which returns an instance of **TopicMapEnvirionment**. From there, one fetches appropriate classes to create, manipulate, and persist instances of the **SubjectProxy** object. That is how topics are persisted in ElasticSearch.

Example:

var idx = require("./*somepath*/index");<br/>
new idx(err,environment) {<br/>
   *your code goes here which uses environment*<br/>
};


## Developing
This is a very early stage shell, one that successfully runs the *tests* created to develop it.


### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
