# Intresmart company website

This project based on

- Angular version 18.2.0.
- Server Side Rendering
- Firebase for backend services
- Angularfire
- Tailwind

## Development process

`ng serve` run a dev server, navigate to `http://localhost:4200/`.

`ng build` to build the project in the `dist/` directory.

## Firebase Integration

This project uses Firebase for backend services.
Configuration for Firebase can be found in `src/app/app.config.ts`.

To use Firebase, you need to add the `firebase` property to the `src/environment/environment.ts` file:

```
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
```
