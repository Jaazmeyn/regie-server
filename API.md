////////////////  Crewmember  ///////////////////////

# Crewmember (cam, regieassist,..)
URL: http://localhost:5555/crew
oder heroku:
URL: http://blanda-regieapp.herokuapp.com/crew


*****************************************************
## Registrierung: Mitgliederdaten in JSON abspeichern
### Request

URL: /crew
method: post
data: {
    vorname:name, 
    nachname:nname, 
    email:email,
    password:password,
    number:number,   
}
### Response
    message: 'string' 


## Login: Mitgliederdaten abrufen
### Request
URL: /crew
Method: get
### Response
    JSON


## CrewMember löschen
URL: crew/:id
method: delete

## Member editieren
URL: crew/:id
method: put

# get all members
URL: /regie/crewmemberlist //regie? oder ohne?
Method: get
## Response
crewmembers object

////////////////  PROJEKT  ///////////////////////
## adduser to specific project
### request
URL: regie/addusertoproject
method: post
data: object ->
    userUpdate = {
        ids: [ choosenmembers ],
        filmId: number,
    }  
### response
message: hinzugefuegt || berreits im projekt vorhanden

## get all members of specific project
### request
URL: /regie/memberofproj
method: get
data: projectsId

### response
users containing this ProjectId
[{username:name, userid:id}{username:name, userid:id}] 


## remove project from member
### request
URL: removeuserfromproject/:userId
method: delete
### response
message : deleted project from user


## find members of specific project and remove project from them
### request
URL: delprojusers/:projectId
method: delete
### response
message : removed project from all users of the project




////////////////  BEWERBER  ///////////////////////
# Bewerber (schauspieler, crewbewerber)
URL: http://localhost:5555/bewerber
oder heroku:
URL: http://blanda-regieapp.herokuapp.com/bewerber

## Bewerber löschen
URL: bewerber/:id
method: delete

## Bewerber editieren
URL: bewerber/:id
method: put

## bewerber als member registrieren -> registrierungslink schicken?
.. weiterleiten zu url /crew