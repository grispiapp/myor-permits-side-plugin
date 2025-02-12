## Plugin Definitions

### Manifest

```json
{
  "title": "KVKK/Pazarlama İzinleri",
  "src": "https://grispi.app/myor-permits-side-plugin/build/",
  "uiDefinition": {
    "height": 900
  },
  "singleton": false,
  "lazy": true
}
```

### Settings

```json
{}
```

## Testing the Application

To test the application within Grispi, simply run the following command:

```sh
yarn start
```

If you want to test outside of Grispi, make sure to comment out the `GrispiClient.instance()` block in the `contexts/grispi-context.tsx` file.

## GrispiClient Instance Initialization

The `GrispiClient.instance()` initialization code is as follows:

```tsx
useEffect(() => {
  GrispiClient.instance()
    ._init()
    .then((data: GrispiBundle) => {
      setTicket(data.context.ticket);
      setSettings(data.settings);
      setLoading(false);

      GrispiClient.instance().activeTicketChanged = function (ticket: Ticket) {
        setTicket(ticket);
      };
    })
    .catch((err) => {
      console.error({ err });
    });
}, []);
```

# Sources

- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn](https://shadcn.dev/)
- [Craco](https://github.com/gsoft-inc/craco)
- [Create React App](https://github.com/facebook/create-react-app)
- [React documentation](https://reactjs.org/)
