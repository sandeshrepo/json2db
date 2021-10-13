# SETUP
`git clone https://github.com/sandeshrepo/json2db.git`

Download the repository from github and go to the project folder


### SETUP AND RUN YOUR POSTGRESQL DATABASE
**Pre-requisites:** Create the database named in **json2db**

psql -U postgres -d json2db


## METHOD1
### RUNNING STANDALONE

### INSTALLATION
npm install

node server.js

You can check if the server is running by invoking url http://localhost:9099


## METHOD2
### RUNNING VIA DOCKER
docker build -t json2db .

docker run -p 9099:9099 -d json2db

--as localhost 
docker run -p 9099:9099 --network=host -d json2db


### USAGE OPTION1 (CREATE)
    # ToSend data to database with any json
    <host:port>/push send body as example below
    EXAMPLE1: Send data with empid as unique, then the data at that particular record of empid is deleted and below updated
            {
        	"tableName": "teachers",
        	"unique": "empid",
        	"items": [{
        			"name": "san",
                    "empid": "1",
        			"place": "hsn",
        			"city":"dubai",
        			"salary":12677
        		},
        		{
        			"name": "sud",
                    "empid": "2",
        			"place": "mys",
        			"city":"abu",
        			"salary":9999
        		}
        	]
        }

### USAGE OPTION2 (UPDATE)
<host:port>/push send body as example below 

    EXAMPLE2: Send data with data to be replaced at ["testname","weeknumber"], then the data at that particular record of testname && weeknumber is replaced
    
            `{
        	"tableName": "testcases",
        	"unique": ["testname","weeknumber"]
        	"items": [{
        			"testname": "tqc1",
                    "weeknumber": 10,
                    "status": "passed"
        			"system":"codex"
        		},
                {
        			"testname": "tqc2",
                    "weeknumber": 10,
                    "status": "passed"
        			"system":"codex"
        		}
        	]
        }`
        
        
### USAGE OPTION 3 Push record via URL

Format is <host:port>/record/<name>/<value> 
or 
<host:port>/record/name 
Then send value in body; value in body can be json too

## PSQL Commands
-  show tables 
\dt
-   connect 
psql -d json2db -U postgres
