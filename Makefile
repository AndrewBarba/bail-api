server:
	foreman start

prodf:
	git push heroku master
	heroku config:set NODE_ENV=production --account bail-api

prod:
	make tests
	make prodf

tests:
	mocha --timeout 120000

logs:
	heroku logs --tail --account bail-api
