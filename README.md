# Task Manager Application

A simple Task Manager application build with Angular and Tailwind CSS.

## Getting Started

Make sure you have NodeJS installed in your machine. Then from the project root, run the following:

```bash
npm install
```

## Development server

To start a local development server and a fake REST API with JSON Server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

## Additional features implemented

Simple Routes handling with Page Not Found and redirects.

A dark mode toggle button to demonstrate Tailwind flexibility.

Added "Create another" functionality to the "New task" dialog. This makes it more efficient for users to create multiple tasks.

Presenting the creation date as a relative time, like "Created 2 days ago".

## Todos

Handle empty states like "Create your first task" and "No search results".

Better error handling.

Drag and drop to change task status.

Utilize Angular i18nPlural pluralization pipe to display a task count for each swimlane.

## Additional Resources

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.11.

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
