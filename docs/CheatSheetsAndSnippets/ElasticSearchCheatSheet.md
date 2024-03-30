## Elastic Search Cheat Sheet

First Set ELASTICSEARCH URL
```bash
ELASTICSEARCH_URL="<cluster url with protocol and optinally port number>"
```

### Elastic Search Administration


#### Get the health of the cluster
```bash
curl -X GET "$ELASTICSEARCH_URL/_cluster/health?pretty"
```

#### Get the cluster state
```bash
curl -XGET "$ELASTICSEARCH_URL/_cluster/state?pretty"
```

#### Cluster Information
```bash
curl GET -v $ELASTICSEARCH_URL
```

#### Get Size of Elastic Search data
```bash
curl -XGET "$ELASTICSEARCH_URL/_cat/allocation?v"
```

#### Get Node information
```bash
curl -X GET "$ELASTICSEARCH_URL/_cat/nodes?v"
```

#### Get Thread Pool
```bash
curl -XGET "$ELASTICSEARCH_URL/_cat/thread_pool?v&s=active:desc"
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
```bash
curl -XGET "$ELASTICSEARCH_URL/_cluster/pending_tasks?pretty"
```


#### Get List of All mappings
```bash
curl -X GET "$ELASTICSEARCH_URL/_mapping?pretty"
```


#### Get all plugins
```bash
curl -XGET "$ELASTICSEARCH_URL/_cat/plugins?v&s=component"
```


#### Format Elastic Search Output
```bash
curl -X GET "$ELASTICSEARCH_URL/_cluster/health?format=yaml"
```
```bash
curl -X GET "$ELASTICSEARCH_URL/_cluster/health?format=csv"
```
```bash
curl -X GET "$ELASTICSEARCH_URL/_cluster/health?format=txt"
```
```bash
curl -X GET "$ELASTICSEARCH_URL/_cluster/health?format=json&pretty"
```



## Elastic Search DataBase Operations

Set Index Name
```bash
INDEX_NAME="<index name>"
```

#### Create an index (default)
```bash
curl -X PUT "$ELASTICSEARCH_URL/$INDEX_NAME"
```

#### Create an index with mappings and settings
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
```bash
curl -X POST "$ELASTICSEARCH_URL/$INDEX_NAME/_doc" -H "Content-Type: application/json" -d '{
  "name": "Shivam",
  "age": 24
}'
```

#### Get index mappings and settings
```bash
curl -X GET "$ELASTICSEARCH_URL/$INDEX_NAME?pretty"
```


#### Empty an index
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_delete_by_query?q=*"
```

#### Delete an index
```bash
curl -X DELETE "$ELASTICSEARCH_URL/$INDEX_NAME"
```



#### List All Indices (Most useful), Sort by descending order of size, show header and important columns only
```bash
curl -XGET "$ELASTICSEARCH_URL/_cat/indices?v&s=store.size:desc&h=index,pri,rep,docs.count,docs.deleted,store.size,pri.store.size"
```

#### List All Indices with metadata
```bash
GET /_cat/indices?v
```
```bash
curl -X GET "$ELASTICSEARCH_URL/_cat/indices?v"
```

#### Get All Indices list only
```bash
curl -XGET $ELASTICSEARCH_URL/_cat/indices?h=index
```

#### Get All Indices sorted in descending order of size
```bash
curl -XGET "$ELASTICSEARCH_URL/_cat/indices?v&s=store.size:desc"
```

#### Get List of All aliases , Sort by index name
```bash
curl -X GET "$ELASTICSEARCH_URL/_cat/aliases?v&s=index"
```

#### Get List of All aliases
```bash
curl -X GET "$ELASTICSEARCH_URL/_cat/aliases?v"
```

#### Get all data inside the index
```bash
curl -X GET "$ELASTICSEARCH_URL/$INDEX_NAME/_search?pretty" -H 'Content-Type: application/json' -d'
{
    "query": {
        "match_all": {}
    }
}'
```


#### Update an entire doc by it ID
```bash
curl -X PUT "$ELASTICSEARCH_URL/$INDEX_NAME/_doc/$DOC_ID" -H "Content-Type: application/json" -d '{
  "name": "Anand",
  "age": 25
}'
```

#### Update a specific document in an index by its id
```bash
DOC_ID="<Get document id>"
curl -X POST "$ELASTICSEARCH_URL/$INDEX_NAME/_update/$DOC_ID" -H "Content-Type: application/json" -d '{
  "doc": {
    "price": 89.99
  }
}'
```

#### Update all document in an index by script
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
```bash
curl -X GET "$ELASTICSEARCH_URL/$INDEX_NAME/_count?pretty"
```

#### Make an index read-only
INDEX="<copy from index>"

Block write to the source index / make the index read only
```bash
curl -X PUT "$ELASTICSEARCH_URL/$INDEX_NAME/_settings?pretty" -H 'Content-Type: application/json' -d '
{
   "index.blocks.write": true
}'
```
Verify write is blocked
```bash
curl -X GET "$ELASTICSEARCH_URL/$INDEX_NAME/_settings?pretty"
```

Undo block write / Undo read-only mode
```bash
curl -X PUT "$ELASTICSEARCH_URL/$SOURCE_INDEX/_settings" -H 'Content-Type: application/json' -d '
{
   "index.blocks.write": false
}'
```

#### Backup an index
SOURCE_INDEX="<copy from index>"  
DESTINATION_INDEX="<copy to index>"

Mandatory step to block write to the source index / make the index read only
```bash
curl -X PUT "$ELASTICSEARCH_URL/$SOURCE_INDEX/_settings?pretty" -H 'Content-Type: application/json' -d '
{
   "index.blocks.write": true
}'
```
Verify write is blocked
```bash
curl -X GET "$ELASTICSEARCH_URL/$SOURCE_INDEX/_settings?pretty"
```
Copy data from source to destination
```bash
curl -XPOST "$ELASTICSEARCH_URL/$SOURCE_INDEX/_clone/$DESTINATION_INDEX?pretty" 
```
Verify data is copied to destination
```bash
curl -X GET "$ELASTICSEARCH_URL/$DESTINATION_INDEX/_search?pretty" -H 'Content-Type: application/json' -d'
{
    "query": {
        "match_all": {}
    }
}'
```
Undo block write / Undo read-only mode
```bash
curl -X PUT "$ELASTICSEARCH_URL/$SOURCE_INDEX/_settings" -H 'Content-Type: application/json' -d '
{
   "index.blocks.write": false
}'
```

#### Open and close indexes to save memory and CPU
close: A closed index is essentially frozen. Search and write operations are blocked.
```bash
POST /my_index_name/_close
```
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_close"
```
open: An open index is available for search and write operations. This is the typical state for an index you're actively using for data storage and retrieval.
```bash
POST /my_index_name/_open
```
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_open"
```



#### Get Index Stats
```bash
curl -XGET "$ELASTICSEARCH_URL/$INDEX_NAME/_stats?pretty"
```

#### Get Index Segments Information
```bash
curl -XGET "$ELASTICSEARCH_URL/$INDEX_NAME/_segments?pretty"
```

#### Get Index Recovery Status (Human Readable)
```bash
curl -XGET "$ELASTICSEARCH_URL/$INDEX_NAME/_recovery?pretty&human"
```

#### Clear Index Cache
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_cache/clear"
```

#### Refresh Index
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_refresh"
```

#### Flush Index
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_flush"
```

#### Force Merge Index Segments
```bash
curl -XPOST "$ELASTICSEARCH_URL/$INDEX_NAME/_forcemerge"
```



































































































































































