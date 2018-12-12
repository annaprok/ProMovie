# REST API v1


## Огляд

### Точки доступу

Весь доступ до API відбувається через HTTPS та базовий URL `http://localhost:3000/api/v1/`. 
Всі дані відправляються і отримуються у форматі JSON.

Час подається у форматі [ISO 8601][date-iso]:

```
YYYY-MM-DDTHH:MM:SSZ
```

[Коренева точка доступу][api-root] до ProMovie API:

```
GET https://progbase.herokuapp.com/api/v1
```

Повертає словник зі всіма ресурсами, що доступні у API.



### Аутентифікація

#### Базова аутентифікація

Частина ресурсів доступні без аутентифікації, але деякі із ресурсів потребують [базової аутентифікації][basic-auth] для доступу до них. 


Якщо запит до такого ресурсу не міститиме даних користувача, то відповіддю буде статус `401 Unauthorized`.


## Фільми

### Список фільмів

`GET /api/v1/films`
Відповідь:

```json
{
    "films": [
        {
            "_id": "5be6e052ab93751ed6496d95",
            "filmImg": "/nutcracker.jpg",
            "filmHr": "/films/5be6e052ab93751ed6496d95",
            "filmDscrptn": "Some text 2",
            "filmName": "Some film 2",
            "writers": "",
            "stars": "",
            "date": null,
            "rate": null,
            "duration": null,
            "__v": 0
        },
        {
            "_id": "5be6e08fab93751ed6496d97",
            "filmImg": "/simple_favour.jpg",
            "filmHr": "/films/5be6e08fab93751ed6496d97",
            "filmDscrptn": "Some text",
            "filmName": "Some film 3",
            "writers": "",
            "stars": "",
            "date": null,
            "rate": null,
            "duration": null,
            "__v": 0
        },
        {
            "_id": "5be6e0b8ab93751ed6496d98",
            "filmImg": "/predator.jpg",
            "filmHr": "/films/5be6e0b8ab93751ed6496d98",
            "filmDscrptn": "Some text 1",
            "filmName": "Some film 1",
            "writers": "",
            "stars": "",
            "date": null,
            "rate": null,
            "duration": null,
            "__v": 0
        },
        {
            "_id": "5be6e45560873120f99c6c50",
            "filmImg": "/nutcracker.jpg",
            "filmHr": "/films/5be6e45560873120f99c6c50",
            "filmDscrptn": "Some text 4",
            "filmName": "Some film 4",
            "writers": "",
            "stars": "",
            "date": null,
            "rate": null,
            "duration": null,
            "__v": 0
        },
        {
            "_id": "5be6e4cd60873120f99c6c51",
            "filmImg": "/nutcracker.jpg",
            "filmHr": "/films/5be6e4cd60873120f99c6c51",
            "filmDscrptn": "Some text 4",
            "filmName": "Some film 4",
            "writers": "",
            "stars": "",
            "date": null,
            "rate": null,
            "duration": null,
            "__v": 0
        }
    ],
    "pageSize": 5,
    "totalFilms": 17,
    "currentPage": 1,
    "pages": [
        {
            "id": 1,
            "status": "/api/v1/films?page=1"
        },
        {
            "id": 2,
            "status": "/api/v1/films?page=2"
        },
        {
            "id": 3,
            "status": "/api/v1/films?page=3"
        },
        {
            "id": 4,
            "status": "/api/v1/films?page=4"
        }
    ]
}
```

### Отримати фільм

`GET /api/v1/film/:film_id`

Відповідь:

```json
{
    "_id": "5be6e4cd60873120f99c6c51",
    "filmImg": "/nutcracker.jpg",
    "filmHr": "/films/5be6e4cd60873120f99c6c51",
    "filmDscrptn": "Some text 4",
    "filmName": "Some film 4",
    "writers": "",
    "stars": "",
    "date": null,
    "rate": null,
    "duration": null,
    "__v": 0
}
```

### Створити новии фільм

`POST /api/v1/films/new`

Відповідь:

```json
{
    "_id": "5be6e4cd60873120f99c6c51",
    "filmImg": "/nutcracker.jpg",
    "filmHr": "/films/5be6e4cd60873120f99c6c51",
    "filmDscrptn": "Some text 4",
    "filmName": "Some film 4",
    "writers": "",
    "stars": "",
    "date": null,
    "rate": null,
    "duration": null,
    "__v": 0
}
```



### Видалити фільм

`POST /api/v1/films/delete/?id=:film_id`

Відповідь:

```json
OK
```


## Користувачі

### Отримати інформацію про всіх користувачів

`GET /api/v1/users`

Відповідь:

```json
 {
            "_id": "5bf701f21a42840f5b953cb3",
            "login": "log1",
            "role": 0,
            "registeredAt": "2018-11-22T19:22:26.180Z",
            "avaUrl": "/users1.jpg",
            "isDisabled": false,
            "password": "pas1",
            "bio": "Bio",
            "hr": "/users/5bf701f21a42840f5b953cb3",
            "email": "some email",
            "__v": 0
        },
        {
            "_id": "5bf703b013a46a1089e53247",
            "login": "log1",
            "role": 0,
            "registeredAt": "2018-11-22T19:29:52.679Z",
            "avaUrl": "/users1.jpg",
            "isDisabled": false,
            "password": "",
            "bio": "Bio",
            "hr": "/users/5bf703b013a46a1089e53247",
            "email": "some email",
            "__v": 0
        },
        {
            "_id": "5bf703d65b878910d9e6086b",
            "login": "log1",
            "role": 0,
            "registeredAt": "2018-11-22T19:30:30.115Z",
            "avaUrl": "/users1.jpg",
            "isDisabled": false,
            "password": "",
            "bio": "Bio",
            "hr": "/users/5bf703d65b878910d9e6086b",
            "email": "some email",
            "__v": 0
        }
    ],
    "pageSize": 5,
    "totalUsers": 25,
    "currentPage": 1,
    "pages": [
        {
            "id": 1,
            "status": "/api/v1/users?page=1"
        },
        {
            "id": 2,
            "status": "/api/v1/users?page=2"
        },
        {
            "id": 3,
            "status": "/api/v1/users?page=3"
        },
        {
            "id": 4,
            "status": "/api/v1/users?page=4"
        },
        {
            "id": 5,
            "status": "/api/v1/users?page=5"
        }
    ]
}
```

### Отримати інформацію про користувача

`GET /api/v1/users/:user_id`

Відповідь:

```json
{
    "_id": "5bed1f4175804c11e98c55aa",
    "login": "log",
    "role": 0,
    "registeredAt": "2018-11-15T07:24:49.730Z",
    "avaUrl": "/predator.jpg",
    "isDisabled": false,
    "password": "1",
    "bio": "Bio",
    "hr": "/users/5bed1f4175804c11e98c55aa",
    "__v": 0
}
```

### Створити нового користувача

`POST /api/v1/users/new`

Відповідь:

```json
{
    "_id": "5c06be9d64ea0e35cbb6d9a8",
    "login": "user",
    "fullname": "Some User",
    "role": 1,
    "registeredAt": 1543945885571,
    "avaUrl": "/bohemian_rapsody.jpg",
    "isAdmin": true,
    "password": "151d75387d1bf3e6b4ecf9de0ad6a590361baa47e9f24c4d817e47d7c96a7d6b8d3e525a0bb2b94df7ef2c89498a6870658fccc1fbc5fbaa2d3f18541f5ee4ba5219fbde008e0898f46742dbe6933f0f460c61b700b9e38ccc177c4aae4eacf43029b72ff5d03b0f4680200f6cfc2276429b6638c4678aeafeaa21536c0085a82fda2db719930b9e34a921f8c040af7e10d203e8f602ada7fe335bccd1fc272c801b976cc304efc095e91e0fa4d6ddb2ea5dee0bb6e6fba2c586e0d465bb621aa97970df00396b54dbb82421ff9d491e6a76c65b11adf9cd46f26852d132b124a17e9f1f7fab833b3e8b0f4ada295c69bc845a8330f2799cb7d8126990d3bf2f537f5048de065f24a96528e3262023499ed669f4d85e79909a0826117a32dbf3fdaedcd587db0bb98e959df906e729abd3c0e785aff53b4db768ce6c6c7c63da9893f77d872f7b1530fbd114a9da2be19656e5b9c18eb0d2f8118c299ac86d00895e5dd3f588dce86336760ffe491e14c9aee8d562a9473ea9c9b3b88b6aa4bcf012f6d6288af8150d6438adb73dfc37142d47b4890f8d0ad79fea7ce32599578aada242aab366953a23347394c7c861ae884ed3c085195cab82168d7c2f4a0160bbab146e0fe3a1713982acddf2f13ded928e9edee015ff0c9d6dfa9890f1b782fc0739cb114c301b74e267d4104fbc965f1a3e202406207c13f91d770b64b6",
    "bio": "Bio",
    "hr": "/users/5c06be9d64ea0e35cbb6d9a8",
    "email": "email",
    "salt": "557d9755578094245db83107465c6a56"
}
```

### Видалити користувача

`POST /api/v1/users/delete`

Відповідь:

```json
OK
```

## Колекції

### Список всіх колекцій

`GET /api/v1/collections`

Відповідь:

```json
{
    "collections": [
        {
            "filmsId": [
                "5be6e08fab93751ed6496d97"
            ],
            "_id": "5be6e0e2ab93751ed6496d99",
            "colDscrptn": "Some text 1",
            "colName": "Collection 1",
            "colHr": "/collections/5be6e0e2ab93751ed6496d99",
            "__v": 0
        }
    ],
    "pageSize": 5,
    "totalCollections": 1,
    "currentPage": 1,
    "pages": [
        {
            "id": 1,
            "status": "/api/v1/collections?page=1"
        }
    ]
}
```

### Отримати інформацію про колекцію

`GET /api/v1/collections/:collection_id`

Відповідь:

```json
{
    "_id": "5be6e0e2ab93751ed6496d99",
    "colName": "Collection 1",
    "colDscrptn": "Some text 1",
    "films": [
        {
            "_id": "5be6e08fab93751ed6496d97",
            "filmImg": "/simple_favour.jpg",
            "filmHr": "/films/5be6e08fab93751ed6496d97",
            "filmDscrptn": "Some text",
            "filmName": "Some film 3",
            "writers": "",
            "stars": "",
            "date": null,
            "rate": null,
            "duration": null,
            "__v": 0
        }
    ]
}
```

### Створити нову колекцію

`POST /api/v1/collections/new`

Відповідь:

```json
{
    "_id": "5be6e0e2ab93751ed6496d99",
    "colName": "Collection 1",
    "colDscrptn": "Some text 1",
    "films": [
        {
            "_id": "5be6e08fab93751ed6496d97",
            "filmImg": "/simple_favour.jpg",
            "filmHr": "/films/5be6e08fab93751ed6496d97",
            "filmDscrptn": "Some text",
            "filmName": "Some film 3",
            "writers": "",
            "stars": "",
            "date": null,
            "rate": null,
            "duration": null,
            "__v": 0
        }
    ]
}
```

### Видалити колекцію

`POST /api/v1/collections/delete`

Відповідь:

```json
OK
```

### Пошук колекції за ім'ям

`GET /api/v1/collections/search`


