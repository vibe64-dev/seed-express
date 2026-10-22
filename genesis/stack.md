# Stack

## Stack packages
- `genesis-stack`

## Components
- `nodejs`
- `express`
- `sqlite`

## Resources

```json genesis-resource
{
  "id": "database",
  "kind": "sqlite",
  "environmentAlternatives": [
    {
      "bindings": {
        "database": "DB_DATABASE"
      },
      "preferred": true
    }
  ]
}
```

## Verification

- Verify `application`: `npm` `test`

## Connected development

- Default package type: `npm`

## Deployment

- Runtimes: `nodejs`
- Recreate on restore: `node_modules`
- Ready when: `GET` `/health` returns `200`
- Prepare `Install dependencies`: `npm` `ci` `--omit=dev`
- Migrate `Apply migrations`: `npm` `run` `migrate`
- Serve `Start`: `node` `bin/www`

## Outputs

### Target `app`: Run Express app

- Default.
- Mode: `interactive`
- Runtimes: `nodejs`
- Run `Develop`: `npm` `run` `dev`

#### Presentation

- Kind: `web`
- Preferred port: `3000`
- URL path: `/`
- Ready when: `GET` `/health` returns `200`

## Workspace setup

- Prepare `Install dependencies` with `nodejs` when `package.json` exists: `npm` `ci`
- Prepare `Create development secret` with `nodejs` when `package.json` exists: `npm` `run` `dev-secret`
- Prepare `Apply migrations` with `nodejs` when `package.json` exists: `npm` `run` `migrate`
