import swaggerJSDoc from "swagger-jsdoc";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shiaomi",
      version: "1.0.0",
      description: "Api Documentation for Shiaomi Project",
    },
    servers: [
      {
        url: "http://localhost:5005",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security:[
        {
            bearerAuth:[]
        }
    ]
  },
  apis:['./Modules/**/docs.js']
};
export const swaggerSpec = swaggerJSDoc(options);
