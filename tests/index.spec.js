import request from "supertest";
import { server } from "../index.js";
import { faker } from "@faker-js/faker";

describe("get/cafes", () => {
    it('should respond with a 200 status', async () => {
        const response = await request(server).get('/cafes');
        expect(response.status).toBe(200);
        //Here I check that the status code is 200 while sending a get request
    });

    it('should be an array of cafes', async () => {
        const response = await request(server).get('/cafes');
        expect(response.body).toBeInstanceOf(Array);
        //In this section it checks that the response is actually an array
    });

    it('should not be an empty array of cafes', async () => {
        const response = await request(server).get('/cafes');
        expect(response.body).not.toHaveLength(0);
        //and finally in here it checks that the array is not empty, ergo it has a length not equal to zero
    })
});

describe('POST/cafe', () => {
    describe('Register a new Coffee after the name of a client', () =>{
        const newCoffee = {
            cafe: {
              id: faker.random.numeric(2),
              nombre: faker.name.firstName()
            }};
        it('should respond with an 201 status', async() => {
            const response = await request(server).post('/cafes').send(newCoffee);
            expect(response.status).toBe(201);
            //in here it checks that providing a random number with two digits and a random frst name, it can be registered as a new coffee
        })
    })
})

describe('PUT/cafe/:id', () => {
    describe('trying to change a coffee with the wrong id', () => {
        const newid = faker.random.numeric(2);
        const newCoffee = {
            cafe: {
              id: newid,
              nombre: faker.name.firstName("male")
            }};
        it('should respond with a 400 status', async() => {
            const inputingNewCoffee = await request(server).post('/cafes').send(newCoffee);
            const newdata = {
                cafe: {
                    id: faker.random.numeric(3),
                    nombre: faker.name.firstName("female")
                }
            };
            const response = await request(server).put(`/cafes/${newid}`).send(newdata);
            expect(response.status).toBe(400);
            //for this one it uses a random numeric ID with two digits to create a new coffee with a random male name
            //later with a random numeric ID with three digits tries to change the new coffe recently created with a different ID and name(female)
        })
    })
})

describe('DELETE/cafe/:id', () => {
    describe('Delete a Coffee with an invalid ID', () =>{
        const newid = faker.random.alphaNumeric(5);
        const token = faker.random.alphaNumeric(10);
        it('should respond with an 404 status', async() => {
            const response = await request(server)
                .delete(`/cafes/${newid}`)
                .set("Authorization", token);
            expect(response.status).toBe(404);
            //By giving the code an alphanumeric id with 5 digits it shouldn't find it, and therefore wouldn't be able to delete
        })
    })
})

afterAll(() => {
    server.close();
})