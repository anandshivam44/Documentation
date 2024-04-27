# SQL Cheat Sheet  
## Postgress
#### Connect to Database
```bash
HOST="host-url.com"
PORT=5432
USER="username"
DATABASE="employees"

PGPASSWORD='<enter password> psql -h $HOST -p $PORT -U $USER -d $DATABASE
```
#### List all Databases
```bash
\l
```
#### Connect to database
```bash
\c <database_name>
```


#### Show current database
```bash
SELECT current_database();
```


#### Create database
```bash
CREATE DATABASE <database_name> WITH OWNER <username>;
```


#### Drop database
```bash
DROP DATABASE IF EXISTS <database_name>;
```


#### Rename database
```bash
ALTER DATABASE <old_name> RENAME TO <new_name>;
```

#### Show version
```bash
SHOW SERVER_VERSION;
```

#### Show system status
```bash
\conninfo
```

#### Show environmental variables
```bash
SHOW ALL;
```

#### List users
```bash
SELECT rolname FROM pg_roles;
```

#### Show current user
```bash
SELECT current_user;
```

#### Show current user's permissions
```bash
\du
```

#### Show all tables in database
```bash
\dt
```
#### Describe table
```bash
\d <table>	
```
#### Describe table with details
```bash
\d+ <table>	
```
#### List tables from current schema
```bash
\dt	
```

#### Use pg_dump to backup a database
```bash
HOST="host-url.com"
PORT=5432
USER="username"
DATABASE="employees"

pg_dump --schema-only -U $USER -d $DATABASE -h $HOST -p $PORT  > pgdump_file.sql
```






