---
title: "Tech Blog"
layout: single
permalink: /tech-blog/
author_profile: true
---

<p class="text-muted">All blogs are synced from <a href="https://github.com/zita-ch/techblogs">https://github.com/zita-ch/techblogs</a></p>

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
<script src="{{ '/assets/js/tech-blog.js' | relative_url }}"></script>

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
