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

### Setup

- Create a .env file in the root directory of the project.
- Copy the contents of .env.example (if it exists) into .env.
- Fill the .env file with your values.

Example of a `.env` file:

```
API_KEY='your_api_key'
AUTH_DOMAIN='your_project.firebaseapp.com'
PROJECT_ID='your_project_id'
STORAGE_BUCKET='your_project.appspot.com'
MESSAGING_SENDER_ID='your_sender_id'
APP_ID='your_app_id'
MEASUREMENT_ID='your_measurement_id'
```

### Adding New Variables

If you need to add a new environment variable:

- Add it to the `.env` file.
- Update `.env.example` (if used) by adding the new variable without a real value.
- Add the new variable to `src/environments/environment.template.ts`.
- Update `config-env.js` by adding the new variable to the environmentVariables list.
- Use the new variable in your code through the environment object.

### Security

- Never commit the .env file to the repository.
- Make sure .env is added to .gitignore.
- Do not use real secret values in .env.example or environment.template.ts.

### Troubleshooting

If you encounter issues with environment variables:

- Make sure all necessary variables are set in the `.env` file.
- Check if the `config-env.js` script is working correctly.
- Check the console for warnings about missing variables.

If problems persist, refer to the project documentation or contact the development team.
