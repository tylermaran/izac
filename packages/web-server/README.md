Izac's Bar-Back(end)
================================================================================

The backend component to Izac's Bar. It serves a RESTful API that fires the
necessary pins when drink orders arrive.


Testing
--------------------------------------------------------------------------------

### Integration

 * Dependencies: `curl`, [`jq`][jq]
 * Run: `./test/integration.sh`


High-Level Routes
--------------------------------------------------------------------------------


* [GET /bottles](#get-bottles): list of bottles
* [POST /bottles](#post-bottles): add a new bottle to the system
* [GET /bottles/:id](#get-bottle): get a bottle info
* [POST /bottles/:id/refill](#post-refill): refill a bottle

* [GET /drinks](#get-drinks): drink names, id, misc. listing info.
* [GET /drinks/:id](#get-drink): get all drink information for one drink
* [POST /drinks/:id/pour](#post-pour): trigger a pour (drains bottles)
* [POST /drinks](#post-drinks): add a new drink

> @TODO: Currently the machine's specifications (where the bottles are
> located) are hard-coded in the server's backend. When clients request
> a drink pour, the backend has a hard-coded mapping of a bottle to the
> pinout we're firing. It would be cool in the future to allow this to
> change in code, but also access the data to get a high-level overview
> of the bottles that are currently in the machine... needs more thought.


JSON Requests/Responses
--------------------------------------------------------------------------------

<a name="get-bottles"></a>
```json
GET /bottles
  200 => {
    "bottles": [
      {
        "id": 0,
        "name": "Rum",
        "max_liters": 1.5,
        "current_liters": 1.5
      },
      {
        "id": 1,
        "name": "Lemon-Lime",
        "max_liters": 2,
        "current_liters": 1.5
      }
    ]
  }
```

<a name="post-bottles"></a>
```json
POST /bottles
  body => {
    "name": "Gin",
    "max_liters": 1.5
  }
  200 => {
    "id": 2,
    "name": "Gin",
    "max_liters": 1.5,
    "current_liters": 1.5
  }
```

<a name="get-bottle"></a>
```json
POST /bottles/:id
  200 => {
    "id": 2,
    "name": "Gin",
    "max_liters": 1.5,
    "current_liters": 1.5
  }
```

<a name="post-refill"></a>
```json
POST /bottles/:id/refill
  204 => (empty success reply)
```

<a name="get-drinks"></a>
```json
GET /drinks
  200 => {
    "drinks": [
      {
        "id": 0,
        "name": "Rum Lemon-Lime",
        "pours": [
          { "bottle_id": 0, "liters": 0.035 },
          { "bottle_id": 1, "liters": 0.200 }
        ]
      }
    ]
  }
```

<a name="get-drink"></a>
```json
GET /drinks/0
  200 => {
    "id": 0,
    "name": "Rum Lemon-Lime",
    "pours": [
      { "bottle_id": 0, "liters": 0.035 },
      { "bottle_id": 1, "liters": 0.200 }
    ]
  }
```

<a name="post-pour"></a>
```json
POST /drinks/0/pour
  204 => (empty success reply)
```

<a name="post-drinks"></a>
```json
POST /drinks
  body => {
    "name": "Gin & Lemon-Lime",
    "pours": [
      { "bottle_id": 0, "liters": 0.035 },
      { "bottle_id": 1, "liters": 0.200 }
    ]
  }
  200 => {
    "id": 2,
    "name": "Gin & Lemon-Lime",
    "pours": [
      { "bottle_id": 0, "liters": 0.035 },
      { "bottle_id": 1, "liters": 0.200 }
    ]
  }
```
