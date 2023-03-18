const app = require("./app");
const swaggerDocs = require("./utils/swagger");
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
