export async function getImages() {
  const res = await fetch(
    'https://storage.googleapis.com/panels-api/data/20240916/media-1a-i-p~s',
    { next: { revalidate: 3600 } } // Revalidate every hour
  );
  if (!res.ok) {
    throw new Error('Failed to fetch images');
  }
  const data = await res.json();
  return data.data;
}
