# Backend API Routes Overview (For Frontend Integration)

This document explains how to interact with the backend event/donor management API. All routes return JSON unless otherwise stated.

## 1. GET /events

Retrieve all events with computed status based on the number of saved donors:

Status logic:

- Not Started: 0 donors assigned

- In Process: 1 to (capacity - 1) donors assigned

- Fully Invited: capacity number of donors assigned

Returns:

```
[
  {
    "id": 1,
    "name": "Event A",
    "city": "Vancouver",
    "date": "2025-04-01",
    "location": "Conference Hall",
    "medical_focus": "Brain Cancer",
    "capacity": 10,
    "coordinator": "Alice",
    "fundraiser": "Bob",
    "status": "In Process"
  },
  ...
]
```
## 2.  GET /events/search

Search events with optional filters:

name, city, focus, coordinator, fundraiser, status

Returns: Events matching the filter, each with computed status.

## 3. POST /events

Create a new event.
Request body:
```json
{
  "name": "Event A",
  "date": "2025-04-01",
  "city": "Vancouver",
  "location": "Conference Center",
  "medical_focus": "Brain Cancer",
  "capacity": 10,
  "coordinator": "Alice",
  "fundraiser": "Bob",
  "details": "Event details here."
}
``` 
Returns:
```json
{
  "message": "Event created successfully",
  "eventId": 2
}
```

## 4. GET /events/:eventId/suggest-donors

Generate two lists of suggested donors (based on match logic):

- best (capacity size)

- additional (extra matching donors)

Matching criteria:

- Default filters: Event city, medical focus, engagement = "Highly Engaged"

- Query Parameters (optional): city, medical_focus, engagement

Donor must not be:

- already saved for the event

- currently added in the temp list

Donor can be included if previously deleted from the temp list 

Returns:
```
{
  "best": [ { donor fields... }, ... ],
  "additional": [ { donor fields... }, ... ]
}
```
Each donor info includes:
```json
{
  "id": 101,
  "name": "Jane Doe",
  "total_donation": 250000,
  "city": "Vancouver",
  "medical_focus": "Brain Cancer",
  "engagement": "Highly Engaged",
  "email": "jane@example.com",
  "pmm": "PMM1"
}
```
## 5. POST /events/:eventId/donors/add
Description:
Temporarily add a donor to the candidate list for an event.

Request Body:
```json
{
  "donorId": 101
}
```
Returns:
```json
{ "message": "Donor temporarily added" }
```

## 6. POST /events/:eventId/donors/remove

**Description:** Temporarily remove a donor from the candidate list.

**Request Body:**
```json
{
  "donorId": 101
}
```
**Returns:**
```json
{ "message": "Donor temporarily removed" }
```
## 7. POST /events/:eventId/donors/save
**Description:** Save the current candidate donor list to the database for the event. 

**Returns:**
```json
{ "message": "Donor list saved" }
```

## 8. POST /events/:eventId/donors/cancel
**Description:** Cancel all unsaved donor changes for the event. 

**Returns:**
```json
{ "message": "Donor edits canceled" }
```

## 9. GET /events/:eventId/donors/search
**Description:** Search for a donor by name and return those not already saved or added to the current candidate list (but includes deleted ones). 

**Query Example:**
```
/events/1/donors/search?name=Jane
```

**Returns:**
```json
[
  {
    "id": 101,
    "name": "Jane Doe",
    "total_donation": 250000,
    "city": "Vancouver",
    "medical_focus": "Brain Cancer",
    "engagement": "Highly Engaged",
    "email": "jane@example.com",
    "pmm": "PMM1"
  }
]
```
## 10. GET /events/:eventId/donors/export

**Description:** Export saved donor list to a downloadable CSV file.

**Returns:** 
Triggers download of a .csv file with the following columns:
- Donor Name

- Total Donations

- City

- Medical Focus

- Engagement

- Email Address

- PMM
