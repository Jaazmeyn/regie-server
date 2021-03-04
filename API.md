////////////////  Crewmember  ///////////////////////

# Crewmember (cam, regieassist,..)
URL: http://localhost:5555/crew
oder heroku:
URL: http://blanda-regieapp.herokuapp.com/crew
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