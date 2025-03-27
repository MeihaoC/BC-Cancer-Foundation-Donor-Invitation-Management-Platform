# Backend API Routes Overview (For Frontend Integration)

This document explains how to interact with the backend event/donor management API. All routes return JSON unless otherwise stated.

3/24 Testing Note:
Problem existing:
2. GET /events/search
3. POST /events

3/26 Testing Note:
- Login routes was added.
- Previously existing problems were all fixed, and README file was also updated.


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
**Search for events by typing any keyword in a single input. Search is case-insensitive and uses partial match. The backend will match it against:**

- Event name
- City
- Medical Focus
- Coordinator name
- Fundraiser name
- Status (Not Started, In Process, Fully Invited)

**Example Request:**
```
curl "http://localhost:5001/api/events/search?q=Vancouver"
```
**Success Response:**
```
[
  {
    "id": 1,
    "name": "Brain Cancer Walk",
    "date": "2025-03-15T00:00:00.000Z",
    "location": "Stanley Park",
    "city": "Vancouver",
    "medical_focus_id": 1,
    "capacity": 20,
    "coordinator_id": 2,
    "fundraiser_id": 4,
    "detailed_info": "Annual fundraiser walk",
    "status": "Fully Invited",
    "medical_focus": "Brain Cancer",
    "coordinator": "Alice Johnson",
    "fundraiser": "Bob Smith"
  }
]
```
Error Response:
- 500 Internal Server Error
```
{ "error": "Failed to search events" }
```

## 3. POST /events
Create a new event by providing details like name, date, location, city, medical focus, capacity, coordinator, and fundraiser. This route automatically looks up the IDs for the medical focus, coordinator, and fundraiser based on their names.

Request body:
```json
{
  "name": "Fundraiser Gala",
  "date": "2025-04-10",
  "city": "Vancouver",
  "location": "Downtown Center",
  "medical_focus": "Brain Cancer",
  "capacity": 4,
  "coordinator": "Alice Johnson",
  "fundraiser": "Bob Smith",
  "details": "Annual fundraiser"
}
``` 
Returns (on success):
```json
{
  "message": "Event created successfully",
  "eventId": 1
}
```
Returns (on failure):
```json
{
  "error": "Failed to create event"
}
```

## 4. GET /events/:eventId/suggest-donors

**Generates two donor lists for a specific event based on matching logic:**

- best: Top matches (up to the event's capacity)

- additional: Extra matches (up to the event's capacity again)

**URL Params:**

- eventId (required): ID of the event

**Matching criteria:**

- Default filters: Event city, medical focus, engagement = "Highly Engaged"

- Query Parameters (optional): city, medical_focus, engagement

**Donor must not be:**

- already saved for the event

- currently added in the temp list

Donor can be included if previously deleted from the temp list 

**Example Request:**
```
curl http://localhost:5001/api/events/1/suggest-donors
```
**Example With Custom Filters:**
```
curl "http://localhost:5001/api/events/1/suggest-donors?city=Vancouver&medical_focus=Brain%20Cancer&engagement=Medium"
```
**Returns:**
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
Frontend Action: Temporarily add the donor before saving.

API Called:
```
POST /api/events/:eventId/donors/add
```
When to use:
- User selects a suggested or searched donor to add to the candidate list.
- No need to immediately persist to database.

What frontend does:
- Calls this endpoint with donorId.
- Updates the "current donor list UI" to show that the donor has been added.

## 6. POST /events/:eventId/donors/remove
Frontend Action: Temporarily remove the donor before saving.

API Called:
```
POST /api/events/:eventId/donors/remove
```
When to use:
- User wants to remove a donor from the event’s current selection.

What frontend does:
- Calls this with donorId.
- UI reflects that the donor is no longer selected.

## 7. POST /events/:eventId/donors/save
Frontend Action: Persists the donor list changes to the database.

API Called:
```
POST /api/events/:eventId/donors/save
```
When to use:
- After finishing all edits (add/remove).
- Save button is pressed.

What frontend does:
- Sends a request with just the event ID (no need for donor list—server uses tempDonorEdits).
- Optionally shows success toast/message and reloads donor list.

## 8. POST /events/:eventId/donors/cancel
Frontend Action: Discards all unsaved edits.

API Called:
```
POST /api/events/:eventId/donors/cancel
```
When to use:
- User decides not to save changes and wants to go back to the last saved state.

What frontend does:
- Calls the endpoint.
- Reloads the original saved donor list from the server (via GET /events/:eventId/suggest-donors or similar).

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

## 11. POST /api/login

**Description:** Authenticate a user using email and password.

**Request:**
- Method: POST
- URL: /api/login
- Headers:
```
  Content-Type: application/json
```
- Body (JSON):
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```
**Response:**
- Success (200):
```
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com"
  }
}
```
- Failure (401):
```
{
  "error": "Invalid email or password"
}
```
- Failure (500):
```
{
  "error": "Login failed"
}
```




