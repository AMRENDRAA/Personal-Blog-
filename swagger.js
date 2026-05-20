const swaggerJsdoc = require("swagger-jsdoc");


const options = {


    definition: {
        openapi: "3.0.0",
        info: {
            title: "Users API",
            version: "1.0.0",
            description: "API Documentations",

        },
        servers: [
            {
                url: "http://localhost:8000",

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

    },

    apis: ["./routes/*js"],

}



const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;