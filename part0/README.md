# Submissions to exercises part 0

This file contains the submitted solutions to exercises 0.4-0.6 of part 0, see [Exercises 0.1-0.6](https://fullstackopen.com/en/part0/fundamentals_of_web_apps#exercises-0-1-0-6).

## Exercise 0.4: New note diagram

```mermaid

sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: HTML Response with Status Code 302 and Redirect URL https://studies.cs.helsinki.fi/exampleapp/notes
    deactivate server
    
	Note left of server: Server reads POST body, creates new note object and adds it to notes array

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML Document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
```

## Exercise 0.5: Single page app diagram

```mermaid

sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: Respond with Status Code 200 and HTML document
    deactivate server
    
    Note left of server: The HTML document does not have the notes already added in the HTML tree

	browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
	activate server
	server-->>browser: the css file
	deactivate server
	
	browser->>server: Get https://studies.cs.helsinki.fi/exampleapp/spa.js
	activate server
	server-->>browser: the single page application JavaScript file
	deactivate server
	
	browser->>server: Get https://studies.cs.helsinki.fi/exampleapp/data.json
	activate server
	server-->>browser: the notes collection as JSON Object
	deactivate server
	
	Note right of browser: The browser populates the HTML document with the notes data according the JavaScript Code and renders populated document
```

## Exercise 0.6: New note in Single page app diagram

```mermaid

sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Respond with Status Code 201 and JSON Object
    
	Note right of browser: Before POST is sent, the browser creates a new note element, adds it to the HTML document and rerenders whole document
	
	Note left of server: A JSON representation of the new note object is sent to the server along the POST, where it is stored in the notes array
```