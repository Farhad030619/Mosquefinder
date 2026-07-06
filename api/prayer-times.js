export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);
  const city = url.searchParams.get('city') || 'Stockholm';
  const country = url.searchParams.get('country') || 'Sweden';
  const method = url.searchParams.get('method') || '3';

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${encodeURIComponent(method)}`
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch prayer times: ${response.statusText}` }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
