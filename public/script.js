async function searchManga() {
  const query = document.getElementById('searchInput').value.trim();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = 'Loading...';

  try {
    const res = await fetch(`/api/search?title=${encodeURIComponent(query)}`);
    const data = await res.json();
    resultsDiv.innerHTML = '';

    if (!data.data.length) {
      resultsDiv.innerHTML = 'No results found.';
      return;
    }

    for (const manga of data.data) {
      const title = manga.attributes.title.en || 'No Title';
      const desc = manga.attributes.description.en || 'No description available.';
      const mangaId = manga.id;
      const cover = manga.relationships.find(r => r.type === 'cover_art');
      const fileName = cover?.attributes?.fileName;
      const imgUrl = fileName ? `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg` : '';

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${imgUrl}" alt="${title}" />
        <h3>${title}</h3>
        <p>${desc.slice(0, 120)}...</p>
        <div class="chapters">Loading chapters...</div>
      `;
      resultsDiv.appendChild(card);

      try {
        const chapterRes = await fetch(`/api/chapters?id=${mangaId}`);
        const chapterData = await chapterRes.json();
        const chapterDiv = card.querySelector('.chapters');
        chapterDiv.innerHTML = '<strong>Chapters:</strong><br>';
        chapterData.data.forEach(ch => {
          const chNum = ch.attributes.chapter || '?';
          const chTitle = ch.attributes.title || '';
          chapterDiv.innerHTML += `Chapter ${chNum} - ${chTitle}<br>`;
        });
      } catch {
        card.querySelector('.chapters').innerHTML = 'Failed to load chapters.';
      }
    }
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = 'Error fetching manga.';
  }
}