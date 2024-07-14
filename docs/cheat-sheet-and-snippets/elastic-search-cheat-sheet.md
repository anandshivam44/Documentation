## Elastic Search Cheat Sheet with Kibana REST & curl commands

First Set ELASTICSEARCH URL
```bash
ELASTICSEARCH_URL="<cluster url with protocol and optinally port number>"
```

### Elastic Search Administration


#### Get the health of the cluster
```sql
GET /_cluster/health
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cluster/health?pretty"
```

#### Get cluster stats
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cluster/stats?pretty&human=true" 
```
```sql
GET /_cluster/stats?human=true
```

#### Get the cluster state
```sql
GET /_cluster/state
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cluster/state?pretty"
```

#### Cluster Information
```sql
GET /
```
```bash
curl -s -XGET $ELASTICSEARCH_URL
```

#### Get Size of all indices
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cluster/stats?pretty&human=true" | jq -r '.indices.store.size'
```

#### Get Size of Elastic Search data on each node vs node size
```sql
GET /_cat/allocation?v 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cat/allocation?v"
```

#### Get Node information
```sql
GET /_cat/nodes?v 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cat/nodes?v"
```

#### Get Thread Pool
```sql
GET /_cat/thread_pool?v&s=active:desc
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cat/thread_pool?v&s=active:desc"
```

#### Get total number of shards
```bash
GET _cluster/stats?filter_path=indices.shards.total
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cluster/stats?filter_path=indices.shards.total&pretty"
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cat/shards" | wc -l
```

#### Get total number of indices
```bash
curl "$ELASTICSEARCH_URL/_cat/indices?h=index" | wc -l
```

#### Get List of Pending Tasks
```sql
GET /_cluster/pending_tasks
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cluster/pending_tasks?pretty"
```


#### Get List of All mappings
```sql
GET /_mapping
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_mapping?pretty"
```


#### Get all plugins
```sql
GET /_cat/plugins?v&s=component 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cat/plugins?v&s=component"
```

#### Total Free Space in the CLuster
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cluster/stats?pretty&human=true" | jq -r '.nodes.fs.free'
```


#### Format Elastic Search Output; Examples
```sql
GET /_cluster/health?format=yaml
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cluster/health?format=yaml"
```
   
```sql
GET /_cluster/health?format=csv
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cluster/health?format=csv"
```
   
```sql
GET /_cluster/health?format=txt
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cluster/health?format=txt"
```   
   
```sql
GET /_cluster/health?format=json
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cluster/health?format=json&pretty"
```



## Elastic Search DataBase Operations

Set Index Name
```bash
INDEX_NAME="<index name>"
```

#### Create an index (default)
```bash
PUT /<index-name> 
```
```bash
curl -X PUT "$ELASTICSEARCH_URL/$INDEX_NAME"
```

#### Create an index with mappings and settings
```sql
PUT /index-name
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "price": {
        "type": "integer"
      }
    }
  }
}
```
```bash
curl -X PUT "$ELASTICSEARCH_URL/$INDEX_NAME" -H "Content-Type: application/json" -d '{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "price": {
        "type": "integer"
      }
    }
  }
}'
```
#### Add a document
```sql
POST /<index-name>/_doc
{
  "name": "Shivam",
  "age": 24
}

```
```bash
curl -X POST "$ELASTICSEARCH_URL/$INDEX_NAME/_doc" -H "Content-Type: application/json" -d '{
  "name": "Shivam",
  "age": 24
}'
```

#### Get index mappings and settings
```sql
GET /<index-name> 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/$INDEX_NAME?pretty"
```


#### Empty an index
```sql
POST /<index-name>/_delete_by_query?q=* 
```
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_delete_by_query?q=*"
```

#### Delete an index
```bash
DELETE /<index-name> 
```
```bash
curl -X DELETE "$ELASTICSEARCH_URL/$INDEX_NAME"
```



#### List All Indices (Most useful), Sort by descending order of size, show header and important columns only
```sql
GET /_cat/indices?v&s=store.size:desc&h=index,pri,rep,docs.count,docs.deleted,store.size,pri.store.size 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cat/indices?v&s=store.size:desc&h=index,pri,rep,docs.count,docs.deleted,store.size,pri.store.size"
```

#### List All Indices with metadata
```sql
GET /_cat/indices?v
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cat/indices?v"
```

#### Get All Indices list only
```sql
GET /_cat/indices?h=index
```
```bash
curl -s -XGET $ELASTICSEARCH_URL/_cat/indices?h=index
```

#### Get All Indices sorted in descending order of size
```sql
GET /_cat/indices?v&s=store.size:desc
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cat/indices?v&s=store.size:desc"
```

#### Get List of All aliases , Sort by index name
```sql
GET /_cat/aliases?v&s=index 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cat/aliases?v&s=index"
```

#### Get List of All aliases
```sql
GET /_cat/aliases?v 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/_cat/aliases?v"
```

#### Get all data inside the index
```sql
GET /<index-name>/_search?pretty
{
  "query": {
    "match_all": {}
  }
}
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/$INDEX_NAME/_search?pretty" -H 'Content-Type: application/json' -d'
{
    "query": {
        "match_all": {}
    }
}'
```


#### Update an entire doc by it ID
```sql
PUT /<index-name>/_doc/<doc-id>
{
  "name": "Anand",
  "age": 25
}
```
```bash
curl -X PUT "$ELASTICSEARCH_URL/$INDEX_NAME/_doc/$DOC_ID" -H "Content-Type: application/json" -d '{
  "name": "Anand",
  "age": 25
}'
```

#### Update a specific field document in an index by its id
```sql
POST /<index-name>/_update/<doc-id>
{
  "doc": {
    "age": 99
  }
}
```
```bash
DOC_ID="<Get document id>"
curl -X POST "$ELASTICSEARCH_URL/$INDEX_NAME/_update/$DOC_ID" -H "Content-Type: application/json" -d '{
  "doc": {
    "age": 99
  }
}'
```

#### Update all document in an index by script
```sql
POST /<index-name>/_update_by_query
{
  "script": {
    "source": "ctx._source.age += params.count",
    "lang": "painless",
    "params": {
      "count": 10
    }
  }
}
```
```bash
curl -X POST "$ELASTICSEARCH_URL/$INDEX_NAME/_update_by_query" -H 'Content-Type: application/json' -d'
{
  "script" : {
    "source": "ctx._source.age += params.count",
    "lang": "painless",
    "params" : {
      "count" : 10
    }
  }
}'
```

#### Bulk Operation using bulk API
```sql
POST /<index-name>/_update_by_query
{
  "script": {
    "source": "ctx._source.age += params.count",
    "lang": "painless",
    "params": {
      "count": 10
    }
  }
}
```
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_bulk?pretty" -H "Content-Type: application/json" -d '
{"index":{"_id":"1"}
{"name": "Ramu","age": 45}
{"index":{"_id":"2"}
{"name": "Lemon","age": 1}
{"delete":{"_id":"1"}}
{"update":{"_id":"2"}}
{"doc":{"name":"Orange"}}
'
```

#### Get document count in an index
```sql
GET /<index-name>/_count 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/$INDEX_NAME/_count?pretty"
```

#### Make an index read-only

Block write to the source index / make the index read only
```sql
PUT /<index-name>/_settings?pretty
{
  "index.blocks.write": true
}
```
```bash
curl -X PUT "$ELASTICSEARCH_URL/$INDEX_NAME/_settings?pretty" -H 'Content-Type: application/json' -d '
{
   "index.blocks.write": true
}'
```
Verify write is blocked
```sql
GET /<index-name>/_settings 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/$INDEX_NAME/_settings?pretty"
```

Undo block write / Undo read-only mode
```sql
PUT /<source-index>/_settings
{
  "index.blocks.write": false
}
```
```bash
curl -X PUT "$ELASTICSEARCH_URL/$SOURCE_INDEX/_settings" -H 'Content-Type: application/json' -d '
{
   "index.blocks.write": false
}'
```

#### Backup an index
```bash
SOURCE_INDEX="<copy from index>"  
```
```bash
DESTINATION_INDEX="<copy to index>"
```

Mandatory step to block write to the source index / make the index read only
```sql
PUT /<source-index>/_settings?pretty
{
  "index.blocks.write": true
}
```
```bash
curl -X PUT "$ELASTICSEARCH_URL/$SOURCE_INDEX/_settings?pretty" -H 'Content-Type: application/json' -d '
{
   "index.blocks.write": true
}'
```
Verify write is blocked
```sql
GET /<source-index>/_settings 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/$SOURCE_INDEX/_settings?pretty"
```
Copy data from source to destination
```sql
POST /<source-index>/_clone/<destination-index>?pretty
```
```bash
curl -XPOST "$ELASTICSEARCH_URL/$SOURCE_INDEX/_clone/$DESTINATION_INDEX?pretty" 
```
Verify data is copied to destination
```sql
POST /<index-name>/_search?pretty
{
  "query": {
    "match_all": {}
  }
}
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/$DESTINATION_INDEX/_search?pretty" -H 'Content-Type: application/json' -d'
{
    "query": {
        "match_all": {}
    }
}'
```
Undo block write / Undo read-only mode
```sql
PUT /<source-index>/_settings
{
  "index.blocks.write": false
}
```
```bash
curl -X PUT "$ELASTICSEARCH_URL/$SOURCE_INDEX/_settings" -H 'Content-Type: application/json' -d '
{
   "index.blocks.write": false
}'
```

#### Open and close indexes to save memory and CPU
close: A closed index is essentially frozen. Search and write operations are blocked.

```sql
POST /<index-name>/_close 
```
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_close"
```
open: An open index is available for search and write operations. This is the typical state for an index you're actively using for data storage and retrieval.

```sql
POST /<index-name>/_open 
```
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_open"
```



#### Get Index Stats
```sql
GET /<index-name>/_stats 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/$INDEX_NAME/_stats?pretty"
```

#### Get Index Segments Information
```sql
GET /<index-name>/_segments 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/$INDEX_NAME/_segments?pretty"
```

#### Get Index Recovery Status (Human Readable)
```sql
GET /<index-name>/_recovery&human 
```
```bash
curl -s -XGET "$ELASTICSEARCH_URL/$INDEX_NAME/_recovery?pretty&human"
```

#### Clear Index Cache
```sql
POST /<index-name>/_cache/clear 
```
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_cache/clear"
```

#### Refresh Index
```sql
POST /<index-name>/_refresh 
```
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_refresh"
```

#### Flush Index
```sql
POST /<index-name>/_flush 
```
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_flush"
```

#### Force Merge Index Segments
```sql
POST /<index-name>/_forcemerge 
```
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_forcemerge"
```



































































































































































