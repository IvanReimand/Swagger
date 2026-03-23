const client = require("../helpers/client");

const PET_ID = 2005085;

const pet = {
  id: PET_ID,
  name: "Doggo",
  status: "available",
  photoUrls: ["https://example.com/dog.jpg"],
};

describe('Pet API Tests', () => {
  it('should POST a pet and then GET it', async () => {
    // POST the pet
    const postResponse = await client.post('/pet', pet);
    expect(postResponse.status).toBe(200);

    // GET the pet
    const getResponse = await client.get(`/pet/${PET_ID}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.data.id).toBe(PET_ID);
    expect(getResponse.data.name).toBe("Doggo");
  });

  it('should PUT (update) a pet and then GET it', async () => {
    // First, ensure the pet exists (POST if needed)
    await client.post('/pet', pet);

    // Update the pet
    const updatedPet = { ...pet, name: "Updated Doggo", status: "sold" };
    const putResponse = await client.put('/pet', updatedPet);
    expect(putResponse.status).toBe(200);

    // GET the updated pet
    const getResponse = await client.get(`/pet/${PET_ID}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.data.name).toBe("Updated Doggo");
    expect(getResponse.data.status).toBe("sold");
  });

  it('should DELETE a pet and then GET it (expect 404)', async () => {
    // First, ensure the pet exists
    await client.post('/pet', pet);

    // DELETE the pet
    const deleteResponse = await client.delete(`/pet/${PET_ID}`);
    expect(deleteResponse.status).toBe(200);

    // GET the pet (should be 404)
    const getResponse = await client.get(`/pet/${PET_ID}`);
    expect(getResponse.status).toBe(404);
  });

  // Negative tests
  it('should return 404 when GETting with invalid ID', async () => {
    const getResponse = await client.get('/pet/abc');
    expect(getResponse.status).toBe(404);
  });

  it('should return 404 when DELETEing with invalid ID', async () => {
    const deleteResponse = await client.delete('/pet/abc');
    expect(deleteResponse.status).toBe(404);
  });

  it('should return 404 when GETting a non-existent pet', async () => {
    const nonExistentId = 999999999;
    const getResponse = await client.get(`/pet/${nonExistentId}`);
    expect(getResponse.status).toBe(404);
  });

  it('should return 200 when finding pets by invalid status (API accepts)', async () => {
    const getResponse = await client.get('/pet/findByStatus?status=invalid');
    expect(getResponse.status).toBe(200);
  });

  it('should return 200 when POSTing pet with missing photoUrls (API accepts)', async () => {
    const invalidPet = { name: "Invalid Pet" }; // missing required photoUrls
    const postResponse = await client.post('/pet', invalidPet);
    expect(postResponse.status).toBe(200);
  });

  it('should return 200 when PUTting a non-existent pet (API creates)', async () => {
    const nonExistentPet = { id: 999999999, name: "Ghost Pet", status: "available", photoUrls: [] };
    const putResponse = await client.put('/pet', nonExistentPet);
    expect(putResponse.status).toBe(200);
  });

  it('should return 200 when DELETEing a non-existent pet (API succeeds)', async () => {
    const nonExistentId = 999999999;
    const deleteResponse = await client.delete(`/pet/${nonExistentId}`);
    expect(deleteResponse.status).toBe(200);
  });
});

