# source.one_Book_Rental

step 1. clone the repo 
step 2. npm install
step 3. npm run local

routes example:- curl --request POST \
  --url http://localhost:3000/rent \
  --header 'Content-Type: application/json' \
  --data '{
	"customerId": 12345,
	"bookIds_with_duration": [
		{
			"bookId": "63d95e99bcd505e6eadf2a19",
			"duration": 4
		},
		{
			"bookId": "63d95e99bcd505e6eadf2a1a",
			"duration": 5
		}
	]
}'
