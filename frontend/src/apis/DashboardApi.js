const URL = "http://localhost:8080";

export async function fetchDashboard(userId) {
  console.log("hello");

  const response = await fetch(`${URL}/api/dashboard/${userId}`);

  console.log("soukaina");

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} `);
  }

  const data = await response.json();


  return data;
}
