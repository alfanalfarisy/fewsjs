mongoimport --db siagabanjir --collection main_dps --file main_dps.json
mongoimport --db siagabanjir --collection main_dpcd --file main_dpcd.json
mongoimport --db siagabanjir --collection users --file users.json
mongoimport --db siagabanjir --collection mtdt_st --file mtdt_st.json
mongoimport --db siagabanjir --collection flood_rec --file flood_rec.json

db.getSiblingDB("siagabanjir").shutdownServer()

db.grantRolesToUser('projek20', [{ role: 'root', db: 'siagabanjir' }])

db.auth('projek20','projek20')
 db.grantRolesToUser("User", [ { role: "readwrite", db: "siagabanjir" } ])
db.createUser(
  {
    user: "projek20",
    pwd: "projek20",
    roles: [ { role: "root", db: "admin" } ]
  }
)