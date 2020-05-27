const supertest = require("supertest")
const app = require("../index")

const server = app.listen()
const request = supertest.agent(server)

describe("testing with supertest", () => {

    this.timeout = 5000;
    afterAll(() => {
        server.close()
    })

    it('should response correctly', function (done) {
        request.get("/").send().expect(200, (err, res) => {
            done(err)
        })
    });
})
