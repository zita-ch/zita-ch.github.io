---
title: "Tech Blog"
layout: single
permalink: /tech-blog/
author_profile: true
---

<div id="tech-blog-container">
  <div id="blog-list" class="archive">
    <p><i class="fas fa-spinner fa-spin"></i> Loading posts...</p>
  </div>
  <div id="blog-post" style="display: none;">
    <p><a href="/tech-blog/" class="btn btn--primary"><i class="fas fa-arrow-left"></i> Back to Blog</a></p>
    <hr>
    <div id="post-content"></div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script>
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

    if (postFile) {
      // Load individual post
      listContainer.style.display = 'none';
      postContainer.style.display = 'block';
      try {
        const response = await fetch(`${RAW_URL}${postFile}`);
        if (!response.ok) throw new Error('Post not found');
        const markdown = await response.text();
        
        // Handle frontmatter if present (basic strip)
        const content = markdown.replace(/^---[\s\S]*?---/, '');
        contentDiv.innerHTML = marked.parse(content);
        
        // Update page title if possible
        const titleMatch = markdown.match(/^title:\s*"(.*?)"/m) || markdown.match(/^title:\s*(.*?)$/m);
        if (titleMatch) {
            document.title = `${titleMatch[1]} | Tech Blog`;
        }
      } catch (error) {
        contentDiv.innerHTML = `<p>Error loading post: ${error.message}</p>`;
      }
    } else {
      // Load list of posts
      listContainer.style.display = 'block';
      postContainer.style.display = 'none';
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch file list');
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
          // Try to extract date from YYYY-MM-DD-title.md
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
      } catch (error) {
        listContainer.innerHTML = `<p>Error loading blog list: ${error.message}</p>`;
      }
    }
  }

  window.addEventListener('popstate', loadBlog);
  loadBlog();
</script>

<style>
  .post-list {
    list-style: none;
    padding: 0;
  }
  .archive__item-title {
    margin-bottom: 0.5em;
  }
  #post-content img {
    max-width: 100%;
    height: auto;
  }
  #post-content pre {
    background: #f4f4f4;
    padding: 1em;
    overflow-x: auto;
  }
</style>
