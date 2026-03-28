const REPO_OWNER = 'zita-ch';
const REPO_NAME = 'techblogs';
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/`;
const RAW_URL = `https://raw.githubusercontent.com/zita-ch/${REPO_NAME}/main/`;

async function loadBlog() {
  const urlParams = new URLSearchParams(window.location.search);
  const postFile = urlParams.get('post');
  const listContainer = document.getElementById('blog-list');
  const postContainer = document.getElementById('blog-post');
  const contentDiv = document.getElementById('post-content');

  if (!listContainer || !postContainer || !contentDiv) return;

  try {
    if (postFile) {
      // Load individual post
      listContainer.style.display = 'none';
      postContainer.style.display = 'block';
      
      const response = await fetch(`${RAW_URL}${postFile}`);
      if (!response.ok) throw new Error(`Post not found: ${postFile}`);
      const markdown = await response.text();
      
      // Handle frontmatter if present (basic strip)
      const content = markdown.replace(/^---[\s\S]*?---/, '');
      
      // Compatibility check for different marked.js versions
      if (typeof marked === 'undefined') {
        throw new Error('Markdown library failed to load. Please check your internet connection or ad-blocker.');
      }
      const html = (typeof marked.parse === 'function') ? marked.parse(content) : marked(content);
      contentDiv.innerHTML = html;
      
      // Update page title if possible
      const titleMatch = markdown.match(/^title:\s*"(.*?)"/m) || markdown.match(/^title:\s*(.*?)$/m);
      if (titleMatch) {
          document.title = `${titleMatch[1]} | Tech Blog`;
      }
    } else {
      // Load list of posts
      listContainer.style.display = 'block';
      postContainer.style.display = 'none';
      
      const response = await fetch(API_URL);
      if (response.status === 403) {
         throw new Error('GitHub API rate limit exceeded. Please try again in 15-30 minutes.');
      }
      if (!response.ok) throw new Error(`Failed to fetch file list (Status: ${response.status})`);
      const files = await response.json();
      
      // Filter out system files and the template
      const excludedFiles = ['README.md', 'LICENSE.md', 'template.md'];
      let mdFiles = files.filter(f => f.name.endsWith('.md') && !excludedFiles.includes(f.name));
      
      if (mdFiles.length === 0) {
        listContainer.innerHTML = '<p>No blog posts found yet. Add some .md files to your techblogs repo!</p>';
        return;
      }

      // Sort by name descending (assuming YYYY-MM-DD-title.md for time order)
      mdFiles.sort((a, b) => b.name.localeCompare(a.name));

      let html = '<ul class="post-list">';
      for (const file of mdFiles) {
        const dateMatch = file.name.match(/^(\d{4}-\d{2}-\d{2})-(.*)\.md$/);
        let displayName, dateDisplay = '';
        
        if (dateMatch) {
          dateDisplay = `<span class="post-date text-muted">${dateMatch[1]}</span> `;
          displayName = dateMatch[2].replace(/-/g, ' ');
        } else {
          displayName = file.name.replace(/\.md$/, '').replace(/-/g, ' ');
        }

        html += `
          <li class="list__item">
            <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
              <h2 class="archive__item-title" itemprop="headline">
                <span>${dateDisplay}<a href="?post=${file.name}" rel="permalink">${displayName}</a></span>
              </h2>
            </article>
          </li>`;
      }
      html += '</ul>';
      listContainer.innerHTML = html;
    }
  } catch (error) {
    console.error('Tech Blog Error:', error);
    const target = postFile ? contentDiv : listContainer;
    target.innerHTML = `
      <div class="notice--danger">
        <p><strong>Error:</strong> ${error.message}</p>
        <button onclick="location.reload()" class="btn btn--primary">Retry</button>
      </div>`;
  }
}

// Global scope
window.loadBlog = loadBlog;

document.addEventListener('DOMContentLoaded', () => {
    loadBlog();
    window.addEventListener('popstate', loadBlog);
});
