mongoimport --db siagabanjir --collection main_dps --file main_dps.json
mongoimport --db siagabanjir --collection main_dpcd --file main_dpcd.json
mongoimport --db siagabanjir --collection users --file users.json
mongoimport --db siagabanjir --collection mtdt_st --file mtdt_st.json
mongoimport --db siagabanjir --collection flood_rec --file flood_rec.json

db.getSiblingDB("siagabanjir").shutdownServer()

db.grantRolesToUser('projek20', [{ role: 'root', db: 'siagabanjir' }])

	use admin
	db.auth('projek20','projek20')
	use siagabanjir
  db.main_dpcd.find({'dt':{$gte:new Date('2020-07-05T12:00:00Z'),$lte:new Date('2020-07-05T21:00:00Z')}}).count()
	db.temp_dps.find({'dt':{$gte:new Date('2020-07-04T11:00:00Z'),$lte:new Date('2020-07-04T14:30:00Z')}}).count()
 db.grantRolesToUser("User", [ { role: "readwrite", db: "siagabanjir" } ])
db.createUser(
  {
    user: "projek20",
    pwd: "projek20",
    roles: [ { role: "root", db: "admin" } ]
  }
)
db.shutdownServer({
  force: true,
})

db.temp_dps.find({'dt':{$gte:new ISODate('2020-07-04T11:00:00Z'),$lte:new ISODate('2020-07-04T14:30:00Z')}})

console.log(new Date(new Date('2020-07-05').setHours(00,00,00)))

