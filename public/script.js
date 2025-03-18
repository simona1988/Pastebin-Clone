const PREVIEW_LENGTH = 30;

async function loadSnippets() {
    const response = await fetch('/snippets');
    const snippets = await response.json();
    const list = document.getElementById('snippetsList');
    list.innerHTML = '';
    snippets.forEach(snippet => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        let preview;
        if (snippet.content.length > PREVIEW_LENGTH) {
            preview = snippet.content.substring(0, PREVIEW_LENGTH) + '...';
        } else {
            preview = snippet.content;
        }
        listItem.innerHTML = `<a href="/snippets/${snippet.id}" class="text-decoration-none">${preview}</a>`;                
        list.appendChild(listItem);
    });
}

document.getElementById('snippetForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('content').value;           
    if (!content.trim()) {
        return alert('Textul nu poate fi gol!');    
    }        
    await fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });
    document.getElementById('content').value = ''; 
    loadSnippets(); 
});

loadSnippets();