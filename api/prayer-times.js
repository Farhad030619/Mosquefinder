export default async function handler(req, res) {
  const city = req.query.city || 'Stockholm';
  const country = req.query.country || 'Sweden';
  const method = req.query.method || '3';

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${encodeURIComponent(method)}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch prayer times: ${response.statusText}` 
      });
    }

    const data = await response.json();

    // Cache the response on Vercel for 1 hour, and allow serving stale data for 10 minutes while fetching in background
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(data);
  } catch (error) {
    console.error("API proxy error:", error);
    return res.status(500).json({ 
      error: error.message || 'Internal Server Error' 
    });
  }
}
