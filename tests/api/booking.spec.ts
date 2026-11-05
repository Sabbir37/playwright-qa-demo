import { expect, test } from "@playwright/test";

/** Restful Booker: a public API built for practising API testing. */
const booking = {
  firstname: "Sabbir",
  lastname: "Hossain",
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: "2026-12-01", checkout: "2026-12-05" },
  additionalneeds: "Breakfast",
};

test.describe.configure({ mode: "serial" });

test.describe("Booking API: create, read, update, delete", () => {
  let token: string;
  let id: number;

  test("POST /auth returns a token for valid credentials", async ({ request }) => {
    const res = await request.post("/auth", { data: { username: "admin", password: "password123" } });
    expect(res.status()).toBe(200);
    token = (await res.json()).token;
    expect(token).toMatch(/^\w+$/);
  });

  test("POST /auth with a wrong password gives no token", async ({ request }) => {
    const res = await request.post("/auth", { data: { username: "admin", password: "nope" } });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ reason: "Bad credentials" });
  });

  test("POST /booking creates a booking and echoes it back", async ({ request }) => {
    const res = await request.post("/booking", { data: booking });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toEqual(booking);
    id = body.bookingid;
  });

  test("GET /booking/:id returns the saved booking", async ({ request }) => {
    const res = await request.get(`/booking/${id}`);
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(booking);
  });

  test("PUT /booking/:id without a token is refused", async ({ request }) => {
    const res = await request.put(`/booking/${id}`, { data: { ...booking, totalprice: 1 } });
    expect(res.status()).toBe(403);
  });

  test("PATCH /booking/:id with a token updates one field", async ({ request }) => {
    const res = await request.patch(`/booking/${id}`, {
      data: { totalprice: 200 },
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ...booking, totalprice: 200 });
  });

  test("DELETE /booking/:id removes it, then GET returns 404", async ({ request }) => {
    const del = await request.delete(`/booking/${id}`, { headers: { Cookie: `token=${token}` } });
    expect(del.status()).toBe(201);
    const res = await request.get(`/booking/${id}`);
    expect(res.status()).toBe(404);
  });
});
